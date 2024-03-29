// movies.js
const Users = require('../models/users')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , loginRequired = require('../middlewares/loginRequired')
    , dbUtils = require('../neo4j/dbUtils')
    , _ = require('lodash');

/**
 * @swagger
 * definitions:
 *  User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        username:
 *          type: string
 *        avatar:
 *          type: object
 */

/**
 * @swagger
 * /api/v0/register:
 *  post:
 *      tags:
 *      - users
 *      description: Register a new user
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          type: object
 *          schema:
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        201:
 *          description: Your new user
 *          schema:
 *            $ref: '#/definitions/User'
 *        400:
 *          description: Error message(s)
 */
function register(req, res, next) {
    const username = _.get(req.body, 'username');
    const password = _.get(req.body, 'password');

    if (!username) {
        throw {username: 'This field is required.', status: 400};
    }
    if (!password) {
        throw {password: 'This field is required.', status: 400};
    }

    Users.register(dbUtils.getSession(req), username, password)
        .then(response => writeResponse(res, response, 201))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/login:
 *  post:
 *      tags:
 *      - users
 *      description: Login
 *      produces:
 *          - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          type: object
 *          schema:
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *              description: succesful login
 *              schema:
 *                  properties:
 *                      token:
 *                          type: string
 *          400:
 *              description: invalid credentials
 */
function login(req, res, next) {
    const username = _.get(req.body, 'username');
    const password = _.get(req.body, 'password');

    if (!username) {
        throw {username: 'This field is required.', status: 400};
    }
    if (!password) {
        throw {password: 'This field is required.', status: 400};
    }

    Users.login(dbUtils.getSession(req), username, password)
        .then(response => writeResponse(res, response))
        .catch(next);
}


/**
 * @swagger
 * /api/v0/users/me:
 *  get:
 *      tags:
 *      - users
 *      description: Get your user
 *      produces:
 *          - application/json
 *      parameters:
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *      responses:
 *          200:
 *              description: the user
 *              schema:
 *                  $ref: '#/definitions/User'
 *          401:
 *              description: invalid / missing authentication
 */
function me(req, res, next) {
    writeResponse(res, req.user);
}

module.exports = {
    register: register,
    me: me,
    login: login
};