const Games = require('../models/games')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils')
    , _ = require('lodash');

/**
 * @swagger
 * /api/v0/create-game:
 *  post:
 *      tags:
 *      - games
 *      description: Create game
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: body
 *          name: name
 *          type: object
 *          schema:
 *              parameters:
 *                  name: name
 *                  type: string
 *                  description: Name of the new game
 *          required: true
 *        - name: Authorization
 *          in: header
 *          type: string
 *          required: true
 *          description: Token (token goes here)
 *      responses:
 *          200:
 *              description: game created
 *              schema:
 *                  properties:
 *                      id:
 *                          type: string
 *                      name:
 *                          type: string
 *          404:
 *              description: user not found
 *          400:
 *              description: game already existant
 */
function create_game(req, res, next) {
    const user = req.user;
    const name = req.body.name;

    Games.create_game(dbUtils.getSession(req), user, name)
        .then(response => writeResponse(res, response))
        .catch(next);
}

/**
 * @swagger
 * /api/v0/{gameID}/delete-game/:
 *  delete:
 *      tags:
 *      - games
 *      description: Create game
 *      produces:
 *          - application/json
 *      parameters:
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
 *              description: game deleted
 *          404:
 *              description: game does not exists
 */
function delete_game(req, res, next) {
    const user = req.user;
    const gameID = req.params.gameID;

    Games.delete_game(dbUtils.getSession(req), user, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    create_game: create_game,
    delete_game: delete_game,
};