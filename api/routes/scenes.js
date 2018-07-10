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
 * /api/v0/{gameID}/scenes:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns all scenes
 *     summary: Returns all scenes
 *     produces:
 *       - application/json
 *     parameters:
 *      - in : path
 *        name : gameID
 *        type : string
 *        required : true
 *        description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *     responses:
 *       200:
 *         description: A list of scenes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scenes'
 */
exports.list = function (req, res, next) {
    var gameID = req.params.gameID;
    Scenes.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
.catch(next);
};

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}:
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
 *       - in : path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
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
    var gameID = req.params.gameID;
    Scenes.getByName(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/{gameID}/scenes/addScene:
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
 *       - in : path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
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
    var gameID = req.params.gameID;

    Scenes.addScene(dbUtils.getSession(req), name, tagColor, tagName, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/{gameID}/scenes/home:
 *   get:
 *     tags:
 *     - scenes
 *     description: Returns the home scene
 *     summary: Returns the home scene
 *     produces:
 *       - application/json
 *     parameters:
 *      - in : path
 *        name : gameID
 *        type : string
 *        required : true
 *        description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *     responses:
 *       200:
 *         description: A scene
 *         schema:
 *             $ref: '#/definitions/DetailedScenes'
 *       404:
 *          description: Scene not found
 */
exports.getHomeScene = function (req, res, next) {
    var gameID = req.params.gameID;

    Scenes.getHomeScene(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/neighbours:
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
 *       - in : path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
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
    var gameID = req.params.gameID;
    Scenes.getNeighboursByName(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}:
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
 *       - in : path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *     responses:
 *       200:
 *         description: The number of deleted nodes
 */
exports.deleteScene = function (req, res, next) {
    var name = req.params.name;
    var gameID = req.params.gameID;
    Scenes.deleteScene(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};
