/*! 
 * script.js 
 */


// Variables
var windowHeight = 0;
var speedTest = null;
var currentBreakpoint = null;
$.hisrc.speedTest({
	speedTestUri: 'http://nkwalton.com/images/speed.jpg?n=' + Math.random(),
	speedTestKB: 48,
	speedTestExpireMinutes: 1,
	forcedBandwidth: 'high'
});


// On page load
$(function(){


	/* Speed Test */
	speedTest = $.hisrc.bandwidth;
	console.log(speedTest);


	/* Responsive Images */
	checkImageBreakpoints();
	if ( currentBreakpoint < 1600 ) {
		$(window).on('resize', checkImageBreakpoints);
	}


	/* Handle hash navigation */

	// On load
	var url = document.location.toString();
	var newHash = '';

	if ( url.match('#') ) {
		var split = url.split( '#' )[1];
		if ( url.match('=') ) {
			split = split.split( '=' )[0];
		}
		// Show the correct slide on load
		gotoSlide( split );
	} else {
		gotoSlide( 'intro-1' );
	}

	// On hashchange
	$(window).on('hashchange', function(e){
		e.preventDefault();

		var hash = window.location.hash;
		if ( hash !== newHash ) {
			// Go to the new page
			gotoSlide ( hash );
		}
		newHash = hash;
	});



	/* Button Actions */

	// Add button actions
	$('a.infobutton').on('click', function(e) {
		e.preventDefault();
		$('.portfolio').toggleClass('show-info');
	});

	// Next button actions
	$('nav a.next').on('click', function(e) {
		e.preventDefault();
		changeSlide();
	});

	// Prev button actions
	$('nav a.prev').on('click', function(e) {
		e.preventDefault();
		changeSlide('prev');
	});



	/* Image Resizing */
	checkHeight();
	$(window).on('resize', checkHeight);


	/* Typogrify */
	$('p, .type').each(function(e){
		$(this).html( typogr.typogrify( $(this) ) );
	});

});




/**
 * Func: CheckImageBreakpoints
 * Desc: Check to see if responsive images need to be updated
 * Args:  
 */
function checkImageBreakpoints () {
	var viewport = $(window).width(),
		large = 1777,
		med = 888,
		sm = 444;

	// Check that the screen has actually gotten bigger
	if ( viewport <= currentBreakpoint ) {
		return;
	}

	if ( viewport >= large) {
		if ( currentBreakpoint !== large ) {
			updateResponsiveImages( 'img.responsive', 3200, speedTest );
			currentBreakpoint = large;
			$(window).off('resize', checkImageBreakpoints);
		}

	}
	
	// Large
	else if ( viewport >= med ) {
		if ( currentBreakpoint !== med ) {
			updateResponsiveImages( 'img.responsive', 1600, speedTest );
			currentBreakpoint = med;
			if ( speedTest == 'high' ) {
				$(window).off('resize', checkImageBreakpoints);
			}
		}
	}
	
	// Medium
	else if ( viewport >= sm) {
		if ( currentBreakpoint !== sm ) {
			updateResponsiveImages( 'img.responsive', 800, speedTest );
			currentBreakpoint = sm;
		}
	}

	// Small
	else {
		if ( currentBreakpoint !== 0) {
			updateResponsiveImages( 'img.responsive', 400, speedTest );
			currentBreakpoint = 0;
		}
	}
}


/**
 * Func: UpdateResponsiveImages
 * Desc: Swap out the src attribute for responsive images
 * Args:  
 */
function updateResponsiveImages( identifier, breakpoint, bandwidth ) {
	var images = $( identifier ),
		retina = 0,
		srcbase = 'img/';

	if ( images.size() === 0 ) {
		return;
	}

	if ( window.devicePixelRatio >= 1.2 ) {
		retina = 1;
	}

	if (retina && bandwidth == 'high' ) {
		breakpoint = breakpoint * 2;
	}

	images.each( function( index, image ) {
		var img = $(image),
			src = img.attr('data-src'),
			ext = img.attr('data-ext');

		img.attr('src', srcbase + breakpoint + 'w/' + src + ext);
	});

}





/**
 * Func: CheckHeight
 * Desc: Check to see if the window height has changed
 * Args:  
 */
function checkHeight() {
	var height = $(window).height();
	if ( windowHeight != height ) {
		resizeImage( height );
	}
	windowHeight = height;
}





/**
 * Func: ResizeImage
 * Desc: Set max height and width on the image to keep it in the window
 * Args: @height - The height of the window
 */
function resizeImage( height ) {

	var headerheight = $('header.main').height(),
		titleheight  = $('.project.current div.title').height(),
		imageheight  = height - headerheight - titleheight - 10,
		imagewidth   = Math.floor( imageheight + (imageheight / 3) );

	// Constrain sizes to minimum
	if(imagewidth < 240) {
		imagewidth = 240;
		imageheight = 320;
	}


	// Set max sizes in css
	$('.portfolio .sizable').css('max-width', imagewidth);
	$('.portfolio .image.sizable').css('max-height', imageheight);

}



/**
 * Func: gotoSlide
 * Desc: 
 * Args: @slideID - the id of the slide, without the '#'
 */
function gotoSlide( slideID ) {
	var currentSlide = $('.visible'),
		project = currentSlide.closest('.project'),
		newSlide = slideID[0] == '#' ? slideID : '#' + slideID,
		newProject = $(newSlide).closest('.project');

	if(newSlide.indexOf('-') === -1) {
	  newSlide += '-1';
	}

	currentSlide.removeClass('visible');
	$(newSlide).addClass('visible');

	if(project !== newProject) {
		gotoProject(newProject.attr('id'));
	}

	index = newSlide.indexOf('-1');
	if ( index !== -1 ) {
		window.location.hash = newSlide.substring(0, index);
	} else {
		window.location.hash = newSlide.substring(0);
	}
	
	$(window).scrollTop(0);
}


/**
 * Func: gotoProject
 * Desc: 
 * Args: @projectID - The id of the project, without the '#'
 */
function gotoProject( projectID ) {
	$('.project.current').removeClass('current');
	$('#' + projectID).addClass('current');
}


/**
 * Func: ChangeSlide
 * Desc: 
 * Args: @direction - Move forward or backward?
 *			For next, don't include a value. For prev, false, 0, or 'prev'
 */
function changeSlide( direction ) {
	var next = true,
		currentSlide = $('.visible').first(),
		nextSlide = '';

	if( direction == 'prev' || direction === false || direction === 0 ) {
		next = false;
	}

	nextSlide = getNextSlide( currentSlide, next );
	gotoSlide( nextSlide );
}




/**
 * Func: GetNextSlide
 * Desc: 
 * Args: 
 */
function getNextSlide( currentSlide, next ) {
	var nextSlide = '',
		nextProject = '',
		project = currentSlide.closest('.project'),
		slidesInProj = project.children('.slide').size(),
		id = currentSlide.attr('id').toString(),
		idArray = id.split('-'),
		currentSlideTitle = idArray[0],
		currentSlideNumber = parseInt( idArray[1] ),
		nextSlideNumber;

	// Next slide
	if ( next ) {

		// This project
		if ( !currentSlide.hasClass('last') ) {
			nextSlideNumber = currentSlideNumber + 1;
			nextSlide = currentSlideTitle + "-" + nextSlideNumber;
		// Next project
		} else {
			nextProject = getNextProject( project, next );
			nextSlide = getFirstSlide( nextProject );
		}

	// Previous slide
	} else {

		// This project
		if ( !currentSlide.hasClass('intro') ) {
			nextSlideNumber = currentSlideNumber - 1;
			nextSlide = currentSlideTitle + "-" + nextSlideNumber;

		// Prev project
		} else {
			nextProject = getNextProject( project, next );
			nextSlide = getLastSlide( nextProject );
		}
	}

	console.log('getNextSlide: ' + nextSlide);
	return nextSlide;
}




/**
 * Func: GetNextProject
 * Desc: 
 * Args: 
 */
function getNextProject( project, next ) {
	var projectNum = parseInt( project.attr('data-project') ),
		nextProjectNum = 0,
		nextProjectID = '',
		numProjects = $('.project').size();

	if ( next ) {
		if ( projectNum >= numProjects -1 ) {
			// We're at the last slide
			nextProjectNum = 0;
		} else {
			// Next project
			nextProjectNum = projectNum + 1;
			console.log('nextProjectNum: ' + nextProjectNum);
		}	

	} else if (  projectNum < 1 ) {
		// We're at the first project going backward
		nextProjectNum = $('.project').last().attr('data-project');
	} else {
		// Previous project
		nextProjectNum = projectNum - 1;
	}

	nextProjectID = $('.project[data-project=' + nextProjectNum + ']').attr('id');

	console.log('getNextProject: ' + nextProjectID);
	return nextProjectID;
}




/**
 * Func: getFirstSlide
 * Desc: 
 * Args: 
 */
function getFirstSlide( projectID ) {
	var project = $('#' + projectID),
		firstSlideID = project.find('.slide.intro').attr('id');

	console.log('getFirstSlide: ' + firstSlideID);
	return firstSlideID;
}


/**
 * Func: getLastSlide
 * Desc: 
 * Args: 
 */
function getLastSlide( projectID ) {
	var project = $('#' + projectID),
		lastslideID = project.find('.slide.last').attr('id');

	console.log('getLastSlide: ' + lastslideID);
	return lastslideID;
}