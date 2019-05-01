import settings from "./settings";
import Actions from "../actions/Actions";
import EditorStateStore from "../data/EditorStateStore";
import Immutable from "immutable";


const request = require('superagent');

const {apiBaseURL} = settings;

function createGame(name) {
    return request.post(`${apiBaseURL}/create-game`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name})
        .then((response) => {

            let user = EditorStateStore.getState().get("user");
            let games = user.get("games").slice();
            games.push(response.body);

            let newUser = user.set("games",games);

            Actions.receiveUser(newUser);

        });
}

export default{
    createGame: createGame,
}