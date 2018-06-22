var fs = require('fs')
    , writeResponse = require('../helpers/response').writeResponse
    ,_ = require('lodash');

/**
 * @swagger
 * /api/v0/public/addMedia:
 *   post:
 *     tags:
 *     - media
 *     description: Add a new media
 *     summary: Add a new media
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: upfile
 *         type: file
 *       - in: header
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the scene
 *     responses:
 *       422:
 *           description: Another media has already this name
 */
exports.addMedia = function (req, res, next) {
    if(req.file)
        return res.status(200).end();
    else
        writeResponse(res, {message: 'Another media has already this name', status: 422},422);
};