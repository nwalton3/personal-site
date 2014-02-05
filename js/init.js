/*! init.js 

	This script loader uses Modernizr.load syntax (an alias of yepnope).
	
	Documentation found at: 
		http://modernizr.com/docs/#load
		http://yepnopejs.com/
*/

(function () {

	"use strict";

	// Load scripts
	Modernizr.load([

		// Load jQuery first. If it doesn't make it from our location, get it from Google.
		{
			test: (typeof jQuery !== 'undefined'),
			nope: pageSettings.jQueryURL,
			complete: function () {
				if ( !window.jQuery ) {
					Modernizr.load("//ajax.googleapis.com/ajax/libs/jquery/" + window.pageSettings.jQueryVersion + "/jquery.min.js");
				}
			}
		},
		
		// Next, load scripts that require jQuery. If touch is enabled, load alternate script file with touch support added.
		{
			test: Modernizr.touch,
			nope: "js/script.min.js",
			yep:  "js/script-touch.min.js"
		}

	]);

}());