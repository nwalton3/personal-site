/* script.js */


// Variables
var windowHeight = 0;


// On page load
$(function(){

	// Add button actions
	$('a.infobutton').on('click', function(e) {
		/* Act on the event */
		$(this).parent().toggleClass('show-info');
		console.log('hello');
	});

	// Set image resizing
	checkHeight();
	$(window).on('resize', checkHeight);

});


function checkHeight() {
	var height = $(window).height();
	if ( windowHeight != height ) {
		resizeImage( height );
	}
	windowHeight = height;
}


function resizeImage( height ) {

	var headerheight = $('header.main').height(),
		titleheight  = $('div.title').first().height(),
		imageheight  = height - headerheight - titleheight - 10
		imagewidth   = imageheight + (imageheight / 3);

	$('.portfolio .image').css('max-height', imageheight).css('max-width', imagewidth);

}