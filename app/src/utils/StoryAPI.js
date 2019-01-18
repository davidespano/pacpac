import Actions from '../actions/Actions'
import settings from './settings'
import Story from "../data/Story";

const request = require('superagent');

const {apiBaseURL} = settings;

var stories_updates = [
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. As soon as the sun broke out on the horizon, it was as if he were in New York City, and I had no idea what to do with her.The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. I kept my head down, staring at Nina's stunning blue eyes.The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. In fact, it seemed to be the most memorable night of my life.She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. It was so much more than that I could hardly believe what had happened to me.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. She's beautiful, but the truth is that I don't know what to do. She had the bouquet of purple roses, and I bit down on my fingers.I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. She stood up, afraid of the vase and mixed blood.She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. She was the only source of power, and I'd let it fade away at night.The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. She's beautiful, but the truth is that I don't know what to do. To be honest, I did n't know what to say to her.I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. Yes lights dimmed the city, and I saw a flash of light in the distance.She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
"We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. In fact, it was as if they were living in a vase full of flowers.The sun had risen from the ocean, making her feel more alive than normal. She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more."
];

function createStory(name, systemStory, relevance, randomness) {
	let userStory = "";
	let lastUpdate = "";
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/addStory`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name, systemStory: systemStory, relevance: relevance, randomness: randomness, userStory: userStory, lastUpdate: lastUpdate})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            
            // new Story object
           let newStory = Story({
				name : name.replace(/\.[^/.]+$/, ""),
				img : name,
				relevance : relevance,
				randomness : randomness,
				systemStory : systemStory,
				userStory : userStory,
				lastUpdate : lastUpdate,

            });

            Actions.receiveStory(newStory);
        });
}

function restoreSystemStory(story){

			let newStory = Story({
                name : story.name,
				img : story.img,
                relevance : story.relevance,
				randomness: story.randomness,
				systemStory: story.systemStory,
				userStory: "",
				lastUpdate: "",

            });
			updateStory(newStory);		
}

function editUserStory(story, content, lastUpdate){
		
			let newStory = Story({
                name : story.name,
				img : story.img,
                relevance : story.relevance,
				randomness: story.randomness,
				systemStory: story.systemStory,
				userStory: content,
				lastUpdate: lastUpdate,

            });
			updateStory(newStory);		
}

function changeStoryParameters(story, parameter, value){
	
				let newStory = Story({
                name : story.name,
				img: story.img,
                relevance : parameter === 'relevance' ? value : story.relevance ,
				randomness: parameter === 'randomness' ? value : story.randomness,
				systemStory: stories_updates[value-1],
				userStory: "",
				lastUpdate: "",

            });
	
			updateStory(newStory);		
}



function updateStory(story) {
   // request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${story.img}`)
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/updateStory`)	
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
		{
			name: story.img,	
			relevance: story.relevance, 
			randomness: story.randomness, 			
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

function deleteStory(story) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${story.img}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.removeStory(story);
        });
}


function getAllStories() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            if (response.body && response.body !== [])
                Actions.loadAllStories(response.body);
        });
}

function getStoryByName(name) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/stories/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
			
			
            // new Story object
            let newStory = Story({
                name : response.body.name.replace(/\.[^/.]+$/, ""),
				img: response.body.name,
                relevance : response.body.relevance,
				randomness: response.body.randomness,
				systemStory: response.body.systemStory,
				userStory: response.body.userStory,
				lastUpdate: response.body.lastUpdate,

            });

            Actions.receiveStory(newStory);

        });
}



export default {
    createStory: createStory,
	updateStory: updateStory,
	restoreSystemStory: restoreSystemStory,
	changeStoryParameters: changeStoryParameters,
	editUserStory: editUserStory,
	deleteStory: deleteStory,
	getAllStories: getAllStories,
	getStoryByName: getStoryByName,
};