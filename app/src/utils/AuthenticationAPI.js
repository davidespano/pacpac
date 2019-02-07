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

function getUserDetail() {
    return request.get(`${apiBaseURL}/users/me`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .then(function(response, err){
            if(err){
                return console.error(err);
            }
            //todo action to send the user detail
        });
}

export default {
    login: login,
    getUserDetail: getUserDetail,
};