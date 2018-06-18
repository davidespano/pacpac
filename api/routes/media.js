var fs = require('fs')
    , writeResponse = require('../helpers/response').writeResponse;

/**
 * @swagger
 * /api/v0/public/addMedia:
 *   post:
 *     tags:
 *     - media
 *     description: Add a new media
 *     summary: Add a new media
 *     parameters:
 *       - in: body
 *         name: media
 *         type: ???
 *         required: true
 *         description: The media
 *     responses:
 *       422:
 *           description: Another media has already this name
 */
exports.addMedia = function (req, res, next) {
};