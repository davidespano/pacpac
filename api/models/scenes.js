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
        console.log(scene);
        console.log('this scene has no tag');
    }
    try{
        const rules = record.get('rules');
        scene.rules = rules.map(r => new Rule(r));
    }catch (error){}
    try {
        const transitions = record.get('transitions');
        scene.transitions = transitions.map(t => new Interactiveobject(t));
    }catch (error){}
    try {
        const switches = record.get('switches');
        scene.switches = switches.map(t => new Interactiveobject(t));
    }catch (error){}
    try {
        const collectable_keys = record.get('collectable_keys');
        scene.collectable_keys = collectable_keys.map(t => new Interactiveobject(t));
    }catch (error){}
    try {
        const locks = record.get('locks');
        scene.locks = locks.map(t => new Interactiveobject(t));
    }catch (error){}
    try {
        const audios = record.get('audios');
        scene.audios = audios.map(t => new Audio(t));
    }catch (error){}
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

//get scene by name
function getByName(session, name, gameID){
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name:$name}) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'WITH scene, tag ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(transition:InteractiveObject:Transition) ' +
        'WITH scene, tag, COLLECT(transition) as transitions ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(switch:InteractiveObject:Switch) ' +
        'WITH scene, tag, transitions, COLLECT(switch) as switches ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(key:InteractiveObject:Key) ' +
        'WITH scene, tag, transitions, switches, COLLECT(key) as collectable_keys ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(lock:InteractiveObject:Lock) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, COLLECT(lock) as locks ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(rule:Rule) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule ' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule, collect(action) as acts ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_AUDIO]->(audio:Audio) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule, acts, collect(audio) as audios ' +
        'RETURN scene, tag, transitions, switches, collectable_keys, locks, audios, collect(rule { .*,  actions :acts}) as rules',
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
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(transition:InteractiveObject:Transition) ' +
        'WITH scene, tag, COLLECT(transition) as transitions ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(switch:InteractiveObject:Switch) ' +
        'WITH scene, tag, transitions, COLLECT(switch) as switches ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(key:InteractiveObject:Key) ' +
        'WITH scene, tag, transitions, switches, COLLECT(key) as collectable_keys ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_OBJECT]->(lock:InteractiveObject:Lock) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, COLLECT(lock) as locks ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_RULE]->(rule:Rule) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule ' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule, collect(action) as acts ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS_AUDIO]->(audio:Audio) ' +
        'WITH scene, tag, transitions, switches, collectable_keys, locks, rule, acts, collect(audio) as audios ' +
        'RETURN scene, tag, transitions, switches, collectable_keys, locks, audios, collect(rule { .*,  actions :acts}) as rules',)
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
        'MATCH (scene:Scene:Home:`' + gameID + '`) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag')
        .then(result => {
            if (!_.isEmpty(result.records)) {
                return singleScene(result);
            }
            else {
                throw {message: 'scene not found', status: 404};
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
function setHome(session, name, gameID){
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name}) ' +
        'OPTIONAL MATCH (home:Scene:Home:`' + gameID + '`)' +
        'REMOVE home:Home ' +
        'SET scene:Home ' +
        'RETURN scene', {name: name})
        .then(result =>{
            if (_.isEmpty(result.records)) {
                throw {message: 'scene not found', status: 404};
            }
        });
}

module.exports = {
    getAll: getAll,
    getByName: getByName,
    addScene: addScene,
    updateScene: updateScene,
    getHomeScene: getHomeScene,
    deleteScene: deleteScene,
    setHome: setHome,
    getAllDetailed: getAllDetailed
};