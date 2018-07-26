const InteractiveObjects = require('../models/interactiveObjects')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  Rules:
 *      type: object
 *      properties:
 *          event:
 *              type: string
 *          condition:
 *              type: object
 *          action:
 *              type: object
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
 *        - in: body
 *          name: transition
 *          type: object
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
    InteractiveObjects.createUpdateTransition(dbUtils.getSession(req), sceneName, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    putTransition: putTransition
};