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
    , multer = require('multer')
    , fs = require('fs')
    , checkGameID = require('./middlewares/checkGameID').checkGameID
    , loginRequired = require('./middlewares/loginRequired').loginRequired;

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
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, " + customHeaders);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
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

//api routes
api.post('/register', routes.users.register);
api.post('/login', routes.users.login);
api.get('/users/me', routes.users.me);

/**SCENES**/
api.get('/:gameID/scenes', routes.scenes.list);
api.get('/:gameID/scenes/:name', routes.scenes.getByName);
api.get('/:gameID/scenes/home', routes.scenes.getHomeScene);
api.get('/:gameID/scenes/:name/neighbours', routes.scenes.getNeighboursByName);
api.post('/:gameID/scenes/addScene', loginRequired, routes.scenes.addScene);
api.delete('/:gameID/scenes/:name', loginRequired, routes.scenes.deleteScene);

/**TAGS**/
api.get('/:gameID/tags', routes.tags.list);

/**INTERACTIVE OBJECTS**/
api.put('/:gameID/scenes/:name/transitions', loginRequired, routes.interactiveObjects.putTransition);

/**MEDIA**/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/" + req.params.gameID + "/")
    },
    filename: function (req, file, cb) {
        cb(null, req.headers.name)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        fs.access("public/" + req.params.gameID + "/" + req.headers.name, (err) => {
            if (!err)
                cb(null, false);
            else
                cb(null, true);
        });
    }
});
api.post('/public/:gameID/addMedia', loginRequired, upload.single("upfile"), routes.media.addMedia);

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