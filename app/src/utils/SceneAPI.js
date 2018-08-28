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

            let transitions = response.body.objects;

            console.log(transitions)
            if(transitions)
                transitions = transitions.map((transition)=>{
                    transition.media = transition.rules[0].actions[0].target
                    return transition;
                } )
            console.log(transitions)
             if(scene == null){
                 //new Scene object
                 let newScene = new MyScene(
                     response.body.name,
                     response.body.tagName,
                     response.body.tagColor,
                     transitions //transition list
                 );
                 Actions.receiveScene(newScene);
             } else {
                 scene.transitions = transitions;
                 Actions.updateScene(scene);
                 Actions.updateCurrentScene(scene);
             }

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
function createScene(name,index, tagColor, tagName){
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name, index: index, tagColor: tagColor, tagName: tagName})
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
            console.log(response.body)
            if(response.body && response.body !== [])
                Actions.loadAllScenes(response.body);
        });
}

//get neighbours of given scene
function getNeighbours(name)
{
    return request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}/neighbours`)
    .set('Accept', 'application/json')
    .end(function(err, response){
        if(err){
            return console.error(err);
        }

        if(response.body !== [])
            Actions.loadAllScenes(response.body);
    });
}

//delete scene
function deleteScene(scene){
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeScene(scene.name);
            Actions.updateCurrentScene(null);
        });
}

//set home scene
function setHome(scene){
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/setHome`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }
        });
}

//Save object into database
function saveTransition(scene, object){
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/transitions`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: object.uuid,
                name: object.name,
                rules: object.rules,
                duration: object.duration,
                vertices: object.vertices
            })
        .end(function(err, response){
            if(err){
                console.error(err);
                return false;
            }
             return true;
        });
}

/*TODO: spostare in un possibile InteractiveObjectAPI*/
function removeTransition(scene,transition){
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/transitions/${transition.uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeTransition(scene,transition);
        });
}

export default {
    getByName: getByName,
    existsByName: existsByName,
    createScene: createScene,
    getAllScenes: getAllScenes,
    saveTransitions: saveTransition,
    deleteScene: deleteScene,
    getNeighbours: getNeighbours,
    removeTransition: removeTransition
};