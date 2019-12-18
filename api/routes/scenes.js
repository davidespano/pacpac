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

function getByUuid(req, res, next) {
    const uuid = req.params.uuid;
    const gameID = req.params.gameID;
    Scenes.getByUuid(dbUtils.getSession(req), uuid, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes-all:
 *  get:
 *      tags:
 *      - scenes
 *      description: Returns all scenes with their details
 *      summary: Returns all scenes with their details
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
 *              description: A list of detailed scenes
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/DetailedScenes'
 */
function detailedList(req, res, next) {
    const gameID = req.params.gameID;
    Scenes.getAllDetailed(dbUtils.getSession(req), gameID)
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
 *                  uuid:
 *                      type: string
 *                      required: true
 *                      description: uuid of the scene
 *                  name:
 *                      type: string
 *                      required: true
 *                      description: Name of the scene
 *                  img:
 *                      type: string
 *                      required: true
 *                      description: Img of the scene
 *                  index:
 *                      type: integer
 *                      required: true
 *                      description: Index of the scene
 *                  type:
 *                      type: string
 *                      required: true
 *                      description: Type of the scene (3D / 2D)
 *                  tag:
 *                      type: string
 *                      description: Uuid of the tag
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
 *          404:
 *              description: Tag does not exists
 *          422:
 *              description: Scene already exists
 */
function addScene(req, res, next) {
    const uuid = req.body.uuid;
    const name = req.body.name;
    const img = req.body.img;
    const index = req.body.index;
    const tag = req.body.tag;
    const type = req.body.type;
    const gameID = req.params.gameID;

    Scenes.addScene(dbUtils.getSession(req), uuid, name, img, index, type, tag, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/updateScene:
 *  put:
 *      tags:
 *      - scenes
 *      description: Update a scene
 *      summary: Update a scene
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: body
 *          name: scene
 *          type: object
 *          schema:
 *              properties:
 *                  uuid:
 *                      type: object
 *                      required: true
 *                      description: scene
 *                      schema:
 *                          $ref: '#/definitions/Scenes'
 *                  tag:
 *                      type: string
 *                      description: Uuid of the tag
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
 *          404:
 *              description: Scene/Tag does not exists
 */
function updateScene(req, res, next) {
    const scene = req.body.scene;
    const tag = req.body.tag;
    const gameID = req.params.gameID;

    Scenes.updateScene(dbUtils.getSession(req), scene, tag, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/getHomeScene:
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
 *              description: The number of deleted scenes (1)
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
 * /api/v0/{gameID}/scenes/{name}/setHomeScene:
 *  post:
 *      tags:
 *      - scenes
 *      description: Set the home Scene
 *      summary: Set scene passed as Home scene
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: sceneID
 *          type: string
 *          required: true
 *          description: the uuid of the scene
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
function setHomeScene(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    Scenes.setHomeScene(dbUtils.getSession(req), name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    list: list,
    getByName: getByName,
    getByUuid: getByUuid,
    addScene: addScene,
    updateScene: updateScene,
    getHomeScene: getHomeScene,
    deleteScene: deleteScene,
    setHomeScene: setHomeScene,
    detailedList: detailedList
};