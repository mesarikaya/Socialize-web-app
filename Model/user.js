'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
   login_details:{
        oauthID: {},
        name: String,
        created: Date
   },
   place_data:{ 
        liked_places: Array
   },
   past_searches:{
      results: Array
   }
});

module.exports = mongoose.model('User', User);
