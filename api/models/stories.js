const _ = require('lodash');
const Story = require('../models/neo4j/story');
const fs = require('fs');


function singleStory(results) {
    if(results.records && results.records.length && results.records.length === 1){
        //build the story
        return buildStory(results.records[0]);
    } else { 
        return null;
    }
}

function multipleStories(results){
    return results.records.map(record => buildStory(record));
}

function buildStory(record) {
    const story = new Story(record.get('story'));
    return story;
}

//add a story
function addStory(session, name, systemStory, relevance, randomness, userStory, lastUpdate, gameID) {
     return session.run(
        'MATCH (story:Story:`' + gameID + '` {name: $name})' +
        'RETURN story', {name: name})
        .then(result => {
           if (!_.isEmpty(result.records)) {
                throw {message: "Story already exists", status: 422};
            }
            else {
                return session.run(
                    'CREATE (story:Story:`' + gameID + '` {name: $name, systemStory:$systemStory, relevance:$relevance, randomness: $randomness, userStory:$userStory, lastUpdate:$lastUpdate}) ' +
                    'RETURN story', {name: name, systemStory: systemStory, relevance: relevance, randomness:  randomness, userStory: userStory, lastUpdate: lastUpdate})
            }
        })
        .then(result => singleStory(result.records[0]));		
}

async function updateStory(session, story, gameID) {

           const result = await session.run(
                    'MERGE (s:Story:`' + gameID + '` {name:$name}) ' +		
					'ON CREATE SET s += $newStory, s.new__ = TRUE ' +
					'ON MATCH SET s += $newStory ' +
					'WITH s, exists(s.new__) as isNew ' +	
					'REMOVE s.new__ ' +	
                    'RETURN s, isNew', {name: story.name, newStory: story});
					
    const newStories = result.records[0].get('isNew');
    return [story, newStories];
}


//list all stories
function getAllStories(session, gameID) {
    return session.run(
        'MATCH (story:Story:`' + gameID + '`) ' +
        'RETURN story ' + 
		'ORDER BY story.name')
        .then(result => {
                if (!_.isEmpty(result.records)) {
                    return multipleStories(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

//delete a story
function deleteStory(session, name, gameID) {

    let path = "public/" + gameID + "/story_editor/" + name;
    fs.access(path,(err)=> {
        if(!err)
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted '+path);
            })
        });

    return session.run(
        'MATCH (story:Story:`' + gameID + '` {name: $name}) ' +
        'DELETE story ' +
        'RETURN COUNT(story)', {name: name})
        .then(result => result.records[0].get('COUNT(story)').low)
}


//get story by name
function getStoryByName(session, name, gameID){
    return session.run(
        'MATCH (story:Story:`' + gameID + '` {name:$name}) ' +
        'RETURN story',
        {'name': name})
        .then(result => {
            const story = singleStory(result);
            if (story) {
                return story;
            }
            else {
                throw {message: 'story not found', status: 404};
            }
        });
}

module.exports = {
    addStory: addStory,
	updateStory: updateStory,
	getAllStories: getAllStories,
	deleteStory: deleteStory,
	getStoryByName: getStoryByName,
};