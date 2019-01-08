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


module.exports = {
    getAll: getAll
};