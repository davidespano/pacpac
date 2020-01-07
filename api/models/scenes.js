const _ = require('lodash');
const Scene = require('../models/neo4j/scene');
const Tag = require('../models/neo4j/tag');
const Rule = require('../models/neo4j/rule');
const Interactiveobject = require('../models/neo4j/interactiveObject');
const Audio = require('../models/neo4j/audio')
const fs = require('fs');

function singleScene(results) {
    if(results.records && results.records.length && results.records.length === 1){
        //build the scene
        return buildScene(results.records[0]);
    } else { //too many or no scenes
        return null;
    }
}

function multipleScenes(results){
    return results.records.map(record => buildScene(record));
}

function buildScene(record) {
    const scene = new Scene(record.get('scene'));
    try {
        scene.tag = new Tag(record.get('tag'));
    }catch (error){
        scene.tag = null;
        console.log('this scene has no tag');
    }
    try{
        const rules = record.get('rules');
        scene.rules = rules.map(r => new Rule(r));
    }catch (error){}
    try {
        const audios = record.get('audios');
        scene.audios = audios.map(t => new Audio(t));
    }catch (error){}

    try{
        const objects = record.get('objects');
        scene.transitions = [];
        scene.switches = [];
        scene.collectable_keys = [];
        scene.locks = [];
        scene.points = [];
        scene.counters = [];
        scene.textboxes = [];

        objects.forEach((o) => {
            const obj = new Interactiveobject(o);

            switch(obj.type){
                case "TRANSITION":
                    scene.transitions.push(obj); break;
                case "SWITCH":
                    scene.switches.push(obj); break;
                case "KEY":
                    scene.collectable_keys.push(obj); break;
                case "LOCK":
                    scene.locks.push(obj); break;
                case "POINT_OF_INTEREST":
                    scene.points.push(obj); break;
                case "COUNTER":
                    scene.counters.push(obj); break;
                case "TEXTBOX":
                    scene.textboxes.push(obj); break;
            }
        })
    }catch(error){console.error(error)}

    return scene;
}

// get all scenes
function getAll(session, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '`) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag ' +
        'ORDER BY scene.index')
        .then(result => {
                if (!_.isEmpty(result.records)) {
                    return multipleScenes(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

function getByUuid(session, uuid, gameID){
    return session.run(`
        MATCH (:Scene:\`${gameID}\`)-[:CONTAINS_OBJECT]->(t:Transition)
        MATCH (trRule:Rule)<-[:CONTAINS_RULE]-(:Scene {uuid:'${uuid}'})
        WHERE trRule.event CONTAINS ('"obj_uuid":"' + t.uuid + '"')
        MATCH (trAction:Action)<-[:CONTAINS_ACTION]-(trRule)
        MATCH (scene:Scene:\`${gameID}\`)
        WHERE scene.uuid = trAction.obj_uuid or scene.uuid = '${uuid}'
        OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) 
        WITH scene, tag 
        OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(object:InteractiveObject) 
        WITH scene, tag, COLLECT(object) as objects
        OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(rule:Rule) 
        WITH scene, tag, objects, rule 
        OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action)
        WITH scene, tag, objects, rule, collect(action) as acts
        OPTIONAL MATCH (scene)-[:CONTAINS_AUDIO]->(audio:Audio)
        WITH scene, tag, objects, rule, acts, collect(audio) as audios 
        RETURN scene, tag, objects, audios, collect(rule { .*,  actions :acts}) as rules
        `)
        .then(result => {
                console.log(result.records);
                if (!_.isEmpty(result.records)) {
                    return multipleScenes(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

//get scene by name
function getByName(session, name, gameID){
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name:$name}) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'WITH scene, tag ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(object:InteractiveObject) ' +
        'WITH scene, tag, COLLECT(object) as objects ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(rule:Rule) ' +
        'WITH scene, tag, objects, rule ' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action) ' +
        'WITH scene, tag, objects, rule, collect(action) as acts ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_AUDIO]->(audio:Audio) ' +
        'WITH scene, tag, objects, rule, acts, collect(audio) as audios ' +
        'RETURN scene, tag, objects, audios, collect(rule { .*,  actions :acts}) as rules',
        {'name': name})
        .then(result => {
            const scene = singleScene(result);
            if (scene) {
                return scene;
            }
            else {
                throw {message: 'scene not found', status: 404};
            }
        });
}

function getAllDetailed(session, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` ) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'WITH scene, tag ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(object:InteractiveObject) ' +
        'WITH scene, tag, COLLECT(object) as objects ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(rule:Rule) ' +
        'WITH scene, tag, objects, rule ' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action) ' +
        'WITH scene, tag, objects, rule, collect(action) as acts ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_AUDIO]->(audio:Audio) ' +
        'WITH scene, tag, objects, rule, acts, collect(audio) as audios ' +
        'RETURN scene, tag, objects, audios, collect(rule { .*,  actions :acts}) as rules')
        .then(result => {
                if (!_.isEmpty(result.records)) {
                    return multipleScenes(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}


//get the home scene
function getHomeScene(session, gameID) {
    return session.run(
        'MATCH (game:Game {gameID: $gameID}) ' +
        'MATCH (scene:Scene {uuid: game.homeScene}) ' +
        'RETURN scene', {gameID: gameID})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                return singleScene(result);
            }
            else {
                throw {message: 'Game not found', status: 404};
            }
        });
}

//add a scene
function addScene(session, uuid, name, img, index, type, tag, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name})' +
        'RETURN scene', {name: name})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                throw {message: "Scene already exists", status: 422};
            }
            else {
                return session.run(
                    'MATCH (tag:Tag:`' + gameID + '` {uuid: $tag}) ' +
                    'CREATE (scene:Scene:`' + gameID + '` {uuid:$uuid, name: $name, img: $img, index:$index, type:$type}) -[:TAGGED_AS]-> (tag) ' +
                    'RETURN scene,tag', {uuid: uuid, name: name, img: img, index: index, type: type, tag: tag})
            }
        })
        .then(result => {
            if(result.records[0] && result.records[0].has("tag")) {
                singleScene(result.records[0])
            }
            else{
                throw {message: "Tag does not exists", status: 404};
            }
        });

}

//update a scene
function updateScene( session, scene, tag, gameID){
    
    delete scene.tag;
    delete scene.objects;
    delete scene.audios;
    delete scene.rules;

    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {uuid: $uuid})' +
        'RETURN scene', {uuid: scene.uuid})
        .then(result => {
            if (_.isEmpty(result.records)) {
                throw {message: "Scene doesn't exists", status: 404};
            }
            else {
                return session.run(
                    'MATCH (scene:Scene:`' + gameID + '` {uuid: $uuid})-[r:TAGGED_AS]->(tagS), (tag:Tag:`' + gameID + '` {uuid: $tag}) ' +
                    'SET scene=$scene ' +
                    'CREATE (scene) -[:TAGGED_AS]-> (tag) ' +
                    'DELETE r ' +
                    'RETURN scene,tag', {uuid: scene.uuid, scene: scene, tag: tag})
            }
        })
        .then(result => {
            if(result.records[0] && result.records[0].has("tag")) {
                singleScene(result.records[0])
            }
            else{
                throw {message: "Tag does not exists", status: 404};
            }
        });
}

//delete a scene
function deleteScene(session, name, gameID) {

    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name}) ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(o:InteractiveObject) ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(r:Rule) ' +
        'OPTIONAL MATCH (r)-[:CONTAINS_ACTION]->(a:Action) ' +
        'DETACH DELETE scene,o,r,a ' +
        'RETURN COUNT(scene)', {name: name})
        .then(result => result.records[0].get('COUNT(scene)').low)
}

//Set home scene
function setHomeScene(session, sceneID, gameID){
    return session.run(
        'MATCH (game:Game {gameID: $gameID}) ' +
        'MATCH (scene:Scene {uuid: $sceneID}) ' +
        'SET game.homeScene = $sceneID ' +
        'RETURN game, scene', {gameID: gameID, sceneID: sceneID})
        .then(result =>{
            if (_.isEmpty(result.records)) {
                throw {message: 'scene not found', status: 404};
            }
        });
}

module.exports = {
    getAll: getAll,
    getByName: getByName,
    getByUuid: getByUuid,
    addScene: addScene,
    updateScene: updateScene,
    getHomeScene: getHomeScene,
    deleteScene: deleteScene,
    setHomeScene: setHomeScene,
    getAllDetailed: getAllDetailed
};