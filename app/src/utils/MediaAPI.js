import settings from './settings';
import SceneAPI from "./SceneAPI";

const request = require('superagent');

const {apiBaseURL} = settings;

/**
 * Uploads scene media to db. If the file is uploaded correctly, calls createScene to generate new Scene
 * @param name
 * @param index
 * @param type
 * @param media
 * @param tagColor
 * @param tagName
 */
function addMedia(name, index, type, media, tagColor, tagName) {
    
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
                SceneAPI.createScene(name, index, type, tagColor, tagName);
            }
        });
}

export default {
    addMedia: addMedia
};