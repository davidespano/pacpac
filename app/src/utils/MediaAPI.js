import settings from './settings';
import SceneAPI from "./SceneAPI";
import interface_utils from "../components/interface/interface_utils";
import Actions from "../actions/Actions";
import Orders from "../data/Orders";
import StoryAPI from "./StoryAPI";

const request = require('superagent');

const {apiBaseURL} = settings;
const fs = require('fs');


/**
 * Retrieves all data from db and sends it to stores for assets generations
 */
function getAllAssets() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/assets`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            if (response.body && response.body !== [])
                Actions.loadAllAssets(response.body);
        });
}

/**
 * Uploads scene media to db. If the file is uploaded correctly, calls createScene to generate new Scene
 * @param name
 * @param index
 * @param type
 * @param media
 * @param tag
 * @param order
 */
function addMediaScene(name, index, type, media, tag, order) {
    
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
                SceneAPI.createScene(name, index, type, tag, order);
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

function addImageStory(name, media, ext, relevance, randomness) {
	
	let filename = [];
	
	for(let i=0; i<media.length; i++) 
		filename.push(name+'_'+i+'.'+ext[i]);
	
	for(let i=0; i<media.length; i++) {
    request.post(`${apiBaseURL}/public/${window.localStorage.getItem("gameID")}/addImage`)
        .set('name', filename[i])
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .attach('upfile', media[i])
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }
        });
	}
	
	StoryAPI.generateSystemStory(name, filename, relevance, randomness);
}

export default {
    getAllAssets: getAllAssets,
    addMediaScene: addMediaScene,
    uploadMedia: uploadMedia,
	addImageStory: addImageStory,	
};