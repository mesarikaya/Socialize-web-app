'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
//var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../Model/user');
var configAuth = require('./oauth');

module.exports = function (passport) {
    //console.log("Client Id is: ", configAuth.googleAuth);
    // config
    passport.serializeUser(function(user, done) {
      console.log('serializeUser: ' + user.id);
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user){
          console.log("Deserializing the user:", user);
          if(!err) done(null, user);
          else done(err, null);
        });
    });
    
    
    //Google oAuth
    passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
            console.log("Profile is:", profile);
        	process.nextTick(function () {
            User.findOne({ 'login_details.oauthID': profile.id }, function(err, user) {
      				if (err) {
      					return done(err);
      				}
      
      				if (user) {
      				  console.log("User exists!!!!");
      					return done(null, user);
      				} 
      				else {
      				  console.log("New user created!!!!");
      					var newUser = new User();
      					//console.log("Profile is:", profile);
                //Initiate the user details
      					newUser.login_details.oauthID = profile.id;
      					newUser.login_details.name = profile.displayName;
      					newUser.login_details.created = Date.now();
      					newUser.place_data = {'liked_places': []};
      					newUser.past_searches = {'results': []};
                //Save the user into the database
      					newUser.save(function (err) {
      						if (err) {
      							throw err;
      						}
      						return done(null, newUser);
      					});
      				}
           });
        });
      }
    ));
    
    
    // Facebook oAuth
    passport.use(new  FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
          		process.nextTick(function () {
                  User.findOne({ 'login_details.oauthID': profile.id }, function(err, user) {
            				if (err) {
            				  console.log("profile id is: ", profile.id);
            					return done(err);
            				}
            
        				if (user) {
        				  console.log("User exists!!!!");
        					return done(null, user);
        				} 
        				else {
        				  console.log("New user created!!!!");
         					var newUser = new User();
            					//console.log("Profile is:", profile);
                      //Initiate the user details
                      newUser.login_details.oauthID = profile.id;
            					newUser.login_details.name = profile.displayName;
            					newUser.login_details.created = Date.now();
            					newUser.place_data = {'liked_places': []};
            					newUser.past_searches = {'results': []};
                      
                      //Save the user into the database
            					newUser.save(function (err) {
            						if (err) {
            							throw err;
            						}
            						return done(null, newUser);
            					});
            				}
                });
      		});
        }
      ));
      
    // Twitter oAuth
    passport.use(new  TwitterStrategy({
        consumerKey: configAuth.twitterAuth.clientID,
        consumerSecret: configAuth.twitterAuth.clientSecret,
        callbackURL: configAuth.twitterAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
          		process.nextTick(function () {
                  User.findOne({ 'login_details.oauthID': profile.id }, function(err, user) {
            				if (err) {
            				  //console.log("profile id is: ", profile.id);
            					return done(err);
            				}
            
          				if (user) {
          				  console.log("User exists!!!!");
          					return done(null, user);
          				} 
          				else {
          				  console.log("New user created!!!!");
             					var newUser = new User();
            					//console.log("Profile is:", profile.id, profile.displayName);
                      //Initiate the user details
                      newUser.login_details.oauthID = profile.id;
            					newUser.login_details.name = profile.displayName;
            					newUser.login_details.created = Date.now();
            					newUser.place_data = {'liked_places': []};

                      //Save the user into the database
            					newUser.save(function (err) {
            						if (err) {
            							throw err;
            						}
            						return done(null, newUser);
            					});
            				}
                });
      		});
        }
      ));
    
    
    // Linkedin oAuth
    passport.use(new  LinkedinStrategy({
        clientID: configAuth.linkedinAuth.clientID,
        clientSecret: configAuth.linkedinAuth.clientSecret,
        callbackURL: configAuth.linkedinAuth.callbackURL,
        scope: ['r_emailaddress', 'r_basicprofile'],
        state: true
        },
        function(accessToken, refreshToken, profile, done) {
          		process.nextTick(function () {
                  User.findOne({ 'login_details.oauthID': profile.id }, function(err, user) {
            				if (err) {
            				  //console.log("profile id is: ", profile.id);
            					return done(err);
            				}
            
          				if (user) {
          				  console.log("User exists!!!!");
          					return done(null, user);
          				} 
          				else {
          				  console.log("New user created!!!!");
  
            					var newUser = new User();
            					//console.log("Profile is:", profile.id, profile.displayName);
                      //Initiate the user details
            					newUser.login_details.oauthID = profile.id;
            					newUser.login_details.name = profile.displayName;
            					newUser.login_details.created = Date.now();
            					newUser.place_data = {'liked_places': []};
                      
                      //Save the user into the database
            					newUser.save(function (err) {
            						if (err) {
            							throw err;
            						}
            						return done(null, newUser);
            					});
            				}
                });
      		});
        }
      ));
        
    
    // Github oAuth
    passport.use(new  GitHubStrategy({
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
          		process.nextTick(function () {
                  User.findOne({ 'login_details.oauthID': profile.id }, function(err, user) {
            				if (err) {
            				  //console.log("profile id is: ", profile.id);
            					return done(err);
            				}
            
          				if (user) {
          				   console.log("User exists!!!!");
          					 return done(null, user);
          				} 
          				else {
          				    console.log("New user created!!!!");
      
            					var newUser = new User();
            					//console.log("Profile is:", profile.id, profile.displayName);
                      //Initiate the user details
            					newUser.login_details.oauthID = profile.id;
            					newUser.login_details.name = profile.displayName;
            					newUser.login_details.created = Date.now();
            					newUser.place_data = {'liked_places': []};
                      
                      //Save the user into the database
            					newUser.save(function (err) {
            						if (err) {
            							throw err;
            						}
            						return done(null, newUser);
            					});
            				}
                });
      		});
        }
      ));
    
};
    
    

