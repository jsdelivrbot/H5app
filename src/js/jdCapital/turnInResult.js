;(function() {
	document.body.addEventListener('touchstart', function () { });
	
	var htmlStr = require('jdCapital/turnInResult.string'),
		params = utls.getMyObjFromUrl( { 
			'token': '',
			'calDate': '',
			'estDate': '',
			'amount': '',
			'txJurNo': '',
			'accessToken': '',
			'memberID': '',
			'udid': '',
			'appKey': '',
			'clientVersion': ''
		} );
		params.calDate = decodeURI( params.calDate ).substr(5);
		params.estDate = decodeURI( params.estDate ).substr(5);
		$( '.container' ).html( microtemplate( htmlStr, params ) );
		// $.post( '{{getCapitalDetailApi}}',
		// 	{ 
		// 		reqData: JSON.stringify( params ) 
		// 	},
		// 	function( result ){
		// 		if( typeof result == 'string' ) {
		// 			result = JSON.parse( result );
		// 		}
				
		// 		if( result.error.returnCode != 0 ) {
		// 			toastError( '系统繁忙，请稍后再试' );
		// 			return;
		// 		}
		// 		if(result.data.getProfitDt){
		// 			params.calDate = params.calDate.getProfitDt.substr(5);
		// 		}

		// 		if(params.calDate.getProfitDt){
		// 			params.calDate = params.calDate.getProfitDt.substr(5);
		// 		}
		// 		params.getProfitWeekDay = utls.formatWeek(result.data.getProfitWeekDay);
				
		// 		$( '.container' ).html( microtemplate( htmlStr, params ) );
		// 	}
		// );

})();