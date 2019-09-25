import Actions from '../actions/Actions'
import settings from './settings'
import User from "../data/User";
import GameAPI from "./GameAPI";

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

function register(username, password) {
    return request.post(`${apiBaseURL}/register`)
        .set('Accept', 'application/json')
        .send({username: username, password:password});
}

function getUserDetail(gameId = null) {
    return request.get(`${apiBaseURL}/users/me`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .then(
            function (response){ // success
            let rawUser = response.body;
            let user = User({
                uuid: rawUser.id,
                username: rawUser.username,
                games: rawUser.games,
            });

            Actions.receiveUser(user);

            if(gameId){
                let title = null;
                rawUser.games.forEach(g => {
                    if(g.gameID === gameId){
                        title = g.name;
                    }
                });
                Actions.setGameTitle(title);
            } else {
                Actions.gameSelectionModeOn();
            }

            },
            function (error) { // failure
                console.log(error)
            }
        );
}

function isUserAuthenticated() {
    return request.get(`${apiBaseURL}/users/me`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`);
}

export default {
    login: login,
    register: register,
    getUserDetail: getUserDetail,
    isUserAuthenticated: isUserAuthenticated,
};