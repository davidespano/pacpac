const _ = require('lodash');
const Collection = require('../models/neo4j/collection');
const Story = require('../models/neo4j/story');
const Image = require('../models/neo4j/image');
const fs = require('fs');


function singleCollection(results) {
    if(results.records && results.records.length && results.records.length === 1){
        //build the story
        return buildCollection(results.records[0]);
    } else { 
        return null;
    }
}

function multipleCollections(results){
    return results.records.map(record => buildCollection(record));
}

function buildCollection(record) {
    const collection = new Collection(record.get('collection'));
	try {
        const images = record.get('images');
        collection.images = images.map(t => new Image(t));
    }catch (error){}
    try {
        const stories = record.get('stories');
        collection.stories = stories.map(t => new Story(t));
    }catch (error){}
    return collection;
}

function singleImage(results) {
    if(results.records && results.records.length && results.records.length === 1){
        //build the story
        return buildImage(results.records[0]);
    } else { 
        return null;
    }
}

function buildImage(record) {
    const image = new Image(record.get('image'));
    return image;
}

//add a story

function addStory(session, uuid, name, image, stories, randomness, gameID) {
     return session.run(
        'MATCH (collection:Collection:`' + gameID + '` {name: $name, uuid: $uuid})' +
        'RETURN collection', {name: name, uuid: uuid})
        .then(result => {
           if (!_.isEmpty(result.records)) {
                throw {message: "Collection already exists", status: 422};
            }
            else {
                return session.run(
					'CREATE (collection:Collection:`' + gameID + '`  {name: $name, randomness: $randomness, uuid: $uuid}) '+
					'WITH $img AS imgs '+
					'UNWIND imgs as image '+
					'MATCH(c:Collection:`' + gameID + '` {name: $name, uuid: $uuid}) '+
					'MERGE (i:Image:`' + gameID + '`  {relevance: image.relevance, name: image.filename, uuid: image.uuid})<-[:CONTAINS]-(c) '+
				    'WITH $sysSt as stories '+
				    'UNWIND stories as story '+
				    'MATCH(c2:Collection:`' + gameID + '` {name: $name, uuid: $uuid}) '+
			    	'MERGE (s:Story:`' + gameID + '` {lastUpdate: story.lastUpdate, userStory: story.userStory, uuid: story.uuid, systemStory: story.systemStory, genre:story.genre})<-[:CONTAINS]-(c2) '+
                    'RETURN c2', {uuid: uuid, name: name, img: image, randomness:  randomness, sysSt:stories})
            }
        })
        .then(result => singleCollection(result.records[0]));		
}


function updateStory(session, story, gameID) {

    return session.run(
        'MATCH (story:Story:`' + gameID + '` {uuid: $uuid})' +
        'RETURN story', {uuid: story.uuid})
        .then(result => {
            if (_.isEmpty(result.records)) {
                throw {message: "Story doesn't exists", status: 404};
            }
            else {
                return session.run(
                    'MATCH (s:Story:`' + gameID + '` {uuid:$uuid}) ' +		
					'SET s.userStory = $userStory, s.lastUpdate = $lastUpdate, s.systemStory = $systemStory ' +
                    'RETURN s', {uuid: story.uuid, userStory: story.userStory, lastUpdate: story.lastUpdate, systemStory:story.systemStory});
            }
        })
}


async function updateRandomness(session, name, randomness, newStory, gameID) {
           const result = await session.run(
					'WITH $newStories as newStories '+
					'UNWIND newStories as newStory '+
					'MATCH(story:Story {uuid: newStory.uuid}) '+
                    'SET story = newStory '+
					'WITH story ' +
					'MATCH (collection:Collection {name: $name}) ' +	
					'SET collection.randomness = $randomness ' +
					'RETURN collection', {name: name, randomness: randomness, newStories: newStory})
        .then(result => {
            if(result) {
                singleCollection(result);
            }
            else{
                throw {message: "Error"};
            }
        });	
			

}


async function updateRelevance(session, img, relevance, newStory, gameID) {
	
           const result = await session.run(
					'WITH $newStories as newStories '+
					'UNWIND newStories as newStory '+
					'MATCH(story:Story {uuid: newStory.uuid}) '+
                    'SET story = newStory '+
					'WITH story ' +
					'MATCH (image:Image {uuid: $img}) ' +	
					'SET image.relevance = $relevance ' +
					'RETURN image', {img: img, relevance: relevance, newStories: newStory})
        .then(result => {
            if(result) {
                singleImage(result);
				
            }
            else{
                throw {message: "Error"};
            }
        });		
}

//list all stories
function getAllStories(session, gameID) {
    return session.run(
        'MATCH (collection:Collection:`' + gameID + '`) ' +
        'RETURN collection ' + 
		'ORDER BY collection.name')
        .then(result => {
                if (!_.isEmpty(result.records)) {
                    return multipleCollections(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

//delete a story
function deleteCollection(session, name, images, gameID) {

    let path = "public/" + gameID + "/story_editor/";
	images.forEach(img => {
    fs.access(path,(err)=> {
        if(!err)
            fs.unlink(path+img, (err) => {
                if (err) throw err;
                console.log('successfully deleted '+path+img);
            })
        });
	});

    return session.run(
        'MATCH (collection:Collection:`' + gameID + '` {name: $name}) ' +	
        'MATCH (collection)-[:CONTAINS]->(story:Story) ' +
        'MATCH (collection)-[:CONTAINS]->(image:Image) ' +	
        'DETACH DELETE collection, story, image  ' +
        'RETURN COUNT(collection)', {name: name})
        .then(result => result.records[0].get('COUNT(collection)').low)
}


function deleteStory(session, name, uuid, gameID) {
/**
    let path = "public/" + gameID + "/story_editor/" + name;
    fs.access(path,(err)=> {
        if(!err)
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted '+path);
            })
        });
*/
    return session.run(
        'MATCH (collection:Collection:`' + gameID + '` {name: $name}) -[:CONTAINS]-> ' +	
        '(story:Story:`' + gameID + '` {uuid: $uuid}) ' +
        'DETACH DELETE story ' +
        'RETURN COUNT(story)', {name: name, uuid: uuid})
        .then(result => result.records[0].get('COUNT(story)').low)
}

//get story by name
function getStoryByName(session, name, gameID){
    return session.run(
        'MATCH (collection:Collection:`' + gameID + '` {name:$name}) ' +
	    'OPTIONAL MATCH (collection)-[:CONTAINS]->(image:Image) '+
	    'WITH collection, COLLECT(image) as images '+
	    'OPTIONAL MATCH (collection)-[:CONTAINS]->(story:Story) '+	
	    'WITH collection, images, COLLECT(story) as stories '+
        'RETURN collection, images, stories ',
        {'name': name})
        .then(result => {
            const collection = singleCollection(result);
            if (collection) {
                return collection;
            }
            else {
                throw {message: 'collection not found', status: 404};
            }
        });
}

module.exports = {
    addStory: addStory,
	updateStory: updateStory,
	getAllStories: getAllStories,
	deleteStory: deleteStory,
	getStoryByName: getStoryByName,
	updateRandomness: updateRandomness,
	updateRelevance: updateRelevance,
	deleteCollection: deleteCollection,
};