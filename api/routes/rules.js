const Rules = require('../models/rules')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');

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
 */


/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/rules:
 *  put:
 *      tags:
 *      - rules
 *      description: Create a new rule or modify an existing one
 *      summary: Create or modify a rule
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
 *          name: rule
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/Rules'
 *      responses:
 *          200:
 *              description: Rule updated
 *          201:
 *              description: Rule created
 *          404:
 *              description: Scene not found
 */
function putRule(req, res, next) {
    const sceneName = req.params.name;
    const gameID = req.params.gameID;
    const rule = req.body;
    Rules.createUpdateRule(dbUtils.getSession(req), rule, sceneName, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => writeError(res, error, 500));
}

/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/rules/{ruuid}:
 *  delete:
 *      tags:
 *      - rules
 *      description: Delete the rule
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
 *          name: ruuid
 *          type: string
 *          required: true
 *          description: Uuid of the rule
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
 *              description: The number of deleted rules (should be 1)
 */
function deleteRule(req, res, next) {
    const name = req.params.name;
    const ruuid = req.params.ruuid;
    const gameID = req.params.gameID;
    Rules.deleteRule(dbUtils.getSession(req), name, ruuid, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    putRule: putRule,
    deleteRule: deleteRule
};