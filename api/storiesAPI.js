var request = require('request-promise');

function storiesAPI(api) {
	
api.post('/:gameID/stories/generateStory', async function (req, res) {
	
	let path = [];
	
	for(i=0; i<req.body.filename.length; i++){
	path.push('http://cg3hci.dmi.unica.it/media/'+req.params.gameID+'/story_editor/'+req.body.filename[i]);
	}
	
    var data = { 
		paths: path,
		relevance: req.body.relevance,
		randomness: req.body.randomness,
		genres: req.body.genres
       }
	
	console.log(data);
	
    var opts = {
		method: 'POST',
		uri: 'http://10.132.0.15:5000/story',
		body: data,
		json: true
        };
        
	var returndata;
	var sendrequest = await request(opts)
	.then(function (parsedBody) {
		console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
		returndata = parsedBody; 
        })
	.catch(function (err) {
		console.log(err);
    });
        
		res.send(returndata);   
	});
}

module.exports = {
    storiesAPI: storiesAPI
};