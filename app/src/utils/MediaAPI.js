import settings from './settings';
import SceneAPI from "./SceneAPI";

var request = require('superagent');

const {apiBaseURL} = settings;

function addMedia(name, index, media, tagColor, tagName) {
    
    request.post(`${apiBaseURL}/public/${window.localStorage.getItem("gameID")}/addMedia`)
        .set('name', name)
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .attach('upfile', media)
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }
            else {
                //create db node
                SceneAPI.createScene(name, index, tagColor, tagName);
            }
        });
}

export default {
    addMedia: addMedia
};