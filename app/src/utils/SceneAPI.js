import Actions from '../actions/Actions'
import settings from './settings'
var request = require('superagent')

const {apiBaseURL} = settings;

var getByName = function(name) {
    request.get(`${apiBaseURL}/scenes/getByName`)
        .set('Accept', 'application/json')
        .set('name', name)
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            };

            Actions.receiveScene(response.body);
        });
}

export default {
    getByName: getByName
};