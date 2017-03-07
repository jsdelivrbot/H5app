;(function() {
	window.onload = function(){
		var htmlStr = require('jdCapital/setting.string'),
		params = utls.getMyObjFromUrl( { 'token': '' } );

		$.post( '{{getCapitalSettingnApi}}', 
			{ reqData: JSON.stringify( { token: params.token } ) },
			function( result ) {
				if( result.error.returnCode != 0 ) {
					toastError( result.error.returnUserMessage );
					return;
				}

				var resultData = result.data;

				$( '.toggle-list' ).html( microtemplate(htmlStr, result.data) );
			}
		);

		$( document ).on( 'change', 'input[type=checkbox]', function() {
			var $this = $( this ),
				reqData = { 
					"nfyflg": ( $this.prop( 'checked' ) ? 1 : 0 ), 
					"token": params.token
				};

			$.post( '{{setCapitalSettingnApi}}', 
				{ reqData: JSON.stringify( reqData ) },
				function( result ) {
					if( result.error.returnCode != 0 ) {
						toastError( '操作失败' );
						return;
					}

					//toastSuccess( result.error.returnUserMessage );
				}
			);
		} );
	}
	
})();

