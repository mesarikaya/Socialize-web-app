'use strict';

var Users = require('../Model/user.js');

function track_attendance(db) {
    
    //Function to update the visited location like and dislikes
    this.update_likes = function(req,res){
             

         Users
            .findOne({'login_details.oauthID': req.user.login_details.oauthID}).sort({'login_details.created': -1})
            .exec(function (err, result) {
                    if (err) { throw err; }
                    

                   // ADD to LIKES
                    if (req.body.action === "insert"){
                           result.place_data.liked_places.push(req.body.loc_data);
                           //console.log("inserted", req.user);
                           result.markModified('place_data.liked_places');
                           result.save(function (err, doc) {
                               if (err) { throw err; }
                                   //console.log("Update is successful. Saved document: ", doc);
                               });
                       }
                    else{
                       //DELETE from LIKES
                       if (req.body.action === "delete"){
                           //console.log("BEFORE deleted", result);
                           var index = result.place_data.liked_places.indexOf(req.body.loc_data);
                           if (index !== -1){
                                result.place_data.liked_places.splice(index, 1)[0];
                                result.markModified('place_data.liked_places');
                           }

                           //console.log("deleted", req.user);
                           
                           result.save(function (err, doc) {
                               if (err) { throw err; }
                               //console.log("Update is successful. Saved document: ", doc);
                           });
                       }
                       else{
                           //console.log("Item could not be deleted!");
                       }
                    }
                    

                });
             
             
    };
    
    // Function to record the location searches of the user
    this.record_search = function(req,res){
         var data = req.body.data;
         
         if(typeof(req.user) === "undefined"){
             console.log("User is not recognized!");
         }
         else{
            // Authenticated user exists, save the serach if it is found in the database
            Users
                .findOne({'login_details.oauthID': req.user.login_details.oauthID}).sort({'login_details.created': -1})
                .exec(function (err, result) {
                        if (err) { throw err; }
                        if (result) {
                            result.past_searches.results.push(data);
                            //console.log("inserting. result", result);
                            result.markModified('past_searches.results');
                            result.save(function (err, doc) {
                                if (err) { throw err; }
                                //console.log("Insert is successful. Saved document: ", doc);
                            });
        
                        }
                        else{
                            return res.send({"Error": "No records could be found."});
                        }
                    }
                );
         }

             
     };
     
     
    
    
    // Update the logged in user page
    this.update_page = function (req, res, asyncr){
         
        //Asyncr.js is used due to using multiple Asyncronous calls that depend on each other
        function call1(req, res){
            //Get the last doc of the user
            Users
              .find({'login_details.oauthID': req.user.login_details.oauthID}).sort({'login_details.created': -1})
              .exec(function (err, doc) {
                        if (err) { throw err; }
        
                        if (doc ) {
                             //console.log("Last search of user is sent: ", doc, doc[doc.length-1].login_details.name, doc[doc.length-1].past_searches.results[0]);
                             //Send out to the front-end and render the page
                             
                             //console.log("Documents are shared:");
                             return doc;
                        }
                        else{
                            //console.log("No data to be sent");
                            return [];
                        }
              }).then(doc => {
                       // For all the locations that user search involves, calculate the like counts via checking all user's likes
                       var counts = [];
                       var data = [doc, doc[0].past_searches.results[doc[0].past_searches.results.length-1]];
                       asyncr.mapSeries(data[1],function(item, callback) {
                           //console.log("Item is:", item);
                           Users
                               .find({"place_data.liked_places": { $in: ["location-" + item.unique_key] } })
                               .exec(function (err, documents) {
                                   if (err) { throw err; }
                                   counts.push(documents.length);
                                   //share the counts array for the LIKES
                                   callback(null, counts[counts.length-1]);

                                   
                               });
                        
                       },function(err, results) {
                                   if (err) throw err;
                                   //CALL the last async function to update the page with the user data that inclues the location related data and the relevant likes
                                   call2(req, res, results);
                        });
               }).catch(error => {
                           // Handle errors of asyncFunc1() and asyncFunc2()
                           console.log('An error occurred', error);
                 });
        }
        
        //Function to update the page with the user data that inclues the location related data and the relevant likes
        function call2(req, res, like_counts){
              Users
              .find({'login_details.oauthID': req.user.login_details.oauthID}).sort({'login_details.created': -1})
              .exec(function (err, doc) {
                    if (err) { throw err; }
                    if (doc !== []) {
                          return res.render(process.cwd()+'/Public/views/user.ejs', {user : {
                                                                                              name: req.user.login_details.name, 
                                                                                              data: doc[0].past_searches.results[doc[0].past_searches.results.length-1],
                                                                                              likes: like_counts,
                                                                                              liked_places: doc[0].place_data.liked_places
                                                                                            }
                                                                                      
                                                                                     });
                      }
                      else{
                            //console.log("No data to be sent");
                            return res.render(process.cwd()+'/Public/views/user.ejs',  {user : {name:req.user.login_details.name, data: ""}});
                     }
              });
        }

        //Call the "call 1" function to start serialized the asyncronous calls
        call1(req, res);
    };
}
    

module.exports = track_attendance;