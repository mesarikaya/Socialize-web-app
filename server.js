'use strict';

var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
//var mongo = require('mongodb');
var routes = require('./App/index.js');
var bodyParser = require('body-parser');
var ejs = require("ejs");
var asyncr = require('async');
var MongoDBStore = require('connect-mongodb-session')(session);
var cors = require('cors');

//Introduce packages for oAuth
var passport = require('passport');

var app = express();
require('dotenv').load();
require('./config/passport')(passport);

// Connection URL
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/socialize-app';


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(url, options );
mongoose.Promise = global.Promise;

var store = new MongoDBStore(
    {
        uri: url,
    });

// Enable CORS
app.use(cors());

// Configure
app.use(express.static(process.cwd() + "/Controllers"));
app.use(express.static(process.cwd() + "/Public"));
app.use(express.static(process.cwd() + "/Public/styles"));
app.set('views', __dirname + '/Public/views');
app.engine('html', ejs.renderFile); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('keyboard cat'));
app.use(flash());

//app.use(app.router);
//app.use(express.static(__dirname + '/public'));

var sessionMiddleware = session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: new Date(Date.now() + 3600000), secure: 'auto' },
    store: store
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//call the app
routes(app, passport, asyncr);
    
var port = process.env.PORT || 8000;

app.listen(port, function() {
        console.log('Node.js listening on port ' + port);
});

