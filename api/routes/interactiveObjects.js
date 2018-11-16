const InteractiveObjects = require('../models/interactiveObjects')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  InteractiveObjects:
 *      type: object
 *      properties:
 *          uuid:
 *              type: string
 *          name:
 *              type: string
 *          vertices:
 *              type: string
 */

/**
 * @swagger
 * definitions:
 *  Transitions:
 *      type: object
 *      properties:
 *          uuid:
 *              type: string
 *          name:
 *              type: string
 *          vertices:
 *              type: string
 *          duration:
 *              type: string
 */

/**
 * @swagger
 * /api/v0/{gameID}/interactives/scenes/{name}/{objectType}:
 *  put:
 *      tags:
 *      - interactive objects
 *      description: Create a new transition or modify an existing one
 *      summary: Create or modify a transition
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - in: path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *        - in: path
 *          name : objectType
 *          type : string
 *          required : true
 *          description : Type of the interactive object
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *        - in: body
 *          name: transition
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/Transitions'
 *      responses:
 *          200:
 *              description: Transition updated
 *          201:
 *              description: Transition created
 *          404:
 *              description: Scene not found
 */
function putInteractiveObject(req, res, next) {
    const sceneName = req.params.name;
    const gameID = req.params.gameID;
    const objectType = req.params.objectType;
    const interactiveObj = req.body;
    InteractiveObjects.createUpdateInteractiveObject(dbUtils.getSession(req), interactiveObj, sceneName, gameID, objectType)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => writeError(res, error, 500));
}


/**
 * @swagger
 * /api/v0/{gameID}/interactives/scenes/{name}/transitions/{tuuid}:
 *  delete:
 *      tags:
 *      - interactive objects
 *      description: Delete the transition
 *      summary: Delete a transition by uuid
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - in: path
 *          name: tuuid
 *          type: string
 *          required: true
 *          description: Uuid of the transition
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
 *        - in: path
 *          name : objectType
 *          type : string
 *          required : true
 *          description : Type of the interactive object
 *      responses:
 *          200:
 *              type: integer
 *              description: The number of deleted objects (should be 1)
 */
function deleteInteractiveObject(req, res, next) {
    const name = req.params.name;
    const tuuid = req.params.tuuid;
    const gameID = req.params.gameID;
    const objectType = req.params.objectType;
    InteractiveObjects.deleteInteractiveObject(dbUtils.getSession(req), name, tuuid, gameID, objectType)
        .then(response => writeResponse(res, response))
        .catch(next);
}


module.exports = {
    putInteractiveObject: putInteractiveObject,
    deleteInteractiveObject: deleteInteractiveObject
};