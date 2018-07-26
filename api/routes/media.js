const fs = require('fs')
    , writeResponse = require('../helpers/response').writeResponse
    , _ = require('lodash');

/**
 * @swagger
 * /api/v0/public/{gameID}/addMedia:
 *  post:
 *      tags:
 *      - media
 *      description: Add a new media
 *      summary: Add a new media
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *        - in: formData
 *          name: upfile
 *          type: file
 *        - in: header
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the scene
 *        - in : path
 *          name : gameID
 *          type : string
 *          required : true
 *          description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *      responses:
 *          422:
 *              description: Another media has already this name
 */
function addMedia(req, res, next) {
    if(req.file)
        return res.status(200).end();
    else
        writeResponse(res, {message: 'Another media has already this name', status: 422},422);
}

module.exports = {
    addMedia: addMedia
};