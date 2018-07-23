"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var User = require('../models/neo4j/user');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

const saltRounds = 10;

var register = function (session, username, password) {
    return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
        .then(results => {
            if (!_.isEmpty(results.records)) {
                throw {username: 'username already in use', status: 400}
            }
            else {
                return bcrypt.hash(password, saltRounds);
            }
        }).then(hash => {
                return session.run('CREATE (user:User {id: {id}, username: {username}, password: {password}}) RETURN user',
                    {
                        id: uuid.v4(),
                        username: username,
                        password: hash,
                    }
                )
            }
        ).then(results => {
                return new User(results.records[0].get('user'));
            }
        );
};

var me = function (session, token) {
    return session.run(
        'MATCH (user:User {token: {token}}) ' +
        'OPTIONAL MATCH (user)-[:OWN_GAME]->(game:Game) ' +
        'RETURN user, ' +
        'collect(DISTINCT game) AS games', {token: token})
        .then(results => {
            if (_.isEmpty(results.records)) {
                throw {message: 'invalid authorization', status: 403};
            }
            let u = new User(results.records[0].get('user'));
            var now = new Date().getTime();
            if (u.tokenExpire < now) {
                throw {message: 'expired authorization', status: 403}
            }
            return session.run(
                'MATCH (user:User {token: {token}}) ' +
                'SET user.tokenExpire = {tokenExp} ', {token: token, tokenExp: now + 7200000}).
            then(res => {
                u.games = _.map(results.records[0].get('games'), record => {
                    return record.properties.gameID;
                })
                return u;
            })
        });
};

var login = function (session, username, password) {
    return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
        .then(results => {
                if (_.isEmpty(results.records)) {
                    throw {username: 'Username or password wrong', status: 400}
                }
                else {
                    var dbUser = _.get(results.records[0].get('user'), 'properties');

                    return bcrypt.compare(password, dbUser.password);

                }
            }
        ).then(res => {
            if (!res) {
                throw {password: 'Username or password wrong', status: 400}
            }
            return crypto.randomBytes(32);
        }).then(buf => {
            var token = buf.toString('hex');
            var tokenExp = new Date().getTime() + 7200000; //2hours in milliseconds

            return session.run('MATCH (user:User {username: {username}})' +
                'SET user += {token: {token}, tokenExpire: {tokenExp}}' +
                'RETURN user', {username: username, token: token, tokenExp: tokenExp})
                .then(results => {
                    if (_.isEmpty(results.records)) {
                        throw {username: 'Username or password wrong', status: 400}
                    }
                    else {
                        return {token: results.records[0].get('user').properties.token};

                    }
                })
        });
};

module.exports = {
    register: register,
    me: me,
    login: login
};