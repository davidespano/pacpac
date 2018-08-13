const InteractiveObjects = require('../models/interactiveObjects')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  Rules:
 *      type: object
 *      properties:
 *          uuid:
 *              type: string
 *          event:
 *              type: string
 *          condition:
 *              type: string
 *          actions:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/Actions'
 *
 */

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
 *          rules:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/Rules'
 */

/**
 * @swagger
 * definitions:
 *  Transitions:
 *      type: object
 *      allOf:
 *          - $ref: '#/definitions/InteractiveObjects'
 */

/**
 * @swagger
 * definitions:
 *  Actions:
 *      type: object
 *      properties:
 *          uuid:
 *              type: string
 *          type:
 *              type: string
 *          target:
 *              type: string
 */


/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/transitions:
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
function putTransition(req, res, next) {
    const sceneName = req.params.name;
    const gameID = req.params.gameID;
    const transition = req.body;
    InteractiveObjects.createUpdateTransition(dbUtils.getSession(req), transition, sceneName, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => writeError(res, error, 500));
}

module.exports = {
    putTransition: putTransition
};