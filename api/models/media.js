const fs = require('fs');

function getAll(session, gameID) {
    let fileList;
    const path = "public/" + gameID;
    const promise = new Promise(function(resolve, reject){
        fs.readdir(path, function(err, files){
            if (err != null){
                reject(err);
            }
            else resolve(files);
        })
    });
    return promise;
}

function deleteAsset(session, name, gameID) {

    let path = "public/" + gameID + "/" + name;
    return fs.access(path, (err) => {
        if (!err)
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + path);
            })
        throw {message: 'asset not found', status: 404};
    });
}

module.exports = {
    getAll: getAll,
    deleteAsset: deleteAsset,
};