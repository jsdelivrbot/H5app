;(function(){
	var htmlStr = require('creditCard/outLink.string');
	var params = utls.getMyObjFromUrl( { 'token': ''} );
	$.post( '{{getOutLinkApi}}', 
		{
			token: params.token,
			timeStamp: (new Date()).getTime()
		},
		function( result ) {
			if (typeof result == 'string') {
				result = JSON.parse(result);
			}
			
			if( result.error.returnCode != 0 ) {
				toastError( result.error.returnMessage );
				return;
			}

			var resultData = result.data;

			$( '.container' ).html( microtemplate(htmlStr, resultData) );
		}
	);
})();