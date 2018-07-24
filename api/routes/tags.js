var Tags = require('../models/tags')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definitions:
 *   Tags:
 *     type: object
 *     properties:
 *       color:
 *         type: string
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/{gameID}/tags:
 *   get:
 *     tags:
 *     - tags
 *     description: Returns all tags
 *     summary: Returns all tags
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
 *         description: A list of tags
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Tags'
 */
exports.list = function (req, res, next) {
    var gameID = req.params.gameID;

    Tags.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
};