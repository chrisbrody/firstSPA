spa.shell = (function () {
	// MODUEL SCORE VARIABLE
	var configMap = {
		  main_html : String() 
			+  '<div class="spa-shell-head">'
			  +  '<div class="spa-shell-head-logo"></div>'
			  +	 '<div class="spa-shell-head-acct"></div>'
			+	 '<div class="spa-shell-head-search"></div>'
			+  '</div>'
			+  '<div class="spa-shell-main">'
			  +	 '<div class="spa-shell-main-nav"></div>'
			  +	 '<div class="spa-shell-main-content"></div>'
			+  '</div>'
			+	'<div class="spa-shell-foot"></div>'
			+	'<div class="spa-shell-chat"></div>'
			+	'<div class="spa-shell-modal"></div>',
			chat_extened_time: 1000,
			chat_retract_time: 300,
			chat_extend_height: 450,
			chat_retract_height: 15,
			chat_extened_title: 'Click to retract',
			chat_retracted_title: 'Click to Extend'
		},
		stateMap = { $container : null, is_chat_retracted: true },
		jqueryMap = {},
		setJqueryMap, toggleChat, onClickChat, initModule
	;

	// UTILIY METHODS

	// DOM METHOD /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container
		jqueryMap = { 
			$container : $container,
			$chat: $container.find( '.spa-shell-chat' ) 
		}
	}

	// DOM METHOD /toggleChat/
	toggleChat = function (do_extend, callback) {
		var px_chat_ht = jqueryMap.$chat.height(),
			is_open    = px_chat_ht === configMap.chat_extend_height,
			is_closed  = px_chat_ht === configMap.chat_retract_height,
			is_sliding = ! is_open && ! is_closed
		// aviod race conditions
		if ( is_sliding ) { return false }

		// begin extended chat slider
		if ( do_extend ) {
			jqueryMap.$chat.animate( 
				{ height: configMap.chat_extend_height }, 
				configMap.chat_extened_time,
				function () {
					jqueryMap.$chat.attr('title', configMap.chat_extened_title)
					stateMap.is_chat_retracted = false
					if ( callback ) { callback( jqueryMap.$chat ) }
				}
			)
			return true
		}

		// begin retract slider
		jqueryMap.$chat.animate(
			{ height: configMap.chat_retract_height },
			configMap.chat_retract_time,
			function () {
				jqueryMap.$chat.attr('title', configMap.chat_retracted_title)
				stateMap.is_chat_retracted = true
				if ( callback ) { callback (jqueryMap.$chat) }
			}
		)

		return true
	}

	// EVENT HANDLERS
	onClickChat = function (event) {
		toggleChat( stateMap.is_chat_retracted )
		return false
	}

	// PUBLIC METHOD
	initModule = function ( $container ) {
		// load HTML and map jQuery collections
		stateMap.$container = $container
		$container.html( configMap.main_html )
		setJqueryMap()

		// initialize chat slider and bind click handler
		stateMap.is_chat_retracted = true
		jqueryMap.$chat.attr('title', configMap.chat_retracted_title).click(onClickChat)
	}

	return { initModule: initModule }

})( jQuery );


