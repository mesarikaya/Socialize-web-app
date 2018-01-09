'use strict';

// Create a function that is enclosed and can trigger ajax function and on Ready fucnction
(function initiate() {
   // Introduce Page Items
   var searchButton = document.querySelector('#Search-Button');
   var searchForm = document.querySelector('#SearchInputForm');
   var location = document.querySelector('#location');
   var geoLoc = document.querySelector('#suggested_location');
   var apiUrl = 'https://socialsearch-app.herokuapp.com';
   var Cards = document.querySelector("#Cards");
   var attendButton = document.querySelector('.attend');
   var cancelButton = document.querySelector('.cancel');   
   //document.addEventListener('DOMContentLoaded', initMap, false);
   
   // Function that enables and initiates Google places API
   function initMap(){
          var approximateLocation = new google.maps.places.Autocomplete(location, {types: ['geocode']});
         
          google.maps.event.addListener(location, 'keydown', function(e) { 
              if (e.keyCode == 13 && $('.pac-container:visible').length) { 
                  e.preventDefault();
                  e.stopPropagation(); 
              }
          });
          
          google.maps.event.addListener(approximateLocation, 'place_changed', function(place){
                 
            			var place = approximateLocation.getPlace();
            			$('#suggested_location').text(place.geometry.location);
            			
            			if(!place.geometry){
            			    window.alert("No details available for input: '" + place.name + "'");
            			}
            			else{
            			    console.log("Change is catched.", place.geometry.location);
            			}
            			
           });

    }
    
    // CALLL FourSquare API via AJAX
    function submitLocation(){
       
            var searchOption = $('#SearchInputForm').serializeArray();
            searchOption = searchOption[0].value
            if(searchOption === "Select Event Type"){
              searchOption = "Top Picks";
            }
            
            
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
                    
                    var xmlhttp2 = new XMLHttpRequest();
                    
                    xmlhttp2.onreadystatechange = function () {
                       
                       if (xmlhttp2.readyState == 4 ) {
                          console.log(xmlhttp2.status);
                          if (xmlhttp2.status == 200) {
                             var result =  JSON.parse(xmlhttp2.responseText);
                             result = result.response.groups["0"].items;
                             
                             var keys = [];
                             for(var k in result) keys.push(k);
                             //console.log("keys are: ", keys, result);
                             var Cards_text = "";
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
                                          
                                          if (typeof(EventURL) === 'undefined'){
                                            EventURL = "Not Applicable";
                                          }
                                          var address = "Address: " + data.venue.location.address + ", " + data.venue.location.postalCode + " " + data.venue.location.city + ", " + data.venue.location.country;
                                          Cards_text += '<div class="row-fluid d-flex justify-content-center"><div class="card "><div class="card-block">'+
                                                           '<img class="card-img img-fluid float-left" id="Event-img-content"'+
                                                           ' src='+ '"'+ photo_url + '"' + ' alt="Card image cap">' +
                                                            '<h4 class="card-title">'+EventTitle+'</h4>'+
                                                           '<p class="card-text">' + 'This is a ' + EventDetails + '.</p' +
                                                           '<br></br>' +
                                                           '<p class="card-text">'+ address + '</p>' + '<p class="card-text"> website: <a href="' + EventURL + '">'+ EventURL + "</a></p></div>"+
                                                           '<div class="card-footer"> </div> </div> </div>';
                                          
                                 }
                               }
                             
                             //console.log("response from fourSquare: ", keys, Cards_text);
                             document.getElementById("Cards").innerHTML = Cards_text;
                             //data =  xmlhttp2.responseText;
                          }
                       }
                       else {
                         //console.log('something else other than 200 was returned', xmlhttp2.status);
                       }
                    };
            
                  xmlhttp2.open('GET', fourSquareURL, true);
                  xmlhttp2.send(); 
            }
            catch(err){
                  console.log("The call could not be done due to the error:", err);
            }
    }
    
    // Activate the google api in the page initiation
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl,initMap));
   
    // Search Button activates calls FourSquare ajax call
    searchButton.addEventListener('click', function () {
       submitLocation();
    }, false);
  
})();
