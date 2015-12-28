/*jslint         browser : true, continue : true,
    devel  : true, indent  : 2,    maxerr   : 50,
    newcap : true, nomen   : true, plusplus : true,
    regexp : true, sloppy  : true, vars     : true,
    white  : true
*/
/*global jQuery */

var spa = (function() {
	var initModule = function ( $container ) {
		spa.shell.initModule( $container )
	}
	return { initModule:initModule }
})();

// var spa = (function ($) {
// 	// Module scope variables
// 	var configMap = {
// 		extended_height : 434,
// 		extended_title: 'Click to retract',
// 		retracted_height: 16,
// 		retracted_title: 'Click to extend',
// 		template_hmtl: '<div class="spa-slider"><\/div>'
// 	},
// 	// Declare all other module scope variables
// 	$chatSlider,
// 	toggleSlider, onClickSlider, initModule

// 	// DOM method / toggleSlider
// 	toggleSlider = function () {
// 		var slider_height = $chatSlider.height()

// 		if ( slider_height === configMap.retracted_height ) {
			
// 			$chatSlider
// 				.animate({ height : configMap.extended_height })
// 				.attr( 'title', configMap.extended_title )
// 			return true

// 		} else if ( slider_height === configMap.extended_height ) {
			
// 			$chatSlider
// 				.animate({ height:configMap.retracted_height })
// 				.attr( 'title', configMap.extended_title )
// 			return true

// 		}
// 		return false
// 	}

// 	onClickSlider = function ( event ) {
// 		console.log('clicked up')
// 		toggleSlider()
// 		return false
// 	}

// 	initModule = function ( $container ) {
// 		$container.html( configMap.template_hmtl )
// 		$chatSlider = $container.find( ' .spa-slider ')
// 		$chatSlider
// 			.attr( 'title', configMap.retracted_title )
// 			.click( onClickSlider )
// 		return true
// 	}

// 	return{ initModule : initModule }
// }())
// $(document).ready(function() { 
// 	spa.initModule( $('#spa') ) 
// })