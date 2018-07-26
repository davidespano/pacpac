const sw = require("swagger-node-express");
const _ = require('lodash');

function writeResponse(res, response, status) {
    sw.setHeaders(res);
    res.status(status || 200).send(JSON.stringify(response));
}

function writeError(res, error, status) {
    sw.setHeaders(res);
    res.status(error.status || status || 400).send(JSON.stringify(_.omit(error, ['status'])));
}

module.exports = {
    writeResponse: writeResponse,
    writeError: writeError,
};