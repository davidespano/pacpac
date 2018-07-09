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
 *       tag:
 *         $ref: '#/definitions/Tags'
 */

/**
 * @swagger
 * definition:
 *   DetailedScenes:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       tag:
 *         $ref: '#/definitions/Tags'
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
 *             $ref: '#/definitions/DetailedScenes'
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
 *         name: scene
 *         type: object
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *               required: true
 *               description: Name of the scene
 *             tagColor:
 *               type: string
 *               description: color of the tag
 *               required: true
 *             tagName:
 *               type: string
 *               description: name of the tag
 *               required: true
 *         required: true
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
    var tagColor = _.get(req.body, 'tagColor');
    var tagName = _.get(req.body, 'tagName');

    Scenes.addScene(dbUtils.getSession(req), name, tagColor, tagName)
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
 *             $ref: '#/definitions/DetailedScenes'
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
 *             $ref: '#/definitions/DetailedScenes'
 *       404:
 *          description: Scene not found
 */
exports.getNeighboursByName = function (req, res, next) {
    var name = req.params.name;
    Scenes.getNeighboursByName(dbUtils.getSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/scenes/{name}:
 *   delete:
 *     tags:
 *     - scenes
 *     description: Delete the scene
 *     summary: Delete a scene by name
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
 *         description: The number of deleted nodes
 */
exports.deleteScene = function (req, res, next) {
    var name = req.params.name;
    Scenes.deleteScene(dbUtils.getSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};
