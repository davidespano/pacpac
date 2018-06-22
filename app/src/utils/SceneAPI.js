import Actions from '../actions/Actions'
import settings from './settings'
var request = require('superagent')

const {apiBaseURL} = settings;

var getByName = function(name) {
    request.get(`${apiBaseURL}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.receiveScene(response.body);
        });
};

function existsByName(name){
    request.get(`${apiBaseURL}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function(err, response){
            return !(response.status == 404);
        });
}

export default {
    getByName: getByName,
    existsByName: existsByName,
};