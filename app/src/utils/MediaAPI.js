import settings from './settings';
import SceneAPI from "./SceneAPI";
import interface_utils from "../components/interface/interface_utils";

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
function addMediaScene(name, index, type, media, tagColor, tagName) {
    
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

/**
 * Upload a media or a mask to the db. If the file is uploaded correctly, the object is edited and the update is sent
 * to the stores. If the file is already saved to the db (error 422) the object is edited and saved as well (so we can
 * handle reusage of resources)
 * @param object
 * @param file
 * @param type: media or mask
 * @param props
 */
function uploadMedia(object, file, type, props){

    request.post(`${apiBaseURL}/public/${window.localStorage.getItem("gameID")}/addInteractiveMedia`)
        .set('name', file.name)
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .attach('upfile', file)
        .end(function(err, response) {
            if (err && err.status !== 422) { // duplicates are ignored
                return console.error(err);
            }

            interface_utils.setPropertyFromValue(object, type, file.name, props);
        });
}

export default {
    addMediaScene: addMediaScene,
    uploadMedia: uploadMedia,
};