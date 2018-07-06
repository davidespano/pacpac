import Actions from '../actions/Actions'
import settings from './settings'
var request = require('superagent')

const {apiBaseURL} = settings;

//get scene by name
function getByName(name){
    request.get(`${apiBaseURL}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.receiveScene(response.body);
        });
}

//check if a scene already exists
function existsByName(name){
    request.get(`${apiBaseURL}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response){
            return response.status === 200;
        });
}

//create new scene inside db
function createScene(name, tagColor, tagName){
    request.post(`${apiBaseURL}/scenes/addScene`)
        .set('Accept', 'application/json')
        .send({name: name, tagColor: tagColor, tagName: tagName})
        .end(function(err, response){
            if(err){
                return console.error(err);
            }

            //update scene visualization
            Actions.receiveScene(response.body);
        });
}

//reloads all scenes
function getAllScenes(){
    request.get(`${apiBaseURL}/scenes`)
        .set('Accept', 'application/json')
        .end(function(err, response){
            if(err){
                return console.error(err);
            }

            if(response.body !== [])
                Actions.loadAllScenes(response.body);
        });
}

export default {
    getByName: getByName,
    existsByName: existsByName,
    createScene: createScene,
    getAllScenes: getAllScenes,
};