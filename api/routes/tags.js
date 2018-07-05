var Tags = require('../models/tags')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Tags:
 *     type: object
 *     properties:
 *       id:
 *         type: int
 *       color:
 *         type: string
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/tags:
 *   get:
 *     tags:
 *     - tags
 *     description: Returns all tags
 *     summary: Returns all tags
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of tags
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scenes'
 */
exports.list = function (req, res, next) {
    Tags.getAll(dbUtils.getSession(req))
        .then(response => writeResponse(res, response))
        .catch(next);
};