/**
 * @swagger
 * definitions:
 *   Rules:
 *     type: object
 *     properties:
 *       event:
 *         type: string
 *       condition:
 *         type: object
 *       action:
 *         type: object
 */

/**
 * @swagger
 * definitions:
 *   InteractiveObjects:
 *     type: object
 *     properties:
 *       uuid:
 *         type: string
 *       name:
 *         type: string
 *       rules:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Rules'
 */

/**
 * @swagger
 * definitions:
 *  Transitions:
 *      type: object
 *      allOf:
 *          - $ref: '#/definitions/InteractiveObjects'
 */


/**
 * @swagger
 * /api/v0/{gameID}/scenes/{name}/transitions:
 *   get:
 *     tags:
 *     - interactive objects
 *     description: Create a new transition or modify an existing one
 *     summary: Create or modify a transition
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the scene
 *       - in: path
 *         name : gameID
 *         type : string
 *         required : true
 *         description : ID of the game  Example 3f585c1514024e9391954890a61d0a04
 *       - in: body
 *         name: transition
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Transitions'
 *     responses:
 *       200:
 *         description: Transition updated
 *       201:
 *         description: Transition created
 *       404:
 *          description: Scene not found
 */
exports.putTransition = function (req, res, next) {
    // var name = req.params.name;
    // var gameID = req.params.gameID;
    // Scenes.getNeighboursByName(dbUtils.getSession(req), name, gameID)
    //     .then(response => writeResponse(res, response))
    //     .catch(next);
};
