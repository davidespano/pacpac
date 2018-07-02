import settings from './settings'
import Actions from "../actions/Actions";

var request = require('superagent');

const {apiBaseURL} = settings;

var addMedia = function (name, media) {

    //var data = new FormData();
    //data.append(media);
    //data.append('file', document.getElementById("imageInput")[0].files[0]);

    request.post(`${apiBaseURL}/public/addMedia`)
        .set('name', name)
        .set('Content-Type', 'multipart/form-data')
        //.send({media: media})
        .field('media', media)
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


//.field('media', media)