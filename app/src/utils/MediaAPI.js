import settings from './settings';
import SceneAPI from "./SceneAPI";

var request = require('superagent');

const {apiBaseURL} = settings;

function addMedia(name, media) {
    
    request.post(`${apiBaseURL}/public/addMedia`)
        .set('name', name)
        .attach('upfile', media)
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }

            //create db node
            SceneAPI.createScene(name);

        });
}

export default {
    addMedia: addMedia
};