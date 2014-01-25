/* script.js */


// Variables
var windowHeight = 0;


// On page load
$(function(){


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

	$('.visible').removeClass('visible');
	$('#' + nextSlide).addClass('visible');
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

	console.log('getNextSlide: '+ nextSlide);
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
	$('.project.current').removeClass('current');
	$('#' + nextProjectID).addClass('current');

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