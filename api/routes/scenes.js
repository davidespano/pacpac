var Scene = require('../models/scenes')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

//TODO definire la struttura delle scene per js e db

/**
 * @swagger
 * definition:
 *   Scenes:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/scenes:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns all scenes
 *     summary: Returns all scenes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of scenes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scenes'
 */
exports.list = function (req, res, next) {
    Scene.getAll(dbUtils.getSession(req))
        .then(response => writeResponse(res, response))
.catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/getByName:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns a scene by name
 *     summary: Returns a scene by name
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the scene
 *     responses:
 *       200:
 *         description: A scene
 *         schema:
 *             $ref: '#/definitions/Scenes'
 */
exports.getByName = function (req, res, next) {
    var author = req.headers['name'];
    Scene.getByName(dbUtils.getSession(req), author)
        .then(response => writeResponse(res, response))
        .catch(next);
};