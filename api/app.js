var express = require('express')
    , path = require('path')
    , routes = require('./routes')
    , nconf = require('./config')
    , swaggerJSDoc = require('swagger-jsdoc')
    , methodOverride = require('method-override')
    , errorHandler = require('errorhandler')
    , bodyParser = require('body-parser')
    , setAuthUser = require('./middlewares/setAuthUser')
    , neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup')
    , writeError = require('./helpers/response').writeError;

var app = express()
    , api = express();

app.use(nconf.get('api_path'), api);

var swaggerDefinition = {
    info: {
        title: 'Neo4j API for PACPAC (Node/Express)',
        version: '1.0.0',
        description: '',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
api.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/docs', express.static(path.join(__dirname, 'swaggerui')));
app.set('port', nconf.get('PORT'));

api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
var customHeaders = "name"; //headers we use for our api
api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, " + customHeaders);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

//api custom middlewares:
api.use(setAuthUser);
api.use(neo4jSessionCleanup);

//api routes
api.post('/register', routes.users.register);
api.post('/login', routes.users.login);
api.get('/users/me', routes.users.me);
api.get('/scenes', routes.scenes.list);
api.get('/scenes/getByName', routes.scenes.getByName);
api.get('/scenes/home', routes.scenes.getHomeScene);
api.get('/scenes/getNeighboursByName', routes.scenes.getNeighboursByName);
api.post('/scenes/addScene', routes.scenes.addScene);

//api error handler
api.use(function(err, req, res, next) {
    if(err && err.status) {
        writeError(res, err);
    }
    else next(err);
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port') );
});