const crypto = require('crypto');
const fs = require('fs');
const del = require('del');
const _ = require('lodash');


function create_game(session, user, name) {
    return session.run('MATCH (user:User {id:$id})-[:OWN_GAME]->(game:Game {name:$name}) ' +
        'RETURN user',{id: user.id, name: name}).then(results => {

        if (!_.isEmpty(results.records)) {
            throw {message: 'game already existent', status: 400}
        }
        const gameId = crypto.randomBytes(16).toString("hex");
        return session.run(
            'MATCH (user:User {id: $id}) ' +
            'CREATE (user)-[:OWN_GAME]->(game:Game {gameID:$gameId, name:$name}) ' +
            'RETURN game', {id: user.id, name: name, gameId: gameId}).then(results => {
            if (_.isEmpty(results.records)) {
                throw {message: 'user not found', status: 404};
            }
            return results.records[0].get("game").properties;
        }).then(game =>{
            fs.mkdirSync(`public/${game.gameID}`);
            return game;
        })});
}

function delete_game(session, user, gameID) {
    return session.run('MATCH (user:User {id:$id})-[:OWN_GAME]->(game:Game {gameID:$gameID}) ' +
        'RETURN user',{id: user.id, gameID: gameID}).then(results => {

        if (_.isEmpty(results.records)) {
            throw {message: 'game does not exist', status: 404}
        }

        return session.run(
            'MATCH (user:User {id:$id})-[:OWN_GAME]->(game:Game {gameID:$gameID}) ' +
            'OPTIONAL MATCH (n:`' + gameID + '`)' +
            'DETACH DELETE game, n ' +
            'RETURN COUNT(game)'
            , {id: user.id, gameID: gameID}).then(results => {
            if(results.records)
                return results.records[0].get('COUNT(game)').low;
        }).then(async res =>{
            const deleted = await del([`public/${gameID}/**`]);
            console.log(deleted);
            return res;
        })});
}

module.exports = {
    create_game: create_game,
    delete_game: delete_game,
};