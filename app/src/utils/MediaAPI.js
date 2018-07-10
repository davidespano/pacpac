import settings from './settings';
import SceneAPI from "./SceneAPI";

var request = require('superagent');

const {apiBaseURL} = settings;

function addMedia(name, media, tagColor, tagName) {
    
    request.post(`${apiBaseURL}/public/${window.sessionStorage.getItem("gameID")}/addMedia`)
        .set('name', name)
        .attach('upfile', media)
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }
            else {
                //create db node
                SceneAPI.createScene(name, tagColor, tagName);
            }
        });
}

export default {
    addMedia: addMedia
};