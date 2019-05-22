const Audio = require('../models/audios')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  Audio:
 *      type: object
 *      properties:
 *          uuid:
 *              type: string
 *          name:
 *              type: string
 *          file:
 *              type: string
 *          isLocal:
 *              type: boolean
 *          scene:
 *              type: string
 *          loop:
 *              type: boolean
 */


/**
 * @swagger
 * /api/v0/{gameID}/audios:
 *  get:
 *      tags:
 *      - audios
 *      description: Returns all audios
 *      summary: Returns all audios
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
 *              description: A list of audios
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: '#/definitions/Audio'
 */
function list(req, res, next) {
    const gameID = req.params.gameID;

    Audio.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/audios/scenes/{name}:
 *  put:
 *      tags:
 *      - audios
 *      description: Create a new local audio or modify an existing one
 *      summary: Create or modify an audio
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Uuid of the scene
 *        - in: path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in: body
 *          name: audio
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/Audio'
 *      responses:
 *          200:
 *              description: Transition updated
 *          201:
 *              description: Transition created
 *          404:
 *              description: Scene not found
 */
function putLocalAudio(req, res, next) {
    const sceneUuid = req.params.uuid;
    const gameID = req.params.gameID;
    const audio = req.body;
    Audio.createUpdateSpatialAudio(dbUtils.getSession(req), audio, sceneUuid, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => {
            writeError(res, error, 500)
            console.error(error);
        });
}

/**
 * @swagger
 * /api/v0/{gameID}/audios/:
 *  put:
 *      tags:
 *      - audios
 *      description: Create a new global audio or modify an existing one
 *      summary: Create or modify an audio
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in: body
 *          name: audio
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/Audio'
 *      responses:
 *          200:
 *              description: Transition updated
 *          201:
 *              description: Transition created
 *          404:
 *              description: Scene not found
 */
function putGlobalAudio(req, res, next) {
    const gameID = req.params.gameID;
    const audio = req.body;
    Audio.createUpdateGlobalAudio(dbUtils.getSession(req), audio, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => writeError(res, error, 500));
}

/**
 * @swagger
 * /api/v0/{gameID}/audios/{uuid}:
 *  delete:
 *      tags:
 *      - audios
 *      description: Delete an audio by id
 *      summary: Delete an audio
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in: path
 *          name: uuid
 *          type: string
 *          required: true
 *          description: UUID of audio
 *      responses:
 *          200:
 *              type: integer
 *              description: The number of deleted scenes (1)
 */
function deleteAudio(req, res, next){
    const uuid = req.params.uuid;
    const gameID = req.params.gameID;
    Audio.deleteAudio(dbUtils.getSession(req), uuid, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}


module.exports = {
    putLocalAudio: putLocalAudio,
    putGlobalAudio: putGlobalAudio,
    list: list,
    deleteAudio: deleteAudio,
}