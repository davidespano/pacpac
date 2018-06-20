import settings from './settings'
import Actions from "../actions/Actions";

var request = require('superagent');

const {apiBaseURL} = settings;

var addMedia= function (name, media) {

    var data = new FormData();
    data.append(media);
    //data.append('file', document.getElementById("imageInput")[0].files[0]);

    request.post(`${apiBaseURL}/public/addMedia`)
        .send({media: data, name: name})
        .end(function(err, response) {
            if (err) {
                return console.error(err);
            }
            Actions.receiveScene(response.body);
        });
};

export default {
    addMedia: addMedia
};