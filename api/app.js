const express = require('express')
    , path = require('path')
    , routes = require('./routes')
    , nconf = require('./config')
    , swaggerJSDoc = require('swagger-jsdoc')
    , methodOverride = require('method-override')
    , errorHandler = require('errorhandler')
    , bodyParser = require('body-parser')
    , setAuthUser = require('./middlewares/setAuthUser').setAuthUser
    , neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup').neo4jSessionCleanup
    , writeError = require('./helpers/response').writeError
    , checkGameID = require('./middlewares/checkGameID').checkGameID
    , checkInteractiveObjectType = require('./middlewares/checkInteractiveObjectType').checkInteractiveObjectType
    , loginRequired = require('./middlewares/loginRequired').loginRequired
    , handleMediaAPI = require('./handleMediaAPI').handleMediaAPI
    , handleFilemanagerAPI = require('./handleFilemanagerAPI').handleFilemanagerAPI
    , fs = require('fs')
    , mime = require('mime-types')
	, storiesAPI = require('./storiesAPI').storiesAPI;
const app = express()
    , api = express();

//__dirname = "/Users/davide/WebstormProjects/pacpac-data/media/"
//commento per commit
app.use(nconf.get('api_path'), api);

const swaggerDefinition = {
    info: {
        title: 'Neo4j API for PACPAC (Node/Express)',
        version: '2.0.0',
        description: '',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// serve swagger
api.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/docs', express.static(path.join(__dirname, 'swaggerui')));
app.set('port', nconf.get('PORT'));

api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
const customHeaders = "name"; //headers we use for our api
api.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, " + customHeaders);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, " + customHeaders);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

//app.use('/media', express.static(path.join(__dirname, 'public')));

app.use('/media/*', function(req, res) {
    const fileName = path.join(__dirname, 'public/' + req.params[0]);
    const stat = fs.statSync(fileName);
    const fileSize = stat.size;
    const range = req.headers.range;
    const mimeType = mime.lookup(fileName);
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(fileName, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': mimeType,
        };
        res.writeHead(200, head);
        fs.createReadStream(fileName).pipe(res);
    }
});

//api custom middlewares:
api.use(setAuthUser);
api.use(neo4jSessionCleanup);
api.param('gameID', checkGameID);
api.param('objectType', checkInteractiveObjectType);


handleFilemanagerAPI(api);

//api routes
api.post('/register', routes.users.register);
api.post('/login', routes.users.login);
api.get('/users/me', routes.users.me);

/**GAMES**/
api.post('/create-game', loginRequired,routes.games.create_game);
api.delete('/:gameID/delete-game', loginRequired, routes.games.delete_game);

/**SCENES**/
api.get('/:gameID/scenes', routes.scenes.list);
api.get('/:gameID/scenes-all', routes.scenes.detailedList);
api.get('/:gameID/scenes/:name', routes.scenes.getByName);
api.get('/:gameID/scenes/uuid/:uuid', routes.scenes.getByUuid);
api.get('/:gameID/getHomeScene', routes.scenes.getHomeScene);
api.get('/:gameID/getNodes', routes.scenes.getNodes);
api.delete('/:gameID/delNodes', routes.scenes.delNodes);
api.post('/:gameID/scenes/addScene', loginRequired, routes.scenes.addScene);
api.put('/:gameID/scenes/updateScene', loginRequired, routes.scenes.updateScene);
api.delete('/:gameID/scenes/:name', loginRequired, routes.scenes.deleteScene);
api.post('/:gameID/scenes/:name/setHomeScene', loginRequired, routes.scenes.setHomeScene);
api.post('/:gameID/scenes/setNodes', routes.scenes.setNodes);

/**TAGS**/
api.get('/:gameID/tags', routes.tags.list);
api.put('/:gameID/tags', loginRequired, routes.tags.putTag);
api.delete('/:gameID/tags/:uuid', loginRequired, routes.tags.deleteTag);


/**INTERACTIVE OBJECTS**/
api.put('/:gameID/interactives/scenes/:name/:objectType', loginRequired, routes.interactiveObjects.putInteractiveObject);
api.delete('/:gameID/interactives/scenes/:name/:objectType/:tuuid', loginRequired, routes.interactiveObjects.deleteInteractiveObject);

/**RULES**/
api.put('/:gameID/rules/scenes/:name/rules', loginRequired, routes.rules.putRule);
api.delete('/:gameID/rules/scenes/:name/rules/:ruuid', loginRequired, routes.rules.deleteRule);

/**MEDIA**/
api.get('/:gameID/assets', routes.media.list);
api.delete('/:gameID/assets/:name',loginRequired, routes.media.deleteAsset);
handleMediaAPI(api);

/**AUDIO**/
api.put('/:gameID/audios', loginRequired, routes.audios.putGlobalAudio);
api.put('/:gameID/audios/scenes/:uuid', loginRequired, routes.audios.putLocalAudio);
api.get('/:gameID/audios', routes.audios.list);
api.delete('/:gameID/audios/:uuid', loginRequired, routes.audios.deleteAudio);

/**STORIES**/
api.get('/:gameID/stories', routes.stories.listStories);
api.get('/:gameID/stories/:name', routes.stories.getStoryByName);
api.post('/:gameID/stories/addStory', loginRequired, routes.stories.addStory);
api.put('/:gameID/stories/updateStory', routes.stories.updateStory);
api.put('/:gameID/stories/updateRandomness', routes.stories.updateRandomness);
api.put('/:gameID/stories/updateRelevance', routes.stories.updateRelevance);
api.delete('/:gameID/stories/:name/:uuid', loginRequired, routes.stories.deleteStory);
api.delete('/:gameID/stories/:name', loginRequired, routes.stories.deleteCollection);
storiesAPI(api);

/**DEBUG**/
api.put('/:gameID/debug/state', loginRequired, routes.debug.putDebugState);
api.get('/:gameID/debug/state/:saveName', routes.debug.getDebugState);
api.get('/:gameID/debug/state', routes.debug.getAllSaves);

//api error handler
api.use(function (err, req, res, next) {
    if (err && err.status) {
        writeError(res, err);
    }
    else next(err);
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
