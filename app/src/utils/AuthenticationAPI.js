import settings from './settings'

var request = require('superagent');

const {apiBaseURL} = settings;

function login(username, password) {
    return request.post(`${apiBaseURL}/login`)
        .set('Accept', 'application/json')
        .send({username: username, password:password})
        .then(function(response, err){
            if(err){
                return console.error(err);
            }
            window.localStorage.removeItem("authToken");
            window.localStorage.setItem("authToken", response.body.token);
        });
}

export default {
    login: login
};