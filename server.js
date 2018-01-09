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

//Introduce packages for oAuth
var passport = require('passport');

var app = express();
require('dotenv').load();
require('./config/passport')(passport);

// Connection URL
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/socialize-app';

//Connect to the database
mongoose.connect(url);
mongoose.Promise = global.Promise;

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

app.use(session({
	secret: process.env.session_secret,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//call the app
routes(app, passport, asyncr);
    
var port = process.env.PORT || 8000;

app.listen(port, function() {
        console.log('Node.js listening on port ' + port);
});

