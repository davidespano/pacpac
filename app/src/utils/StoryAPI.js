import Actions from '../actions/Actions'
import settings from './settings'
import Story from "../data/Story";
import StoryCollection from "../data/StoryCollection";
import StoryImage from "../data/StoryImage";

const request = require('superagent');

const {apiBaseURL} = settings;
const fs = require('fs');

let uuid = require('uuid');

function generateSystemStory(name, filename, relevance, randomness) {

    let genres = ["romance", "scifi", "adventure", "fantasy"];


    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/generateStory`)
        .set('Accept', 'application/json')
        .send({filename: filename, relevance: relevance, randomness: randomness, genres: genres})
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            createStory(name, filename, relevance, randomness, response.body);

        });
		
		Actions.resetFormImage();
}


function createStory(name, filename, relevance, randomness, systemStory) {
    let images = [];
    let stories = [];
    let id = uuid.v4();

    for (let i = 0; i < filename.length; i++) {
        let obj = {
            relevance: relevance[i],
            filename: filename[i],
            uuid: uuid.v4()
        };
        images.push(obj);
    }

    for (let key of Object.keys(systemStory)) {
        let obj = {
            genre: key,
            systemStory: systemStory[key],
            userStory: "",
            lastUpdate: "",
            uuid: uuid.v4()
        };
        stories.push(obj);
    }

    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/addStory`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({uuid: id, name: name, images: images, stories: stories, randomness: randomness})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }

            let images_uuids = [];
            let stories_uuids = [];

            images.map((image) => {
                images_uuids.push(image.uuid);
                let i = StoryImage({
                    uuid: image.uuid,
                    name: image.filename,
                    relevance: image.relevance,
                });
                Actions.receiveImage(i);
            });

            stories.map((story) => {
                stories_uuids.push(story.uuid);
                let s = Story({
                    uuid: story.uuid,
                    genre: story.genre,
                    systemStory: story.systemStory,
                    userStory: '',
                    lastUpdate: '',
                });
                Actions.receiveStory(s);
            });

            let newStoryCollection = StoryCollection({
                uuid: uuid,
                name: name,
                randomness: randomness,
                images: images_uuids,
                stories: stories_uuids,
            });

            Actions.receiveCollection(newStoryCollection);
        });
}

function restoreSystemStory(story) {

    let newStory = Story({
        uuid: story.uuid,
        genre: story.genre,
        systemStory: story.systemStory,
        userStory: "",
        lastUpdate: "",

    });
    updateStory(newStory);
}

function editStory(story, content, lastUpdate) {

    let newStory = Story({
        uuid: story.uuid,
        genre: story.genre,
        systemStory: story.systemStory,
        userStory: content,
        lastUpdate: lastUpdate,

    });
    updateStory(newStory);
}

function updateStory(story) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/updateStory`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: story.uuid,
                genre: story.genre,
                systemStory: story.systemStory,
                userStory: story.userStory,
                lastUpdate: story.lastUpdate,
            }
        )
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });

    Actions.updateStory(story);
}

function deleteStory(collection, story) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${collection.name}/${story.uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.removeStory(collection, story);
        });
}

function deleteCollection(collection, images) {

    Actions.removeCollection(collection);

    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${collection.name}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                images: images.map(a => a.name)
            }
        )
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
        });
}

function getAllCollections() {

    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }

            if (response.body && response.body !== [])
                Actions.loadAllCollections(response.body);
        });
}

function getCollectionByName(name) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            let images_uuids = [];
            let stories_uuids = [];

            response.body.images.map((image) => {
                images_uuids.push(image.uuid);
                let i = StoryImage({
                    uuid: image.uuid,
                    name: image.name,
                    relevance: image.relevance,
                });
                Actions.receiveImage(i);
            });

            response.body.stories.map((story) => {
                stories_uuids.push(story.uuid);
                let s = Story({
                    uuid: story.uuid,
                    genre: story.genre,
                    systemStory: story.systemStory,
                    userStory: story.userStory,
                    lastUpdate: story.lastUpdate,
                });
                Actions.receiveStory(s);
            });

            let newStoryCollection = StoryCollection({
                uuid: response.body.uuid,
                name: response.body.name,
                randomness: response.body.randomness,
                images: images_uuids,
                stories: stories_uuids,
            });

            Actions.receiveCollection(newStoryCollection);
        });


}

function changeRelevance(collection, img, relevance, images, stories) {

    let grs = [];
    let filename = [];
    let rel = [];

    images.forEach(i => {
        filename.push(i.name);
        i.uuid === img.uuid ? rel.push(relevance) : rel.push(i.relevance);
    });

    stories.forEach(s => {
        grs.push(s.genre);
    });


    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/generateStory`)
        .set('Accept', 'application/json')
        .send({filename: filename, relevance: rel, randomness: collection.randomness, genres: grs})
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            updateRelevance(img, relevance, stories, response.body);
        });

}

function updateRelevance(img, relevance, oldStory, newStory) {

    let newStories = [];

    oldStory.map((story) => {
        let s = Story({
            uuid: story.uuid,
            genre: story.genre,
            systemStory: newStory[story.genre],
            userStory: '',
            lastUpdate: '',
        });

        newStories.push(s);
        Actions.updateStory(s);

    });

    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/updateRelevance`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                img: img.uuid,
                relevance: relevance,
                newStory: newStories,
            }
        )
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });

    let i = StoryImage({
        uuid: img.uuid,
        name: img.name,
        relevance: relevance,
    });

    Actions.updateImage(i);
}

function changeRandomness(collection, randomness, images, stories) {

    let grs = [];
    let filename = [];
    let rel = [];

    images.forEach(i => {
        filename.push(i.name);
        rel.push(i.relevance);
    });

    stories.forEach(s => {
        grs.push(s.genre);
    });

    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/generateStory`)
        .set('Accept', 'application/json')
        .send({filename: filename, relevance: rel, randomness: randomness, genres: grs})
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            updateRandomness(collection, randomness, stories, response.body);
        });

}

function updateRandomness(collection, randomness, oldStory, newStory) {

    let newStories = [];

    oldStory.map((story) => {
        let s = Story({
            uuid: story.uuid,
            genre: story.genre,
            systemStory: newStory[story.genre],
            userStory: '',
            lastUpdate: '',
        });

        newStories.push(s);
        Actions.updateStory(s);

    });

    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/updateRandomness`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: collection.name, randomness: randomness, newStory: newStories})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });

    let newStColl = StoryCollection({
        uuid: collection.uuid,
        name: collection.name,
        randomness: randomness,
        images: collection.images,
        stories: collection.stories,
    });
    Actions.updateCollection(newStColl);

}

export default {
    createStory: createStory,
    updateStory: updateStory,
    restoreSystemStory: restoreSystemStory,
    editStory: editStory,
    deleteStory: deleteStory,
    getAllCollections: getAllCollections,
    getCollectionByName: getCollectionByName,
    generateSystemStory: generateSystemStory,
    changeRandomness: changeRandomness,
    updateRandomness: updateRandomness,
    changeRelevance: changeRelevance,
    updateRelevance: updateRelevance,
    deleteCollection: deleteCollection,

};