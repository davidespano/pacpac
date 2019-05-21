const Stories = require('../models/stories')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');
	
function addStory(req, res, next) {
	const uuid = req.body.uuid;
    const name = req.body.name;
    const images = req.body.images;	
	const stories = req.body.stories;
	const randomness = req.body.randomness;
    const gameID = req.params.gameID;

    Stories.addStory(dbUtils.getSession(req), uuid, name, images, stories, randomness, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

function updateStory(req, res, next) {
	    const gameID = req.params.gameID;
		const modifiedStory = req.body;
		Stories.updateStory(dbUtils.getSession(req), modifiedStory, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) 
       .catch(error => writeError(res, error, 500));
}

function updateRelevance(req, res, next) {
	    const gameID = req.params.gameID;
		const img = req.body.img;
		const relevance = req.body.relevance;
		const newStory = req.body.newStory;
		Stories.updateRelevance(dbUtils.getSession(req), img, relevance, newStory, gameID)
        .then(response => writeResponse(res, response))
       .catch(next);
}

function updateRandomness(req, res, next) {
	    const gameID = req.params.gameID;
		const name = req.body.name;
		const randomness = req.body.randomness;
		const newStory = req.body.newStory;
		Stories.updateRandomness(dbUtils.getSession(req), name, randomness, newStory, gameID)
        .then(response => writeResponse(res, response))
       .catch(next);
}

function listStories(req, res, next) {
    const gameID = req.params.gameID;
    Stories.getAllStories(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

function deleteStory(req, res, next) {
    const name = req.params.name;
	const uuid = req.params.uuid;
    const gameID = req.params.gameID;
    Stories.deleteStory(dbUtils.getSession(req), name, uuid, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

function deleteCollection(req, res, next) {
    const name = req.params.name;
	const images = req.body.images;
    const gameID = req.params.gameID;
    Stories.deleteCollection(dbUtils.getSession(req), name, images, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

function getStoryByName(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Stories.getStoryByName(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    addStory: addStory,
	updateStory: updateStory,
	listStories: listStories,
	deleteStory: deleteStory,
	getStoryByName: getStoryByName,
	updateRandomness: updateRandomness,
	updateRelevance: updateRelevance,
	deleteCollection: deleteCollection,
};