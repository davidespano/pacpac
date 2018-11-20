const fs = require('fs')
    , writeResponse = require('../helpers/response').writeResponse
    , _ = require('lodash');

/**
 * @swagger
 * /api/v0/public/{gameID}/addSceneMedia:
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
 *          422:
 *              description: Another media has already this name
 */
function addSceneMedia(req, res, next) {
    if (req.file) {
        console.log(req.file);
        if(req.file.mimetype.includes('video')) {

        }
        return res.status(200).end();
    }
    else {
        writeResponse(res, {message: 'Another media has already this name', status: 422}, 422);
    }
}

/**
 * @swagger
 * /api/v0/public/{gameID}/addInteractiveMedia:
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
 *          422:
 *              description: Another media has already this name
 */
function addInteractiveMedia(req, res, next) {
    if (req.file) {
        console.log(req.file);
        if(req.file.mimetype.includes('video')) {

        }
        return res.status(200).end();
    }
    else {
        writeResponse(res, {message: 'Another media has already this name', status: 422}, 422);
    }
}

module.exports = {
    addSceneMedia: addSceneMedia,
    addInteractiveMedia: addInteractiveMedia,
};