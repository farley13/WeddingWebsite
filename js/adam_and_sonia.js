
var wedding = (function () {
    
 

  var failing = function() {
    return 'You failed';
  };


    // Sticky nav header pulled from https://stackoverflow.com/questions/2907367/have-a-div-cling-to-top-of-screen-if-scrolled-down-past-it
    // Cache selectors outside callback for performance. 

   var setup_sticky_nav = function() {
        var scroll_offset = 40; // we've got some padding etc - make it not jump so much
        var last_hash = "" // avoid spamming the hash when we have to resync it (since detatching the sitcky nav interupts showing a given anchor)
	var $window = $(window),
	$stickyEl = $('#nav-bar-sticky'),
	elTop = $stickyEl.offset().top + scroll_offset;

	$window.scroll(function() {
	    toggle_sticky_based_on_scroll($window, $stickyEl, elTop, last_hash);
	});
       // fire immediately as well
       toggle_sticky_based_on_scroll($window, $stickyEl, elTop, last_hash);
    }

    var toggle_sticky_based_on_scroll = function($window, $stickyEl, elTop, last_hash) {
	if ($window.scrollTop() > elTop && !modalOpen) {
	    if (! $stickyEl.hasClass('sticky')) {
		$stickyEl.addClass('sticky')
		// Reset the hash since we interrupted scrolling
                var hash = window.location.hash;
		if (hash != last_hash && hash != '#') {
		    window.location.hash = "";
		    window.location.hash = hash;
		    last_hash = hash;
		}
	    }
		
	} else {
	    if ( $stickyEl.hasClass('sticky')) {
		$stickyEl.removeClass('sticky')
		window.history.replaceState({}, "", "#");
		last_hash = "";
	    }
	}	
    }

    var work_around_broken_hashtags = function() {
       var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (window.location.hash && isChrome) {
            setTimeout(function () {
                var hash = window.location.hash;
                window.location.hash = "";
                window.location.hash = hash;
            }, 100);
        }
   }

   var launch_photo_gallery = function() {
       
       
   }

   var bind_swiping = function() {

       $("#myModal").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	    if (direction === "left") {
		plusSlides(1);		
	    }
	    else if (direction === "right") {
		plusSlides(-1);	    
	    }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
           threshold:50
      });
   }

   var search_for_rsvp = function() {

       var firstName=$("#firstName")[0].value; 
       var firstNameEscaped = encodeURIComponent(firstName).trim();

       var lastName=$("#lastName")[0].value; 
       var lastNameEscaped = encodeURIComponent(lastName).trim();

       if (firstName === "" || lastName === "")
       {
	   $("#search_message").html("Error: Please fill out first and last name before searching.");
	   return;
       }

       $("#search_message").html("Searching for RSVP...")
       $("#weddingPartyArea").html("");
       $("#inputEmailAddress").val("");
       $("#inputMessage").val("");
       $("#emailAndMessage").attr("style", "display:none");

       var url = "https://script.google.com/macros/s/AKfycbxwLF8OBywjaWGZ59qENIVM4QY4wvcVQojQBBQ4YiQIxwi8N4E/exec";
       var data =  { parameter: { isRSVPQuery: true, firstName: firstName, lastName: lastName } };
       var helpemail = "farley" ;
       helpemail += 13;
       helpemail = helpemail + "@gmail.com";
       var errorMessage = "Something didn't quite work on our end. Please reach out for help to Adam and Sonia at " + helpemail + " to resolve any issues!";
       var noReservationMessage = "We unfortunately were unable to find an RSVP for " + firstName + " " + lastName + ". Please reach out for help to Adam and Sonia at " + helpemail + " to resolve any issues!";

       ajaxPost(url, JSON.stringify(data), 
		function(response) {

	   $("#weddingPartyArea").html(""); // make sure if we finish multiple times, only one is present on page

           if (!response.rows || !response.rows.length > 0) {
	       $("#search_message").html(noReservationMessage);
	       return;
	   }

	   var message = "Your wedding party is provided below: ";

	   for (i in response.rows) {
	       row = response.rows[i];

	       var templateClone;
	       if (row.invitedFriday == "1" && row.invitedSaturday == "1") {
		   templateClone = $("#bothDaysTemplate").clone();
	       } else if (row.invitedSaturday == "1") {
		   templateClone = $("#saturdayOnlyTemplate").clone();
	       } else {
		   templateClone = $("#fridayOnlyTemplate").clone();
	       }
	       $(templateClone).attr("id", "guest_" + i);
	       $(templateClone).attr("style", "");

	       if(row.unknownName == "1") {
		   $(templateClone).find("#inputName").attr("readonly", false);
		   $(templateClone).find("#inputName").val("");
	       }
	       else {
		   var name = row.firstName + " " + row.lastName;
		   $(templateClone).find("#inputName").val(name);
	       }
	       $(templateClone).find("#inputHiddenFirstName").val(row.firstName);
	       $(templateClone).find("#inputHiddenLastName").val(row.lastName);

	       $(templateClone).find("#attendeeLabel").html("Attendee " + (Number(i) + 1));

	       if (row.attendingFriday == "0") {
		   $(templateClone).find("#attendingFridayInput").val("I regretfully decline");
	       } else {
		   $(templateClone).find("#attendingFridayInput").val("I am delighted to attend");
	       }

	       if (row.attendingSaturday == "0") {
		   $(templateClone).find("#attendingSaturdayInput").val("I regretfully decline");
	       } else {
		   $(templateClone).find("#attendingSaturdayInput").val("I am delighted to attend");
	       }	       

	       var foodClone;
	       if (row.child == "1") {
		   foodClone = $("#foodOptionsChildTemplate").clone();
	       }
	       else {
		   foodClone = $("#foodOptionsAdultTemplate").clone();
	       }
	       $(foodClone).attr("id", "food_" + i);
	       $(foodClone).attr("style", "");
	       
	       if (row.firstCourse != "") {
		   $(foodClone).find("#inputFirstCourse").val(row.firstCourse);
	       }
	       if (row.mainCourse != "") {
		   $(foodClone).find("#inputMainCourse").val(row.mainCourse);
	       }
	       $(foodClone).find("#inputDietaryRestrictions").val(row.dietaryRestrictions);

	       $(templateClone).find("#foodOptions").append(foodClone);
	       $("#weddingPartyArea").append(templateClone);
	       
	       if (row.email != "") {
		   $("#inputEmailAddress").val(row.email);
	       }
	       if (row.message != "") {
		   $("#inputMessage").val(row.message);
	       }
	       
	   }

	   $("#emailAndMessage").attr("style", "");

	   $("#search_message").html(message);
	   
	   
       },

	function(result) {
	    $("#search_message").html(errorMessage);
	});
   }

   var update_rsvp = function() {

       var email=$("#inputEmailAddress").val(); 

       var firstName=$("#firstName").val(); 

       var lastName=$("#lastName").val(); 

       var message=($("#inputMessage").val() || "" ).substring(0,600); 

       if (email === "" || firstName === "" || lastName === "")
       {
	   $("#submit_message").html("One moment! Please fill out email, first and last name before submitting.");
	   return;
       }

       $("#submit_message").html("Updating...");
       

       var guestRows = []

       for (i = 0; i < 20; i++){
	   var guestSection = $("#guest_" + Number(i));
	   var guestRow = {}
	   if (guestSection.length > 0) {
	       guestRow["additionalGuestName"] = $(guestSection).find("#inputName").val();
	       guestRow["firstName"] = $(guestSection).find("#inputHiddenFirstName").val();
	       guestRow["lastName"] = $(guestSection).find("#inputHiddenLastName").val();
	       guestRow["attendingFriday"] = $(guestSection).find("#attendingFridayInput").val() == "I am delighted to attend" ? 1 : 0;
	       guestRow["attendingSaturday"] = $(guestSection).find("#attendingSaturdayInput").val() == "I am delighted to attend" ? 1 : 0;
	       guestRow["firstCourse"] = $(guestSection).find("#inputFirstCourse").val();
	       guestRow["mainCourse"] = $(guestSection).find("#inputMainCourse").val();
	       guestRow["dietaryRestrictions"] = $(guestSection).find("#inputDietaryRestrictions").val();
	       guestRows.push(guestRow);
	   }
       }

       var serializedData = { 
	   parameter: { isRSVPUpdate: true, 
			message:message, 
			email: email, 
			firstName: firstName, 
			lastName: lastName },
	   guests: guestRows
       };

       // fire off the request to our webapp
       var url = "https://script.google.com/macros/s/AKfycbxwLF8OBywjaWGZ59qENIVM4QY4wvcVQojQBBQ4YiQIxwi8N4E/exec";
       var data = JSON.stringify(serializedData);

       ajaxPost(url, data, 
		function(result) {
		    if (result.result != "success") {
			$("#submit_message").html("Something went wrong, please try again or reach out to Adam and Sonia for help!");
		    }
		    else {
			$("#submit_message").html("Thank you for your RSVP!");
		    }
		},
		function(result) {
		    $("#submit_message").html("Something went wrong, please try again or reach out to Adam and Sonia for help!");
		}
	       );
       

/*       request = $.ajax({
           type: "POST",
	   url: "https://script.google.com/macros/s/AKfycbxwLF8OBywjaWGZ59qENIVM4QY4wvcVQojQBBQ4YiQIxwi8N4E/exec",
	   data: JSON.stringify(serializedData),
	   dataType: 'text',
	   contentType: 'text/plain'
	   
//           data: "name=Adam&comment=None"
       }); 
       
       // Callback handler that will be called on success
       request.done(function (response, textStatus, jqXHR){
           // Log a message to the console
           $("#submit_message").html("Thank you for your RSVP!")
       });

       // Callback handler that will be called on failure
       request.fail(function (jqXHR, textStatus, errorThrown){
           // Log the error to the console
           console.error(
               "The following error occurred: "+
		   textStatus, errorThrown
           );
	   if (errorThrown != ""){
	       $("#submit_message").html("Something didn't quite work this time. Please try again later!")
	   }
	   else { // if no one can tell us what the error was... maybe there wasn't any? Older Ipads have this issue
	       $("#submit_message").html("You have been subscribed! We will email you when there are updates or new information.")
	   }
       });

       // Callback handler that will be called regardless
       // if the request failed or succeeded
       request.always(function () {
           // Reenable the inputs
//           $inputs.prop("disabled", false);
       });*/
   }

    var jsonPCallback = function(response) {
	jsonPCallbackDelegate(response);
    }

    var jsonPCall = function(url, data, successCallback) {
 	jsonPCallbackDelegate = successCallback;
	$("#JSONPDiv").empty();
	$("#JSONPDiv").append("<script src=" + url + "?isJSONP=true&data=" + encodeURIComponent(data) + "></script>");
    }
    
    // start off with empty function. We'll override this each time we call.
    var jsonPCallbackDelegate = function(response) {
	
    }

    var ajaxPost = function(url, data, successCallback, failureCallback) {
	// raw XHR 
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
		if (xmlhttp.status == 200) {
		    successCallback(JSON.parse(xmlhttp.responseText));
		}
		else if (xmlhttp.status == 400) {
		               console.error(
				   "The following error occurred: " + xmlhttp);
		    jsonPCall(url, data, successCallback);
		}
		else {
		               console.error(
				   "The following error occurred: " + xmlhttp);
		    failureCallback();
		}
            }
	};

//    xmlhttp.open("POST", url, true);
//    xmlhttp.send(data);

	jsonPCall(url, data, successCallback);
	 
	

    }


  // Explicitly reveal public pointers to the private functions 
  // that we want to reveal publicly

  return {
    setup_sticky_nav: setup_sticky_nav,
    work_around_broken_hashtags: work_around_broken_hashtags,
    launch_photo_gallery: launch_photo_gallery,
    search_for_rsvp: search_for_rsvp,
    update_rsvp: update_rsvp,
    bind_swiping: bind_swiping,
    failing: failing,
    jsonPCallback: jsonPCallback
  }
})();


// Run our hooks once we've loaded
$( document ).ready(function() {
    wedding.setup_sticky_nav(); 
    wedding.work_around_broken_hashtags();
    wedding.bind_swiping();
    launchPhotoGallery();
    // make sure we preserve newlines in text area
    $.valHooks.textarea = {
	get: function( elem ) {
	    return elem.value.replace( /\r?\n/g, "\r\n" );
	}
    };
    $.ajaxSetup({ cache: false }); // or iPhones don't get fresh data
});

// Photo Gallery from https://www.w3schools.com/howto/howto_js_lightbox.asp

var slideIndex = 1;
var modalOpen = false;

// Open the Modal
function openModal() {
    document.getElementById('myModal').style.display = "block";
    var $stickyEl = $('#nav-bar-sticky');
    $stickyEl.removeClass('sticky'); // hide the overlay    
    modalOpen = true;
}

// Close the Modal
function closeModal() {
    document.getElementById('myModal').style.display = "none";
    modalOpen = false;
    var $stickyEl = $('#nav-bar-sticky');
    $stickyEl.addClass('sticky'); // show the overlay    
}

function launchPhotoGallery() {
    showSlides(slideIndex);
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var slideImages = document.getElementsByClassName("fullsize_image");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
//      $(slides[i]).addClass("moveLeft");
//      $(slides[i]).removeClass("showSlide");
    slides[i].style.display = "none";
  }
  //  $(slides[slideIndex-1]).removeClass("moveLeft");
    // $(slides[slideIndex-1]).addClass("showSlide");
  slides[slideIndex-1].style.display = "block";
  // captionText.innerHTML = slideImages[slideIndex-1].alt;
}


