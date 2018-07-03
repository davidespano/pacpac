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
    , writeError = require('./helpers/response').writeError
    , multer = require('multer')
    , fs = require('fs');

var app = express()
    , api = express();

app.use(nconf.get('api_path'), api);

var swaggerDefinition = {
    info: {
        title: 'Neo4j API for PACPAC (Node/Express)',
        version: '2.0.0',
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
app.use(function(req, res, next) {
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

//api routes
api.post('/register', routes.users.register);
api.post('/login', routes.users.login);
api.get('/users/me', routes.users.me);
api.get('/scenes', routes.scenes.list);
api.get('/scenes/:name', routes.scenes.getByName);
api.get('/scenes/home', routes.scenes.getHomeScene);
api.get('/scenes/:name/neighbours', routes.scenes.getNeighboursByName);
api.post('/scenes/addScene', routes.scenes.addScene);

var storage = multer.diskStorage({
    destination: "public/",
    filename: function (req, file, cb) {
        cb(null, req.headers.name)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        fs.access("public/"+req.headers.name, (err)=>
        {
            if (!err)
                cb(null,false);
            else
                cb(null,true);
        });
    }
})
api.post('/public/addMedia', upload.single("upfile"),routes.media.addMedia);

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