/**
 * @swagger
 * definition:
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
 * definition:
 *   InteractiveObjects:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       rules:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Rules'
 */

