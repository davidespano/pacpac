import Actions from '../actions/Actions'
import settings from './settings'
import MyScene from "../scene/MyScene";
var request = require('superagent');

const {apiBaseURL} = settings;

//get scene by name
function getByName(name, scene=null){
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }

            // /**TODO: FIX THIS IF**/
            // if(scene == null){
            //     //new Scene object
            //     let newScene = new MyScene(
            //         response.body.name,
            //         response.body.tagName,
            //         response.body.tagColor,
            //         [], //transition list
            //     );
            //     Actions.receiveScene(newScene);
            // } else {
            //     Actions.updateCurrentScene(scene);
            // }
        });
}

//check if a scene already exists
function existsByName(name){
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response){
            return response.status === 200;
        });
}

//create new scene inside db
function createScene(name, tagColor, tagName){
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name, tagColor: tagColor, tagName: tagName})
        .end(function(err, response){
            if(err){
                return console.error(err);
            }

            // new Scene object
            let newScene = new MyScene(
                response.body.name,
                response.body.tagName,
                response.body.tagColor,
                [], //transition list
            );

            //update scene visualization

            Actions.receiveScene(newScene);
        });
}

//reloads all scenes
function getAllScenes(){
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes`)
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