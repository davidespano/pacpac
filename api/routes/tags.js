const Tags = require('../models/tags')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , writeError = require('../helpers/response').writeError
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *  Tags:
 *      type: object
 *      properties:
 *          color:
 *              type: string
 *          name:
 *              type: string
 */

/**
 * @swagger
 * /api/v0/{gameID}/tags:
 *  get:
 *      tags:
 *      - tags
 *      description: Returns all tags
 *      summary: Returns all tags
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
 *              description: A list of tags
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: '#/definitions/Tags'
 */
function list(req, res, next) {
    const gameID = req.params.gameID;

    Tags.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/tags:
 *  put:
 *      tags:
 *      - tags
 *      description: Create a new tag or modify an existing one
 *      summary: Create or modify a tag
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
 *          name: tag
 *          type: object
 *          required: true
 *          schema:
 *              $ref: '#/definitions/Tags'
 *      responses:
 *          200:
 *              description: Tag updated
 *          201:
 *              description: Tag created
 */
function putTag(req, res, next) {
    const gameID = req.params.gameID;
    const tag = req.body;
    Tags.createUpdateTag(dbUtils.getSession(req), tag, gameID)
        .then(response => writeResponse(res, response[0], response[1]?201:200)) //the function return true if created, so 201
        .catch(error => writeError(res, error, 500));
}

module.exports = {
    list: list,
    putTag: putTag
};