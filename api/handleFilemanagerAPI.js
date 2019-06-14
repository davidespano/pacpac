const path = require('path')
    , loginRequired = require('./middlewares/loginRequired').loginRequired
    , sharp = require("sharp")
    , mkdirp = require('mkdirp')
    , filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware
    , ffmpeg = require('fluent-ffmpeg')
    , ffmpegPath = require('ffmpeg-static').path
    , ffprobePath = require('ffprobe-static').path
    , fs = require('fs')
    , Media = require('./models/media')
    , dbUtils = require('./neo4j/dbUtils')
    , Asset = require('./models/neo4j/asset');

const fileManagerConfig = {
    fsRoot: path.resolve(__dirname, 'public'),
    rootName: 'Main Root'
};

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function genVideoScreenshot(file, dir, subPath){
    const output = dir+'/_thumbnails_/'+subPath + '/' + file.filename+'.png';
    return new Promise((resolve,reject) =>{
        ffmpeg(file.path)
            .on('error', (err)=>{
                reject(err);
            })
            .on('end', () => {
                console.log('genVideoScreenshot', output);
                resolve(output)
            })
            .screenshots({
                count: 1,
                folder: dir+'/_thumbnails_/' + subPath,
                filename: file.filename + '.png'
            });
    })
}

async function createThumbnails(session, files, dir, gameID){
    const promises = [];

    await new Promise((resolve, reject) => fs.mkdir(dir + '/_thumbnails_',(err) => {
        if(!err)
            resolve();
        reject(err);
    })).catch(()=>{});

    files.forEach((file) => {
        let promise;
        //relative path of the file
        let filePath = path.resolve(__dirname,file.path).replace(/(^.*?[\\/]public[\\/].*?[\\/])/,"");
        let fileAncestorsPath = filePath.replace(/(?:(.*)[\\/])*.*?$/,"$1");//ancestors without filename


        promises.push(new Promise((resolve,reject) => {
            mkdirp(fileAncestorsPath, (err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        }));

        if (file.mimetype.includes("video"))
            promise = (genVideoScreenshot(file, dir, fileAncestorsPath).catch(err => console.error(err)));
        else
            promise = new Promise((resolve,reject) => resolve(dir + '/' + filePath));


        //take metadata with sharp and resize image
        promise = promise.then((res) => {
            const image = sharp(res);
            return image.metadata().then((metadata) => {
                //Create or update the media
                let asset = new Asset({path:filePath,filename: file.filename, width: metadata.width, height: metadata.height});
                return Media.createUpdateAsset(session, asset, gameID).then(()=>{
                    //using a buffer to override the old image
                    return image
                        .resize(900)
                        .toBuffer(function(err, buffer) {
                            fs.writeFile(dir + '/_thumbnails_/' + fileAncestorsPath + "/" + path.parse(res).base, buffer, function(e) {

                            });
                        });
                });
            })}).catch(err => console.error(err));

        promises.push(promise);
    });
    await Promise.all(promises);
}

function uploadHandler(req, res, next) {
    const dir = path.resolve(__dirname, 'public' + '/' + req.params.gameID);
    const send = res.send;
    const gameID = req.params.gameID;
    const session = dbUtils.getSession(req);

    let promises = [];

    if(req.files){
        req.files.forEach((file)=>{
            //relative path of the file
            let filePath = path.resolve(__dirname,file.path).replace(/(^.*?[\\/]public[\\/].*?[\\/])/,"");
            let asset = new Asset({path: filePath,filename:file.filename});

            promises.push(Media.createUpdateAsset(dbUtils.getSession({}), asset, gameID));
        });
    };

    console.log("uploadHandler",req.params.gameID);
//override send function, used to check when the file is uploaded completely
    res.send = function (body) {
        //Creation of the thumbnails and call of the former send fuction
        createThumbnails(session, req.files, dir, gameID)
            .then(() => {
                send.call(this, body);
                return Promise.all(promises);
            }).catch(err => console.error("uploadHandler",err));
    };
    next();
}

function deleteHandler(req, res, next){
    const dir = path.resolve(__dirname, 'public' + '/' + req.params.gameID);
    let regex = RegExp('.*\.mp4$');
    let filename = regex.test(req.body.name) ? (req.body.name + '.png') : req.body.name;
    let filePath = "";

    //building filePath from file ancestors excluding root
    if(req.body.ancestors){
    req.body.ancestors.slice(1).forEach((ancestor) => {
       filePath +=  ancestor.name + '/';
    });
    }

    filePath += req.body.name;

    console.log("haha",filePath);

    Media.deleteByPath(dbUtils.getSession({}),filePath, req.params.gameID);

    new Promise((resolve,reject) => fs.unlink(dir + '/_thumbnails_/' + filename, err => {
        if(!err)
            resolve();
        reject(err);
    }))
        .catch((err) => console.error("delete",err));
    next()
}

function handleFilemanagerAPI(api)
{
    api.post('/filemanager/:gameID/files', uploadHandler);
    api.delete('/filemanager/:gameID/files/*', deleteHandler);
    api.use('/filemanager/:gameID', loginRequired, (req, res, next) => {
        fileManagerConfig.fsRoot = path.resolve(__dirname, 'public') + '/' + req.params.gameID;
        const router = filemanagerMiddleware(fileManagerConfig);
        router(req, res, next);
    });
}

module.exports = {
    handleFilemanagerAPI: handleFilemanagerAPI
};