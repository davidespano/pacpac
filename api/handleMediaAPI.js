const multer = require('multer')
    , fs = require('fs')
    , routes = require('./routes')
    , loginRequired = require('./middlewares/loginRequired').loginRequired;

const storageSceneMedia = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/" + req.params.gameID + "/")
    },
    filename: function (req, file, cb) {
        cb(null, req.headers.name)
    }
});
const uploadSceneMedia = multer({
    storage: storageSceneMedia,
    fileFilter: function (req, file, cb) {
        fs.access("public/" + req.params.gameID + "/" + req.headers.name, (err) => {
            if (!err)
                cb(null, false);
            else
                cb(null, true);
        });
    }
});

const storageObjectsMedia = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/" + req.params.gameID + "/interactives")
    },
    filename: function (req, file, cb) {
        cb(null, req.headers.name)
    }
});
const uploadObjectsMedia = multer({
    storage: storageObjectsMedia,
    fileFilter: function (req, file, cb) {
        fs.access("public/" + req.params.gameID + "/interactives/" + req.headers.name, (err) => {
            if (!err)
                cb(null, false);
            else
                cb(null, true);
        });
    }
});

function handleMediaAPI(api) {
    api.post('/public/:gameID/addMedia', loginRequired, uploadSceneMedia.single("upfile"), routes.media.addSceneMedia);
    api.post('/public/:gameID/addInteractiveMedia', loginRequired, uploadObjectsMedia.single('upfile'), routes.media.addInteractiveMedia);
}

module.exports = {
    handleMediaAPI: handleMediaAPI
};