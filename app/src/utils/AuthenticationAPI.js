import Actions from '../actions/Actions'
import settings from './settings'
import User from "../data/User";

var request = require('superagent');

const {apiBaseURL} = settings;

function login(username, password) {
    return request.post(`${apiBaseURL}/login`)
        .set('Accept', 'application/json')
        .send({username: username, password:password})
        .then(function(response){
            window.localStorage.removeItem("authToken");
            window.localStorage.setItem("authToken", response.body.token);
            });
}

function getUserDetail() {
    return request.get(`${apiBaseURL}/users/me`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .then(function(response){
            let rawUser = response.body;
            let user = User({
                uuid: rawUser.id,
                username: rawUser.username,
                games: rawUser.games,
            });
            console.log(user)
            Actions.receiveUser(user);
            //Action.switchToGameSelection();
        });
}

export default {
    login: login,
    getUserDetail: getUserDetail,
};