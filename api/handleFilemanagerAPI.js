const path = require('path')
    , loginRequired = require('./middlewares/loginRequired').loginRequired
    ,sharp = require("sharp")
    , filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware
    , ffmpeg = require('fluent-ffmpeg')
    , ffmpegPath = require('ffmpeg-static').path
    , ffprobePath = require('ffprobe-static').path
    , fs = require('fs').promises;

const fileManagerConfig = {
    fsRoot: path.resolve(__dirname, 'public'),
    rootName: 'Main Root'
};

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function genVideoThumbnail(file, dir){
    return new Promise((resolve,reject) =>{
        ffmpeg(dir+'/'+file.filename)
            .output(dir+'/_thumbnails_/'+file.filename+'.png')
            .noAudio()
            .size('300x?')
            .on('error', (err)=>{
                reject(err);
            })
            .on('end', () => resolve())
            .run();
    })
}

function createThumbnails(files, dir){
    const promises = [];

    promises.push(fs.mkdir(dir + '/_thumbnails_').catch((err) => console.error(err)));

    files.forEach((file) => {
        console.log(file);
        if (file.mimetype.includes("video"))
            promises.push(genVideoThumbnail(file, dir).catch(err => console.error(err)));
        else
            promises.push(sharp(dir + '/' + file.filename).resize(300)
                .toFile(dir + '/_thumbnails_/' + file.filename)
                .catch((err) => console.error(err)));
    });
    return Promise.all(promises);
}


function routeHandler(req, res, next){
        const dir = path.resolve(__dirname, 'public' + '/' + req.params.gameID);

        //File upload
        if (req.method === "POST" && req.path === "/files") {
            const send = res.send;
            console.log(req.files);
            //override send function, used to check when the file is uploaded completely
            res.send = function (body) {
                //Creation of the thumbnails and call of the former send fuction
                createThumbnails(req.files, dir)
                    .then(send.call(this, body));
            }
        }
        //File remove
        else if (req.method === "DELETE") {

            //Delete the thumbnails
            let regex = RegExp('.*\.mp4$');
            let filename = regex.test(req.body.name) ? (req.body.name + '.png') : req.body.name;
            fs.unlink(dir + '/_thumbnails_/' + filename)
                .then(() => console.log('file deleted'))
                .catch((err) => console.error("delete",err));
        }
}


function handleFilemanagerAPI(api)
{
    api.use('/filemanager/:gameID', loginRequired, (req, res, next) => {
        fileManagerConfig.fsRoot = path.resolve(__dirname, 'public') + '/' + req.params.gameID;
        const router = filemanagerMiddleware(fileManagerConfig);
        router(req, res, next);
        next();
    }, routeHandler);
}

module.exports = {
    handleFilemanagerAPI: handleFilemanagerAPI
};