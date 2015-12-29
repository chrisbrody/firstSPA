spa.shell = (function () {
	// MODUEL SCORE VARIABLE
	var configMap = {
		  anchor_schema_map : {
		  	chat: { open : true, closed : true }
		  },
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
		stateMap = { 
			$container        : null, 
			anchor_map        : {},
			is_chat_retracted : true 
		},
		jqueryMap = {},
		copyAnchorMap, setJqueryMap, toggleChat, 
		changeAnchorPart, onHashchange,
		onClickChat, initModule
	;

	// UTILIY METHODS
	// returns copy of anchor map
	copyAnchorMap = function () {
		return $.extend( true, {}, stateMap.anchor_map )
	}

	
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

	// DOM METHOD /changeAnchorPart/
	changeAnchorPart = function (arg_map) {
		var anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep
		// begin merging changes into anchor map
		KEYVAL: 
		for( key_name in arg_map ) {
			if( arg_map.hasOwnProperty( key_name ) ) {
				// skip dependent keys during iteration
				if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL }

				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name]

				// update matching dependent key
				key_name_dep = '_' + key_name
				if ( arg_map[key_name_dep] ) {
					anchor_map_revise[key_name_dep]  = arg_map[key_name_dep]
				} else {
					delete anchor_map_revise[key_name_dep]
					delete anchor_map_revise['_s' + key_name_dep]
				}
			}
		}
		// attempt to update URI
		try {
			$.uriAnchor.setAnchor( anchor_map_revise )

		}
		catch ( error ) {
			$.uriAnchor.setAnchor( stateMap.anchor_map,null,true)
		}
		return bool_return
	}


	// EVENT HANDLERS
	onHashchange = function (event) {
		var anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed, s_chat_proposed
		// attempt to parse anchor
		try { anchor_map_proposed = $.uriAnchor.makeAnchorMap() }
		catch (error) {
			$.uriAnchor.setAnchor( anchor_map_previous,null,true )
			return false
		}
		stateMap.anchor_map = anchor_map_proposed
		// convience variavbles
		_s_chat_previous = anchor_map_previous._s_chat 
		_s_chat_proposed = anchor_map_proposed._s_chat
		// adjust chat component if changed
		if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed ) {
			s_chat_proposed = anchor_map_proposed.chat
			switch ( s_chat_proposed ) {
				case 'open' :
					toggleChat(true)
				break
				case 'closed':
					toggleChat(false)
				break
				default:
					toggleChat(false)
					delete anchor_map_proposed.chat
					$.uriAnchor.setAnchor( anchor_map_proposed,null,true )
			}
			return false
		}
	}
	onClickChat = function (event) {
		changeAnchorPart({
			chat : ( stateMap.is_chat_retracted ? 'open' : 'closed')
		})
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
		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		})

		// HANDLE URI anchor change events
		$(window).bind('hashchange', onHashchange).trigger('hashchange')

	}

	return { initModule: initModule }

})( jQuery );


