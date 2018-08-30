const Scenes = require('../models/scenes')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  Scenes:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          tag:
 *              $ref: '#/definitions/Tags'
 *          type:
 *              type: string
 */

/**
 * @swagger
 * definitions:
 *  DetailedScenes:
 *      type: object
 *      allOf:
 *          - $ref: '#definitions/Scenes'
 */

/**
 * @swagger
 * /api/v0/{gameID}/scenes:
 *  get:
 *      tags:
 *      - scenes
 *      description: Returns all scenes
 *      summary: Returns all scenes
 *      produces:
 *          - application/json
 *      parameters:
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: A list of scenes
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Scenes'
 */
function list(req, res, next) {
    const gameID = req.params.gameID;
    Scenes.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}:
 *  get:
 *      tags:
 *      - scenes
 *      description: Returns a scene by name
 *      summary: Returns a scene by name
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: A scene
 *              schema:
 *                  $ref: '#/definitions/DetailedScenes'
 *          404:
 *              description: Scene not found
 */
function getByName(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Scenes.getByName(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/addScene:
 *  post:
 *      tags:
 *      - scenes
 *      description: Create a new scene
 *      summary: Create a new scene
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: body
 *          name: scene
 *          type: object
 *          schema:
 *              properties:
 *                  name:
 *                      type: string
 *                      required: true
 *                      description: Name of the scene
 *                  index:
 *                      type: integer
 *                      required: true
 *                      description: Index of the scene
 *                  type:
 *                      type: string
 *                      required: true
 *                      description: Type of the scene (3D / 2D)
 *                  tagColor:
 *                      type: string
 *                      description: color of the tag
 *                      required: true
 *                  tagName:
 *                      type: string
 *                      description: name of the tag
 *                      required: true
 *          required: true
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: A scene
 *              schema:
 *                  $ref: '#/definitions/Scenes'
 *          422:
 *              description: Scene already exists
 */
function addScene(req, res, next) {
    const name = req.body.name;
    const index = req.body.index;
    const tagColor = req.body.tagColor;
    const tagName = req.body.tagName;
    const type = req.body.type;
    const gameID = req.params.gameID;

    Scenes.addScene(dbUtils.getSession(req), name, index, type, tagColor, tagName, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/home:
 *  get:
 *      tags:
 *      - scenes
 *      description: Returns the home scene
 *      summary: Returns the home scene
 *      produces:
 *          - application/json
 *      parameters:
 *       - in : path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: A scene
 *              schema:
 *                  $ref: '#/definitions/DetailedScenes'
 *          404:
 *              description: Scene not found
 */
function getHomeScene(req, res, next) {
    const gameID = req.params.gameID;

    Scenes.getHomeScene(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/neighbours:
 *  get:
 *      tags:
 *      - scenes
 *      description: Returns adjacent scenes
 *      summary: Returns adjacent scenes
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: A list of scenes
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: '#/definitions/Scenes'
 *          404:
 *              description: Scene not found
 */
function getNeighboursByName(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Scenes.getNeighboursByName(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}:
 *  delete:
 *      tags:
 *      - scenes
 *      description: Delete the scene
 *      summary: Delete a scene by name
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              type: integer
 *              description: The number of deleted nodes
 */
function deleteScene(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Scenes.deleteScene(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/setHome:
 *  post:
 *      tags:
 *      - scenes
 *      description: Set the home Scene
 *      summary: Set scene passed as Home scene
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          200:
 *              description: Home setted
 *          404:
 *              description: Scene not found
 */
function setHome(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Scenes.setHome(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    list: list,
    getByName: getByName,
    addScene: addScene,
    getHomeScene: getHomeScene,
    getNeighboursByName: getNeighboursByName,
    deleteScene: deleteScene,
    setHome: setHome
};