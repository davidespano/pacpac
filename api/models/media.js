const fs = require('fs');
const readdirp = require('readdirp');
const ffprobeStatic = require('ffprobe-static');
//const sharp = require('sharp');

async function getAll(session, gameID) {
    let fileList = [];
    const path = "public/" + gameID;
    fileList = await new Promise(function(resolve, reject){

        readdirp({root: path})
            .on('data', (file) => {

                const filePath = file.path.replace(/(\\)/g,'/');

                let fileObj = {path: filePath};

                fileList.push(fileObj);
                //console.log(filedata);
            })
            .on('error', (error) => reject(error))
            .on('warn', (error) => reject(error))
            .on('end', () => resolve(fileList));
        // fs.readdir(path, function(err, files){
        //     if (err != null){
        //         reject(err);
        //     }
        //     else resolve(files);
        // })
    });

    /*
    for(let i = 0; i<fileList.length; i++){
        const fileObj = fileList[i];
        const filePath = fileObj.path;
        try{
            await ffprobe(path+'/'+filePath,{path: ffprobeStatic.path}).then((info)=>{
                fileObj.width = info.streams[0].width;
                fileObj.height = info.streams[0].height;
            });
        }catch(err){
            console.error(err);
        }
    }
    */

    return fileList;
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