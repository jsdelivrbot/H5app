;(function() {
	document.body.addEventListener('touchstart', function () { });

	var htmlStr = require('jdCapital/turnOutResult.string'),
		params = utls.getMyObjFromUrl( {
			'token': '',
			'txJurNo': '',
			'accessToken': '',
			'memberID': '',
			'udid': '',
			'appKey': '',
			'clientVersion': ''
		} );
		params.applyTime = utls.formatData();
	$.post( '{{getCapitalDetailApi}}',
		{
			reqData: JSON.stringify( params )
		},
		function( result ){
			if( typeof result == 'string' ) {
				result = JSON.parse( result );
			}

			if( result.error.returnCode != 0 ) {
				toastError( '系统繁忙，请稍后再试' );
				return;
			}
			console.log(result);
			var resultData = result.data;
			resultData.token = params.token;
			resultData.txPayAmt = ( resultData.txPayAmt / 100 ).toFixed( 2 );
			resultData.creDt = resultData.creDt.substr(5);
			resultData.accessToken = params.accessToken;
			resultData.memberID = params.memberID;
			resultData.udid = params.udid;
			resultData.appKey = params.appKey;
			resultData.clientVersion = params.clientVersion;
			resultData.lastCatchWeekDay = utls.formatWeek(resultData.lastCatchWeekDay);
			if(!resultData.bankNo){
				resultData.bankNo = "";
			}
			$( '.container' ).html( microtemplate( htmlStr, resultData ) );
		}
	);




})();
