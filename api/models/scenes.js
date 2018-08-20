const _ = require('lodash');
const Scene = require('../models/neo4j/scene');
const Tag = require('../models/neo4j/tag');
const fs = require('fs');

// return many scenes
function manyScenes(neo4jResult) {
    return neo4jResult.records.map(record => {
        const result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    })
}

function singleSceneWithDetails(record) {
    if (record.length) {
        const result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    } else {
        return null;
    }
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
                    return manyScenes(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

//get scene by name
function getByName(session, name, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name:$name}) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS]->(object:InteractiveObject)' +
        'OPTIONAL MATCH (object)-[:CONTAINS_RULE]->(rule:Rule)' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action)' +
        'WITH scene, tag, object, ' +
        '          rule { ' +
        '                  .*,' +
        '                  actions: COLLECT(properties(action))' +
        '           } ' +
        'WITH scene, tag, ' +
        '          object { ' +
        '                  .*, ' +
        '                  rules: COLLECT(rule)' +
        '           } ' +
        'RETURN scene {' +
        '           properties: {' +
        '                           name: scene.name, ' +
        '                           objects: COLLECT(object)' +
        '                        }' +
        '       }, tag', {'name': name})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                return singleSceneWithDetails(result.records[0]);
            }
            else {
                throw {message: 'scene not found', status: 404};
            }
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
                return singleSceneWithDetails(result.records[0]);
            }
            else {
                throw {message: 'scene not found', status: 404};
            }
        });
}

//add a scene
function addScene(session, name, index, tagColor, tagName, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name})' +
        'RETURN scene', {name: name, tagColor: tagColor, tagName: tagName})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                throw {message: "Scene already exists", status: 422};
            }
            else {
                return session.run(
                    'MERGE (tag:Tag:`' + gameID + '` {color: $tagColor, name:$tagName}) ' +
                    'CREATE (scene:Scene:`' + gameID + '` {name: $name, index:$index}) -[:TAGGED_AS]-> (tag) ' +
                    'RETURN scene,tag', {name: name, index: index, tagColor: tagColor, tagName: tagName})
            }
        })
        .then(result => singleSceneWithDetails(result.records[0]));

}

// get adjacent scenes
function getNeighboursByName(session, name, gameID) {
    //TODO Questa sarà da rifare con il sistema delle regole
    return session.run('MATCH (:Scene:`' + gameID + '` {name: $name})-[:TARGET|:CONTAINS|:CONTAINS_RULE|:CONTAINS_ACTION *4]->(scene) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag)' +
        'RETURN scene, tag ' +
        'ORDER BY scene.index', {name: name})
        .then(result => manyScenes(result));
}

//delete a scene
function deleteScene(session, name, gameID) {

    let path = "public/" + gameID + "/" + name;
    fs.access(path,(err)=> {
        if(!err)
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted '+path);
            })
        });

    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name}) ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS]->(o:InteractiveObject)' +
        'OPTIONAL MATCH (o)-[:CONTAIN_RULE]->(r:Rule)' +
        'OPTIONAL MATCH (r)-[:CONTAINS_ACTION]->(a:Action)' +
        'OPTIONAL MATCH (scene)<-[:TARGET]-(a2:Action)' +
        'OPTIONAL MATCH (a2)<-[:CONTAINS_ACTION]-(r2:Rule)' +
        'OPTIONAL MATCH (r2)<-[:CONTAINS_RULE]-(o2:InteractiveObject)' +
        'DETACH DELETE scene,o,r,a,o2,r2,a2 ' +
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
        'RETUrN scene', {name: name})
        .then(result =>{
            if (_.isEmpty(result.records)) {
                throw {message: 'scene not found', status: 404};
            }
        })
}

module.exports = {
    getAll: getAll,
    getByName: getByName,
    addScene: addScene,
    getHomeScene: getHomeScene,
    getNeighboursByName: getNeighboursByName,
    deleteScene: deleteScene,
    setHome: setHome
};