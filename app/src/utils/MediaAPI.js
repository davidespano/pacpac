import settings from './settings'
import Actions from "../actions/Actions";

var request = require('superagent');

const {apiBaseURL} = settings;

var addMedia = function (name, media) {
    
    request.post(`${apiBaseURL}/public/addMedia`)
        .set('name', name)
        .attach('upfile', media)
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }
            Actions.receiveScene(response.body);
        });
};

export default {
    addMedia: addMedia
};