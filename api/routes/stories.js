const Stories = require('../models/stories')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');
	
function addStory(req, res, next) {
    const name = req.body.name;
	const systemStory = req.body.systemStory;
	const relevance = req.body.relevance;
	const randomness = req.body.randomness;
	const userStory = req.body.userStory;
	const lastUpdate = req.body.lastUpdate;
    const gameID = req.params.gameID;

    Stories.addStory(dbUtils.getSession(req), name, systemStory, relevance, randomness, userStory, lastUpdate, gameID)
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


function listStories(req, res, next) {
    const gameID = req.params.gameID;
    Stories.getAllStories(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

function deleteStory(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Stories.deleteStory(dbUtils.getSession(req), name, gameID)
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
};