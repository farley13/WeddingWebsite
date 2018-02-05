
var wedding = (function () {
    
  var failing = function() {
    return 'You failed';
  };


    // Sticky nav header pulled from https://stackoverflow.com/questions/2907367/have-a-div-cling-to-top-of-screen-if-scrolled-down-past-it
    // Cache selectors outside callback for performance. 

   var setup_sticky_nav = function() {
        var scroll_offset = 40; // we've got some padding etc - make it not jump so much
	var $window = $(window),
	$stickyEl = $('#nav-bar-sticky'),
	elTop = $stickyEl.offset().top + scroll_offset;

	$window.scroll(function() {
	    if ($window.scrollTop() > elTop) {
		if (! $stickyEl.hasClass('sticky')) {
		    $stickyEl.addClass('sticky')
		    // Reset the hash since we interrupted scrolling
                    var hash = window.location.hash;
                    window.location.hash = "";
                    window.location.hash = hash;
		}
		
	    } else {
		$stickyEl.removeClass('sticky')
		window.location.hash = "";
	    }
	});
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

   var launch_subscribe_dialog = function() {
       // fire off the request to our webapp
       request = $.ajax({
           url: "https://script.google.com/macros/s/AKfycbxwLF8OBywjaWGZ59qENIVM4QY4wvcVQojQBBQ4YiQIxwi8N4E/exec?name=Adam_web2&amp;comment=None",
	   dataType: 'json'
	   //            data: serializedData
//           data: "name=Adam&comment=None"
       });
       
       // Callback handler that will be called on success
       request.done(function (response, textStatus, jqXHR){
           // Log a message to the console
           console.log("Hooray, it worked!");
       });

       // Callback handler that will be called on failure
       request.fail(function (jqXHR, textStatus, errorThrown){
           // Log the error to the console
           console.error(
               "The following error occurred: "+
		   textStatus, errorThrown
           );
       });

       // Callback handler that will be called regardless
       // if the request failed or succeeded
       request.always(function () {
           // Reenable the inputs
//           $inputs.prop("disabled", false);
       });
   }

  // Explicitly reveal public pointers to the private functions 
  // that we want to reveal publicly

  return {
    setup_sticky_nav: setup_sticky_nav,
    work_around_broken_hashtags: work_around_broken_hashtags,
    launch_photo_gallery: launch_photo_gallery,
    launch_subscribe_dialog: launch_subscribe_dialog,
    failing: failing
  }
})();


// Run our hooks once we've loaded
$( document ).ready(function() {
    wedding.setup_sticky_nav(); 
    wedding.work_around_broken_hashtags();
    launchPhotoGallery();
});

// Photo Gallery from https://www.w3schools.com/howto/howto_js_lightbox.asp

var slideIndex = 1;

// Open the Modal
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById('myModal').style.display = "none";
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
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}


