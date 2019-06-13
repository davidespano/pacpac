const fs = require('fs');
const readdirp = require('readdirp');
const ffprobeStatic = require('ffprobe-static');
//const sharp = require('sharp');

async function getAll(session, gameID) {

    let result = await session.run(
        'MATCH (a:Asset:`' + gameID + '`)<-[:CONTAINS_ASSET]-(g:Game {gameID: $gameID}) ' +
        'return a',
        {gameID: gameID}
    );

    console.log("here",result.records[0].get('a'));
    if(result.records[0])
        return result.records.map((record) => record.get('a').properties);
    return [];
    // let fileList = [];
    // const path = "public/" + gameID;
    // fileList = await new Promise(function(resolve, reject){
    //
    //     readdirp({root: path})
    //         .on('data', (file) => {
    //
    //             const filePath = file.path.replace(/(\\)/g,'/');
    //
    //             let fileObj = {path: filePath};
    //
    //             fileList.push(fileObj);
    //             //console.log(filedata);
    //         })
    //         .on('error', (error) => reject(error))
    //         .on('warn', (error) => reject(error))
    //         .on('end', () => resolve(fileList));
        // fs.readdir(path, function(err, files){
        //     if (err != null){
        //         reject(err);
        //     }
        //     else resolve(files);
        // })
    //});

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

    //return fileList;
}

function deleteAsset(session, name, gameID) {

    let path = "public/" + gameID + "/" + name;
    return fs.access(path, (err) => {
        if (!err)
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + path);
            });
        throw {message: 'asset not found', status: 404};
    });
}

function createUpdateAsset(session, asset, gameID){
    console.log("Assets Create", gameID);
    return session.run(
        'MATCH (g:Game {gameID:{gameID}}) ' +
        'MERGE (a:Asset:`' + gameID + '` {filename: $asset.filename}) ' +
        'SET a += $asset ' +
        'WITH a,g ' +
        'MERGE (a)<-[:CONTAINS_ASSET]-(g)' +
        'RETURN a',
        {asset: asset, gameID: gameID}).catch((err) => console.error("Asset Create",err));
}

function deleteByName(session, filename, gameID){
    return session.run(
        'MATCH (asset:Asset:`' + gameID + '` {filename: $filename}) ' +
        'DETACH DELETE asset ' +
        'RETURN COUNT(asset)', {filename: filename})
        .then(result => result.records[0].get('COUNT(asset)').low).catch(err => console.error(err));
}

module.exports = {
    getAll: getAll,
    deleteAsset: deleteAsset,
    createUpdateAsset: createUpdateAsset,
    deleteByName: deleteByName,
};