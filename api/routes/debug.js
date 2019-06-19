const Debug = require('../models/debug')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');


/**
 * @swagger
 * definitions:
 *  DebugState:
 *      type: object
 *      properties:
 *          currentScene:
 *              type: string
 *          objectStates:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/InteractiveObjects'
 */


/**
 * @swagger
 * /api/v0/{gameID}/debug/state:
 *  put:
 *      tags:
 *      - debug
 *      description: Create a new debug state or modify an the existing one
 *      summary: Create or modify the debug state
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
 *          name: transition
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/DebugState'
 *      responses:
 *          200:
 *              description: State created/updated
 */
function putDebugState(req, res, next) {
    const debugState = req.body;
    const gameID = req.params.gameID;

    Debug.createUpdateDebugState(dbUtils.getSession(req), debugState, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}


/**
 * @swagger
 * /api/v0/{gameID}/debug/state:
 *  get:
 *      tags:
 *      - debug
 *      description: Returns the debug state
 *      summary: Returns the debug state
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
 *              description: debug state
 *              schema:
 *                  $ref: '#/definitions/DebugState'
 *          404:
 *              description: State not found
 */
function getDebugState(req, res, next){
    const gameID = req.params.gameID;

    Debug.getDebugState(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    putDebugState: putDebugState,
    getDebugState: getDebugState,
};