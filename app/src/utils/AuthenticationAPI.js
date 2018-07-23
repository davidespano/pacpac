import settings from './settings'

var request = require('superagent');

const {apiBaseURL} = settings;

function login(username, password) {
    request.post(`${apiBaseURL}/login`)
        .set('Accept', 'application/json')
        .send({username: username, password:password})
        .end(function(err, response){
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