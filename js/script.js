/*! 
 * script.js 
 */


// Variables
var windowHeight = 0;
var speedTest = null;
var currentBreakpoint = null;
var headerheight = 0;
var	titleheight  = 0;
var bottomOffset = 10;

var assetBase = 'http://static.nkwalton.com/img/';
if ( window.localAssets ) {
	assetBase = 'img/';
}

// Run speed test
$.hisrc.speedTest({
	speedTestUri: 'http://static.nkwalton.com/img/speed.jpg?n=' + Math.random(),
	speedTestKB: 48,
	speedTestExpireMinutes: 5
});


// On page load
$(document).ready(function(){

	if ( $('.main.portfolio').size() ) {
		initPortfolio();
	} else {
		loadImages( $('img.lazy'), 0 );
	}

	//var arrowRight = Snap();

});


/**
 * Func: InitPortfolio
 * Desc: Start the portfolio
 * Args:  
 */
function initPortfolio() {

	/* Set variables */
	headerheight = $('header.main').height();
	titleheight  = $('.project:first div.title').height();

	/* Speed Test */
	speedTest = $.hisrc.bandwidth;


	/* Handle hash navigation */

	// On load
	var url = document.location.toString();
	var newHash = '';
	var firstSlide = 'intro-0';

	if ( url.match('#') ) {
		var split = url.split( '#' )[1];
		if ( url.match('=') ) {
			split = split.split( '=' )[0];
		}

		if ( split && $('#' + split).size() !== 0 ) {
			// Show the correct slide on load
			firstSlide = split;
		} 
	}

	gotoSlide( firstSlide );

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



	/* Responsive Images */
	checkImageBreakpoints();
	if ( currentBreakpoint < 1600 ) {
		$(window).on('resize', checkImageBreakpoints);
	}


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


	/* Key actions */
	$(document).keydown(function(e){
		if (e.keyCode == 37) { // Back
			changeSlide( false );
	    }
	    else if (e.keyCode == 39) { // Forward
	       changeSlide( true );
	    }
		return false;
	});


	/* Image Resizing */
	checkHeight();
	$(window).on('resize', checkHeight);


	/* Typogrify */
	$('p, .type').each(function(e){
		$(this).html( typogr.typogrify( $(this) ) );
	});

}




/**
 * Func: CheckImageBreakpoints
 * Desc: Check to see if responsive images need to be updated
 * Args:  
 */
function checkImageBreakpoints () {

	var viewportWidth = $(window).width(),
		viewportHeight = $(window).height(),
		extraheight = headerheight + titleheight + bottomOffset,
		large = {w: 1777, h: 1200 + extraheight },
		med =   {w: 888,  h: 600  + extraheight },
		sm =    {w: 444,  h: 300  + extraheight };


	// Check that the screen has actually gotten bigger
	if ( viewportWidth <= currentBreakpoint ) {
		return;
	}


	if ( viewportWidth >= large.w && viewportHeight >= large.h ) {
		if ( currentBreakpoint !== large.w ) {
			updateResponsiveImages( 3200, speedTest );
			currentBreakpoint = large.w;
			$(window).off('resize', checkImageBreakpoints);
		}
	}
	
	// Large
	else if ( viewportWidth >= med.w && viewportHeight >= med.h ) {
		if ( currentBreakpoint !== med.w ) {
			updateResponsiveImages( 1600, speedTest );
			currentBreakpoint = med.w;
			if ( speedTest == 'high' ) {
				$(window).off('resize', checkImageBreakpoints);
			}
		}
	}
	
	// Medium
	else if ( viewportWidth >= sm.w && viewportHeight >= sm.h ) {
		if ( currentBreakpoint !== sm.w ) {
			updateResponsiveImages( 800, speedTest );
			currentBreakpoint = sm.w;
		}
	}

	// Small
	else {
		if ( currentBreakpoint !== 0) {
			updateResponsiveImages( 400, speedTest );
			currentBreakpoint = 0;
		}
	}

}


/**
 * Func: GetCurrentImageBreakpoint
 * Desc: Get the current width of the responsive images
 * Args:  
 */
function getCurrentImageWidth() {
	var large = 1777,
		med = 888,
		sm = 444,
		imagewidth = 400;

	if ( currentBreakpoint == large ) {
		imagewidth = 3200;
	} else if ( currentBreakpoint == med ) {
		imagewidth = 1600;
	} else if ( currentBreakpoint == sm ) {
		imagewidth = 800;
	} 

	return imagewidth;
}



/**
 * Func: UpdateResponsiveImages
 * Desc: Swap out the src attribute for responsive images
 * Args:  
 */
function updateResponsiveImages( breakpoint, bandwidth ) {
	var images = $('img.lazy'),
		retina = 0;

	if ( images.size() === 0 ) {
		return;
	}

	if ( window.devicePixelRatio >= 1.2 ) {
		retina = 1;
	}

	if (retina && bandwidth == 'high' ) {
		breakpoint = breakpoint * 2;
	}

	// Set a loading flag
	images.parent().addClass('toLoad');

	// Load the relevant images
	lazyLoadImages( breakpoint );
}



/**
 * Func: LazyLoadImages
 * Desc: Load the site's images
 * Args: @identifier - string that will allow jQuery to access images
 *		 @breakpoint - The image size (400, 800, 1600, 3200)
 */
function lazyLoadImages( breakpoint ) {
	var identifier = 'img.lazy',
		currentSlide = $('.visible'),
		currentImage = currentSlide.find( identifier ),
		currentProject = currentSlide.closest('.project'),
		nextSlide = getNextSlide( currentSlide, true ),
		nextImage = $('#' + nextSlide).find( identifier ),
		prevSlide = getNextSlide( currentSlide, false ),
		prevImage = $('#' + prevSlide).find( identifier ),
		projImages = currentProject.find( identifier ),
		nextProject = getNextProject( currentProject, true ),
		nextProjImages = $('#' + nextProject).find( identifier ),
		prevProject = getNextProject( currentProject, false ),
		prevProjImages = $('#' + prevProject).find( identifier );

	// 1. Load the current page's image (if it's not already)
	loadImages( currentImage, breakpoint );

	// 2. Load the next page's image (if it's not already)
	loadImages( nextImage, breakpoint );

	if ( !Modernizr.touch ) {
		// 3. Load the previous page's image (if it's not already)
		loadImages( prevImage, breakpoint );

		// 4. Load the rest of the current project's images (if they're not already)
		loadImages( projImages, breakpoint );

		if ( speedTest == 'high' ) {
			// 5. Load the next project's images (if they're not already)
			loadImages( nextProjImages, breakpoint );

			// 6. Load the previous project's images (if they're not already)
			loadImages( prevProjImages, breakpoint );
		}
	}

}


/**
 * Func: loadImages
 * Desc: Load an image or images
 * Args:  
 */
function loadImages( images, breakpoint ) {
	if( !images.size() ) {
		return;
	}

	images.each(function( index, img ){
		loadImage( img, breakpoint );
	});
}


/**
 * Func: loadImage
 * Desc: Load an image
 * Args:  
 */
function loadImage( img, breakpoint ) {
	var image = $(img),
		needsLoading = image.parent().hasClass('toLoad');

	if ( !needsLoading ) {
		return;
	}

	var src = image.attr('data-src'),
		ext = image.attr('data-ext') ? image.attr('data-ext') : '',
		url = assetBase + src + ext;

	if( image.hasClass( 'responsive' ) ) {
		url = assetBase + breakpoint + 'w/' + src + ext;
	} else if ( image.hasClass( 'titleImage' ) ) {
		url = assetBase + 'title-pages/' + src;
	} else if ( image.hasClass( 'front' ) ) {
		url = assetBase + '400w/' + src + ext;
	}

	//console.log( 'loading: ' + url );

	image.parent().removeClass('toLoad').addClass('loading');

	var loader = new ImageLoader( url );

	//set event handler
	loader.loadEvent = function( url, img ){
		//action to perform when the image is loaded
		addImage( image, url );
	};

	loader.load();
}


/**
 * Func: addImage
 * Desc: Add an image to the page
 * Args:  
 */
function addImage( image, url ) {
	//document.body.appendChild(image);
	image.attr('src', url);
	image.parent().removeClass('loading');
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

	var imageheight  = height - headerheight - titleheight - bottomOffset,
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
	  newSlide += '-0';
	}

	currentSlide.removeClass('visible');
	$(newSlide).addClass('visible');
	lazyLoadImages( getCurrentImageWidth() );

	if(project !== newProject) {
		gotoProject(newProject.attr('id'));
	}

	index = newSlide.indexOf('-0');
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
 * Args: @currentSlide - The jQuery object containing the current slide $('.visible')
 *		 @next - Boolean: next = true; prev = false
 */
function getNextSlide( currentSlide, next ) {
	if ( currentSlide === undefined ) {
		console.log( 'currentSlide is undefined' );
		return;
	}

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
		}	

	} else if (  projectNum < 1 ) {
		// We're at the first project going backward
		nextProjectNum = $('.project').last().attr('data-project');
	} else {
		// Previous project
		nextProjectNum = projectNum - 1;
	}

	nextProjectID = $('.project[data-project=' + nextProjectNum + ']').attr('id');

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

	return lastslideID;
}