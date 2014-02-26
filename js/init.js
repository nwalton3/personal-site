/*! init.js 

	This script loader uses Modernizr.load syntax (an alias of yepnope).
	
	Documentation found at: 
		http://modernizr.com/docs/#load
		http://yepnopejs.com/
*/

(function () {

	"use strict";

	var assetBase = 'http://nkwalton.brighamyounguniv.netdna-cdn.com/';
	if ( window.localAssets ) {
		assetBase = '';
	}

	if ( !window.jsVersion ) { window.jsVersion = 1; }

	// Load scripts
	Modernizr.load([
		
		// If touch is enabled, load alternate script file with touch support added.
		{
			test: Modernizr.touch,
			nope: assetBase + "js/script.min.js?v=" + window.jsVersion,
			yep:  assetBase + "js/script-touch.min.js?v=" + window.jsVersion
		}

	]);

}());