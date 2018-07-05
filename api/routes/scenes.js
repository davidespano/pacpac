var Scenes = require('../models/scenes')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

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
    Scenes.getAll(dbUtils.getSession(req))
        .then(response => writeResponse(res, response))
.catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/{name}:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns a scene by name
 *     summary: Returns a scene by name
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the scene
 *     responses:
 *       200:
 *         description: A scene
 *         schema:
 *             $ref: '#/definitions/Scenes'
 *       404:
 *          description: Scene not found
 */
exports.getByName = function (req, res, next) {
    var name = req.params.name;
    Scenes.getByName(dbUtils.getSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/addScene:
 *   post:
 *     tags:
 *     - scenes
 *     description: Create a new scene
 *     summary: Create a new scene
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: name
 *         type: object
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *         required: true
 *         description: Name of the scene
 *     responses:
 *       200:
 *         description: A scene
 *         schema:
 *             $ref: '#/definitions/Scenes'
 *       422:
 *          description: Scene already exists
 */
exports.addScene = function (req, res, next) {
    var name = _.get(req.body,'name');
    var description = _.get(req.body, 'description');

    Scenes.addScene(dbUtils.getSession(req), name, description)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/home:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns the home scene
 *     summary: Returns the home scene
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A scene
 *         schema:
 *             $ref: '#/definitions/Scenes'
 *       404:
 *          description: Scene not found
 */
exports.getHomeScene = function (req, res, next) {
    Scenes.getHomeScene(dbUtils.getSession(req))
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/{name}/neighbours:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns adjacent scenes
 *     summary: Returns adjacent scenes
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the scene
 *     responses:
 *       200:
 *         description: A list of scenes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scenes'
 *       404:
 *          description: Scene not found
 */
exports.getNeighboursByName = function (req, res, next) {
    var name = req.params.name;
    Scenes.getNeighboursByName(dbUtils.getSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};