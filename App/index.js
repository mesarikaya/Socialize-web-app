'use strict';

var FormHandler = require(process.cwd() + '/Controllers/formHandler.js');


module.exports = function(app, passport, asyncr) {
    
    // Introduce the backend form handler javascripts
    var formHandler = new FormHandler();
    
    // Create authentication check via using passport.js    
    function ensureAuthenticated(req, res, next) {
      console.log("Authentications result is:", req.isAuthenticated());
      if (req.isAuthenticated()){
          // If authentrication is successfull, do the next action
          console.log("USer is authenticated");
          return next();
      }
      else{
          //Warn the user about logged out status, and redirect to cover page
          res.redirect('/flash');
      }
    }
    
    // Create safety for attempts to reach the /user interface without authentication
    app.get('/flash', function(req, res){
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash('info','Logged out or Unauthorized Log In Attempt. Please log in!');
        res.redirect('/');
    });
    
    //CREATE AUTHENTICATIONS FOR Google, Facebook, LinkedIn, Twitter and Github
    // Google Authenticate
    app.route('/auth/google')
        .get(passport.authenticate('google',
            {scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
            ]}
         ));
    
    //Google callback call
    app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
            res.redirect('/user');
    });
          
    //Facebook Authenticate   
    app.route('/auth/facebook')
            .get(passport.authenticate('facebook',
                {}
            ));
    
    //Facebook callback call
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/' }),
      function(req, res) {
           res.redirect('/user')
    });
    
    //Twitter Authenticate   
    app.route('/auth/twitter')
            .get(passport.authenticate('twitter',
                {}
            ));
    
    //Twitter callback call
    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/' }),
      function(req, res) {
            res.redirect('/user')
    });
    
    //Linkedin Authenticate   
    app.route('/auth/linkedin')
            .get(passport.authenticate('linkedin',
                {}
            ));
    
    //Linkedin callback call
    app.get('/auth/linkedin/callback',
      passport.authenticate('linkedin', { failureRedirect: '/' }),
      function(req, res) {
            res.redirect('/user')
    });
    
    //Github Authenticate   
    app.route('/auth/github')
            .get(passport.authenticate('github',
                {}
            ));
    
    //Github callback call
    app.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/' }),
      function(req, res) {
            res.redirect('/user')
    });
    
    //After logout go back to opening page
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
            		res.redirect('/guest')
		});
    
    //Direct to home page
    app.route('/')
            .get(function(req,res){
                res.render(process.cwd()+'/Public/views/cover.ejs', {messages: req.flash('info') });
            });
    
    // Control the user data for searched locations and likes
    app.route('/user/show')
            .post(ensureAuthenticated, function(req,res){
                console.log("Reached the post place");
                // Check if post is called via Like button or page refresh
                if (typeof(req.body.loc_data) !== 'undefined'){//save the location likes/dislikes
		            console.log("save Likes/dislikes");
                    formHandler.update_likes(req, res);
                } 
                if (typeof(req.body.data) !== 'undefined'){//page refresh
                    if(typeof(req.user) === "undefined"){
                        console.log("User is not recognized!. No past record search is made.");
                    }
                    else{//Save the new location search
                        console.log("Save the new location search");
			            formHandler.record_search(req,res); 
                    }
                }
                
                // Redirect to "/user" router
                console.log("direct to user page");
	    	res.redirect('/user')
            });
            
    // Route for "/user"        
    app.route('/user')
         .get(ensureAuthenticated,function(req,res){
                if(typeof(req.user) === "undefined"){
                    //console.log("User is not recognized!. No page update request is made.");
                    return res.redirect('/flash');
                }
                else{
                    //User is logged in and recognized, then update the page with the latest search results
                    formHandler.update_page(req, res, asyncr);
                }
         });
    
    // Direct the "/guest" request to relevant html
    app.route('/guest')
            .post(function(req,res){
                res.sendFile(process.cwd() + '/Public/views/guest.html');
            })
            .get(function(req,res){
                res.sendFile(process.cwd() + '/Public/views/guest.html');
            });
    
    
     app.route('/guest/search')
            .post(function(req,res){
                res.sendFile(process.cwd() + '/Public/views/guest.html');
            })
            .get(function(req,res){

                res.sendFile(process.cwd() + '/Public/views/guest.html');
            });

};
