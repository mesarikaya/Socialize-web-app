'use strict';

// Create a function that is enclosed and can trigger ajax function and on Ready fucnction
(function (data) {
   // introduce the page items 
   var searchButton = document.querySelector('#Search-Button');
   var searchForm = document.querySelector('#SearchInputForm');
   var location = document.querySelector('#location');
   var geoLoc = document.querySelector('#suggested_location');
   var apiUrl = 'https://social-life-app-mesarikaya.c9users.io';
   var Cards = document.querySelector("#Cards");
   var attendButton = document.querySelector('.attend');
   var cancelButton = document.querySelector('.cancel');   
   var user= document.querySelector('#username');
   //document.addEventListener('DOMContentLoaded', initMap, false);
   
   // Function that enables and initiates Google places API
   function initMap(initData){
          
          var approximateLocation = new google.maps.places.Autocomplete(location, {types: ['geocode']});
          google.maps.event.addListener(location, 'keydown', function(e) { 
              if (e.keyCode == 13 && $('.pac-container:visible').length) { 
                  e.preventDefault();
                  e.stopPropagation(); 
              }
          });
          
          google.maps.event.addListener(approximateLocation, 'place_changed', 
          function(place){
                
             			var place = approximateLocation.getPlace();
             			$('#suggested_location').text(place.geometry.location);
             			
             			if(!place.geometry){
             			    window.alert("No details available for input: '" + place.name + "'");
             			}
             			else{
             			    //console.log("Change is catched.", place.geometry.location);
             			}
             			
             			//var coordinates=[coordinate1, coordinate2];
             			//return coordinates;
          });
          //console.log("INSIDE AND DATA IS: ", data);
    }
   
    // CALLL YELP API via AJAX
    function submitLocation(){
             
            var searchOption = $('#SearchInputForm').serializeArray();
            searchOption = searchOption[0].value
            if(searchOption === "Select Event Type"){
              searchOption = "Top Picks";
            }
            // Get geo-locations from google API and use them to call FourSquare api tp retrieve the list
            try{ 
                var val = 	$('#suggested_location').html();
                val = val.split(", ");
                
                var latitude = val[0].split("(")[1];
                var longitude = val[1].split(")")[0];
                
                //console.log("AJAX Success. ", val);
                var client_id = "YPS0T5EHVPOVNJDLH3D0KHIUOHA0QQBEQU2XRHXF5JMGH0TZ";
                var client_secret = "MAKOU1DN1R2UWUFQA4GOBAG5HOY5R11YNO1Q1PKOSHBQG2P4";
                //console.log(coordinate1, coordinate2);
                var baseURL = 'https://api.foursquare.com/v2/venues/explore?v=20161016&ll=';
                var fourSquareURL = baseURL + latitude.toString() + ",%" + "20" + longitude.toString()  +"&" + "section=" + searchOption.toString() +"&"+"venuePhotos=1"+"&"+"client_id="+client_id.toString()+"&client_secret="+client_secret.toString();
                var Cards_text = "";
                var xmlhttp2 = new XMLHttpRequest();
                var search_result =  '["data":{}}';
                xmlhttp2.onreadystatechange = function () {
                   // IF successfull, send the api list to the page via post and then later get call
                   if (xmlhttp2.readyState == 4 ) {
                      //console.log(xmlhttp2.status);
                      if (xmlhttp2.status == 200) {
                         var result =  JSON.parse(xmlhttp2.responseText);
                         result = result.response.groups["0"].items;
                         
                         var keys = [];
                         for(var k in result) keys.push(k);
                         //console.log("keys are: ", keys, result);
                         var count = 0;
                         for (var item in result) {
                           var data = result[item];
                           //console.log("item: ", item);
                           if(typeof(data.venue.featuredPhotos) !== 'undefined'){
                                      var photo_prefix = data.venue.featuredPhotos.items["0"].prefix;
                                      photo_prefix = photo_prefix.replace("\/","/");
                                      var photo_suffix = data.venue.featuredPhotos.items["0"].suffix;
                                      photo_suffix = photo_suffix.replace("\/","/");
                                      var photo_url = photo_prefix.toString() + "200x200" + photo_suffix;
                                      var EventTitle = data.venue.name;
                                      //var EventSummary = data.reasons.items["0"].summary;
                                      var EventDetails = data.venue.categories["0"].name;
                                      var EventURL = data.venue.url;
                                      var uniquekey = latitude + longitude + "-" + EventTitle;
                                      var post_code = data.venue.location.postalCode;
                                      var city = data.venue.location.city;
                                      var country = data.venue.location.country;
                                      var address_ = data.venue.location.address;
                                      
                                      if (typeof(EventURL) === 'undefined'){
                                        EventURL = "Not Applicable";
                                      }
                                      if (typeof(address_) === 'undefined'){
                                        address_ = "";
                                      }
                                      
                                      if (typeof(post_code) === 'undefined'){
                                        post_code = "";
                                      }
                                      
                                      if (typeof(city) === 'undefined'){
                                        city = "";
                                      }   
                                      
                                      if (typeof(country) === 'undefined'){
                                        country = "";
                                      }
                                      
                                      var address = "Address: " + address_ + ", " + post_code + " " + city + ", " + country;
                                    
                                      var last_str = ",";
                                      var start_str = '{"data":{';
                                      if (count === 0) {
                                         search_result = '';
                                      }
                                      
                                      if (count === result.length - 1) {
                                         last_str = "}}";
                                      }
                                      if (count !== 0) {
                                          start_str = "";
                                      }
                                      var new_data = start_str + '"' + count + '":' + '{"address":' + '"' + address + '",' +
                                      '"post_code":' + '"' +  post_code + '",' +
                                      '"city":' + '"' + city + '",' + '"country":' + '"' + country + '",' +
                                      '"photo":' + '"' + photo_url + '",' + '"Title":' + '"' + EventTitle + '",' + '"Event_Detail":' + '"' + EventDetails + '",' +
                                      '"event_url":' + '"' + EventURL + '",' +  '"unique_key":' + '"' + uniquekey.toString() + '"}' + last_str;
                                      search_result = search_result + new_data;
                                      count = count + 1;
                                      
                                   }
                                 }
                               
                           //Make a post call to save the search, after this post call the page is called with a get call and with the latest search result
                           ajaxFunctions.ajaxPostRequest('POST', apiUrl + "/user/show", search_result);
                           
                           
                        }
                     }
                     else {
                       //console.log('something else other than 200 was returned', xmlhttp2.status);
                     }
                    // window.history.pushState("object or string", "Title", "/guest/search");
                   };
                   // "Access-Control-Allow-Origin" "*");
                   //{ 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' })
                   
                   xmlhttp2.open('GET', fourSquareURL, true);
                   //xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                   xmlhttp2.send();
                   }
            catch(err){
                   console.log("The call could not be done due to the error:", err);
            }
    }
    
    // Register  the likes/dislieks
    function register_attendance(element, form, action){
        //post_data shares the unique location, and relevant action(like/dislike) that needs to be recorded
        var post_data = '{"loc_data":' +  '"location-' + element + '",' + '"action":' + '"' + action + '"' +'}';
        var xmlhttp2 = new XMLHttpRequest();
        //console.log("Location is: ", post_data);
        xmlhttp2.onreadystatechange = function () {
               
               if (xmlhttp2.readyState == 4 ) {
                   //console.log("Status:", xmlhttp2.status);
                   if (xmlhttp2.status == 200) {
                      var result =  xmlhttp2.responseText;
                      //console.log("Ajax call is successful.");
                      //console.log("Calling user/show page", result);
                      //window.location.href = "/user";
                      //console.log("Response is: ", result);
                   }
               }
               else {
                  //console.log('something else other than 200 was returned', xmlhttp2.status);
               }
               // window.history.pushState("object or string", "Title", "/guest/search");
        };

        xmlhttp2.open('POST', apiUrl + '/user/show', true);
        //xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp2.setRequestHeader("Content-type", "application/json");
        xmlhttp2.send(post_data);
        
    }
    
    // CARDs div will be examined to see if the user pressed Like or Dislike
    Cards.addEventListener("click",function(e) {
      var form = document.getElementById(e.target.id);
      
      //Retrieve the current likes count
      var like_count =  document.getElementsByClassName("Report-likes-" + e.target.parentElement.id);

      if (e.target && e.target.matches(".attend")) { // Check if the like button is clicked and adjust the likes count
        //console.log("Attend element clicked!");
        //console.log(e);
        var attend_id = e.target.id;
        var cancel_id = attend_id.split("-")[1];
        var cancel_element = document.getElementById("cancel-" + cancel_id);
        var attend_element = document.getElementById(attend_id);
        e.target.classList.add("disabled");
        // Call the function that activates ajax call that records likes/dislikes
        register_attendance(e.target.parentElement.id, form, "insert");

        try {
            like_count[0].innerHTML = parseInt(like_count[0].firstChild.textContent.split(" ")[0],10) + 1 + " likes";
        }
        catch(err) {
            //console.log("Do nothing");
        }
        cancel_element.classList.remove("disabled");
      }
      else if (e.target && e.target.matches(".cancel")) { // check if Dislike button is clicked and adjust the likes count. O.W. do nothing
        e.target.classList.add("disabled");
        var cancel_id = e.target.id;
        var attend_id = cancel_id.split("-")[1];
        var cancel_element = document.getElementById(cancel_id);
        var attend_element = document.getElementById("attend-" + attend_id);

        // Call the function that activates ajax call that records likes/dislikes
        register_attendance(e.target.parentElement.id, form, "delete");

        try {
            like_count[0].innerHTML = parseInt(like_count[0].firstChild.textContent.split(" ")[0],10) - 1 + " likes";
        }
        catch(err) {
            //console.log("Do nothing");
        }
        
        attend_element.classList.remove("disabled");
      }
    }, false);  
  
    // Activate the google api in the page initiation
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl,initMap));
    
    // Search Button activates calls FourSquare ajax call
    searchButton.addEventListener('click', function () {
       submitLocation();
    }, false);
  
})();