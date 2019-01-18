const fs = require('fs')
    , writeResponse = require('../helpers/response').writeResponse
    , Media = require('../models/media')
    , dbUtils = require('../neo4j/dbUtils')
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
/**
 * @swagger
 * /api/v0/{gameID}/assets:
 *  get:
 *      tags:
 *      - media
 *      description: Returns all assets
 *      summary: Returns all assets
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
 *              description: A list of assets
 *              schema:
 *                  type: array
 *                  items:
 *                     type: string
 */
function list(req, res, next){
    const gameID = req.params.gameID;
    Media.getAll(dbUtils.getSession(req), gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/assets/{name}:
 *  delete:
 *      tags:
 *      - media
 *      description: Delete the asset
 *      summary: Delete an asset by name
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: name
 *          type: string
 *          required: true
 *          description: Name of the asset
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
 *              description: Asset deleted
 */
function deleteAsset(req, res, next) {
    const name = req.params.name;
    const gameID = req.params.gameID;
    try{
        Media.deleteAsset(dbUtils.getSession(req), name, gameID);
    }catch (e) {
        next(e);
    }
    return res.status(200).end();
}

function addStoryImage(req, res, next) {
    if (req.file) {
        console.log(req.file);
        return res.status(200).end();
    }
    else {
        writeResponse(res, {message: 'Another media has already this name', status: 422}, 422);
    }
}

module.exports = {
    list: list,
    deleteAsset: deleteAsset,
    addSceneMedia: addSceneMedia,
    addInteractiveMedia: addInteractiveMedia,
	addStoryImage: addStoryImage,	
};