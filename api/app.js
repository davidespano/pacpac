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
    , filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware;
const app = express()
    , api = express();

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

app.use('/media', express.static(path.join(__dirname, 'public')));

//api custom middlewares:
api.use(setAuthUser);
api.use(neo4jSessionCleanup);
api.param('gameID', checkGameID);
api.param('objectType', checkInteractiveObjectType);

const fileManagerConfig = {
    fsRoot: path.resolve(__dirname, 'public'),
    rootName: 'Main Root'
};

api.use('/filemanager/:gameID', loginRequired, (req, res, next) => {
    fileManagerConfig.fsRoot = path.resolve(__dirname, 'public') + '/' + req.params.gameID;
    filemanagerMiddleware(fileManagerConfig)(req,res,next);
});

//api routes
api.post('/register', routes.users.register);
api.post('/login', routes.users.login);
api.get('/users/me', routes.users.me);

/**SCENES**/
api.get('/:gameID/scenes', routes.scenes.list);
api.get('/:gameID/scenes-all', routes.scenes.detailedList);
api.get('/:gameID/scenes/:name', routes.scenes.getByName);
api.get('/:gameID/scenes-home', routes.scenes.getHomeScene);
api.post('/:gameID/scenes/addScene', loginRequired, routes.scenes.addScene);
api.delete('/:gameID/scenes/:name', loginRequired, routes.scenes.deleteScene);
api.post('/:gameID/scenes/:name/setHome', loginRequired, routes.scenes.setHome);

/**TAGS**/
api.get('/:gameID/tags', routes.tags.list);
api.put('/:gameID/tags', loginRequired, routes.tags.putTag);

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