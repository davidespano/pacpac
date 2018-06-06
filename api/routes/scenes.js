var Scene = require('../models/scenes')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Scene:
 *     type: object
 *     properties TODO define this and the next:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       born:
 *         type: integer
 *       poster_image:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/scene:
 *   get:
 *     tags:
 *     - scene
 *     description: Returns all scenes
 *     summary: Returns all scenes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of scenes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scene'
 */
exports.list = function (req, res, next) {
    Scene.getAll(dbUtils.getSession(req))
        .then(response => writeResponse(res, response))
.catch(next);
};
