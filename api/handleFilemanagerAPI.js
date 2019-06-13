const path = require('path')
    , loginRequired = require('./middlewares/loginRequired').loginRequired
    , sharp = require("sharp")
    , filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware
    , ffmpeg = require('fluent-ffmpeg')
    , ffmpegPath = require('ffmpeg-static').path
    , ffprobePath = require('ffprobe-static').path
    , fs = require('fs').promises
    , Media = require('./models/media')
    , dbUtils = require('./neo4j/dbUtils');

const fileManagerConfig = {
    fsRoot: path.resolve(__dirname, 'public'),
    rootName: 'Main Root'
};

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function genVideoScreenshot(file, dir){
    const output = dir+'/_thumbnails_/'+file.filename+'.png';
    return new Promise((resolve,reject) =>{
        ffmpeg(dir+'/'+file.filename)
            .on('error', (err)=>{
                reject(err);
            })
            .on('end', () => {
                console.log('genVideoScreenshot', output);
                resolve(output)
            })
            .screenshots({
                count: 1,
                folder: dir+'/_thumbnails_',
                filename: file.filename + '.png'
            });
    })
}

async function createThumbnails(session, files, dir, gameID){
    const promises = [];

    await fs.mkdir(dir + '/_thumbnails_').catch(() => {});

    files.forEach((file) => {
        let promise;

        if (file.mimetype.includes("video"))
            promise = (genVideoScreenshot(file, dir).catch(err => console.error(err)));
        else
            promise = new Promise((resolve,reject) => resolve(dir + '/' + file.filename));


        //take metadata with sharp and resize image
        promise = promise.then((res) => {
            const image = sharp(res);
            return image.metadata().then((metadata) => {
                //Create or update the media
                let asset = {filename: file.filename, width: metadata.width, height: metadata.height};
                return Media.createUpdateAsset(session, asset, gameID).then(()=>{
                    //using a buffer to override the old image
                    return image
                        .resize(300)
                        .toBuffer(function(err, buffer) {
                            fs.writeFile(dir + '/_thumbnails_/' + path.parse(res).base, buffer, function(e) {

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

    console.log("uploadHandler",req.params.gameID);
//override send function, used to check when the file is uploaded completely
    res.send = function (body) {
        //Creation of the thumbnails and call of the former send fuction
        createThumbnails(session, req.files, dir, gameID)
            .then(() => {
                let asset = {filename:req.files[0].filename};
                send.call(this, body);
                return Media.createUpdateAsset(dbUtils.getSession({}), asset, gameID);
            }).catch(err => console.error("createThumbnails",err));
    };
    next();
}

function deleteHandler(req, res, next){
    const dir = path.resolve(__dirname, 'public' + '/' + req.params.gameID);
    let regex = RegExp('.*\.mp4$');
    let filename = regex.test(req.body.name) ? (req.body.name + '.png') : req.body.name;

    Media.deleteByName(dbUtils.getSession({}),req.body.name, req.params.gameID);

    fs.unlink(dir + '/_thumbnails_/' + filename)
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