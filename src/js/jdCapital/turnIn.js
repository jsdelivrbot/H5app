;(function() {
	var htmlStr = require('jdCapital/turnIn.string'),
		params = utls.getMyObjFromUrl( { 'token': '', 'totAmt': 0,'accessToken': '','memberID': '','udid': '','appKey': '','clientVersion': '' } ),
		maxAmt = 450000000,
		estDateStr, calDateStr, amount;
	var isHide = true;

	$( '#input-money' ).attr( 'placeholder', '建议转入100元以上金额' );
	//消灭底部文案
	$(window).resize(function() {
		if(isHide){
			$('.bottom-desc').css('display','none');
			isHide = false;
		}else{
			$('.bottom-desc').css('display','block');
			isHide = true;
		}
	});
	$.post( '{{getCapitalTurnInDetailApi}}', 
		{ reqData: JSON.stringify( { token: params.token } ) }, 
		function( result ) {
			if( typeof result == 'string' ) {
				result = JSON.parse( result );
			}

			if( result.error.returnCode != 0 ) {
				toastError( result.error.returnUserMessage );
				return;
			}

			var resultData = result.data;

			// if( resultData.popFlg == 'Y' ) {
			// 	// window.location.href = './information.html?token=' + params.token;

			// 	var reqData = {
			// 		reqId: utls.getReqId( params.token ),
			// 		token: params.token,
			// 		job: '0',
			// 		fnyAddr: '北京',
			// 		docVdyDt: '2099-12-30'
			// 	};

			// 	$.post( '{{setInformationApi}}', 
			// 		{
			// 			reqData: JSON.stringify( reqData )
			// 		},
			// 		function( result ) {
			// 			if( result.error.returnCode != 0 ) {
			// 				toastError( '网络错误，请刷新后重试' );
			// 				turnInBtn.off( 'click' );
			// 				return;
			// 			}
			// 		} 
			// 	);
			// }

			estDateStr = formatterDateWeek( resultData.estDt, resultData.estWeekDay );
			calDateStr = formatterDateWeek( resultData.calDt, resultData.calWeekDay );

			$( '.desc-date' ).html( microtemplate( htmlStr, { date: estDateStr } ) );
		}
	);

	var cover = $( '.cover' );
	
	$( '#btn-plist' ).on( 'click', function( e ) {
		e.preventDefault();
		cover.show();
	} );

	cover.find( '.background' ).on( 'click', function( e ) {
		cover.hide();
	} );

	$( '.btn-back' ).on( 'click', function( e ) {
		cover.hide();
	} );

	var turnInBtn = $( '#turnIn-btn' ); 
	turnInBtn.on( 'click', function( e ){
		if( !turnInBtn.hasClass( 'alive-button' ) ) {
			return;
		}

		var input = $.trim( $( '#input-money' ).val() );

		if( !input || input == '' ) {
			toastError( '请输入金额' );
			return;
		}

		if( input <= 0 ) {
			toastError( '操作金额不得为0' );
			return;
		}

		if( input * 100 + parseInt( params.totAmt ) > maxAmt ) {

			toastError( '您最多还可以转入'+(maxAmt - parseInt( params.totAmt ))*0.01+'元' );
			return;
		}

		turnInBtn.addClass( 'disabled' );

		var reqData = {
			token: params.token,
			txAmt: Math.round( parseFloat( input ) * 100 ),
			reqId: utls.getReqId( params.token )
		};

		$.post( '{{getCapitalTurnInApi}}',
			{ 
				reqData: JSON.stringify( reqData )
			},
			function( result ) {

				if( typeof result == 'string' ) {
					result = JSON.parse( result );
				}
				
				if( result.error.returnCode != 0 ) {
					toastError( result.error.returnUserMessage );
					turnInBtn.removeClass( 'disabled' );
					return;
				}

				var resultData = result.data;

				params.txJurNo = resultData.orderId;

				amount = resultData.txAmt / 100;

				//获取支付订单id 唤起收银台
				window.location.href = 'https://native.jiedaibao.com/web2Native/pay?' + 
					'tradeID=' + resultData.orderId + '&amount=' + resultData.txAmt + '&ext=' + resultData.txnType;
			}
		);
	} );

	function formatterDateWeek( date, week ) {
		var weekStr;

		switch( week ) {
			case '0':
				weekStr = '天'; break;
			case '1':
				weekStr = '一'; break;
			case '2':
				weekStr = '二'; break;
			case '3':
				weekStr = '三'; break;
			case '4':
				weekStr = '四'; break;
			case '5':
				weekStr = '五'; break;
			case '6':
				weekStr = '六'; break;
		}

		return date + ' 星期' + weekStr;
	}

	// 支付完成之后的回调
	window.JDBPayCallback = function(ret) {
		var result;
		if (typeof ret == 'object') {
			result = ret;
		} else {
			result = JSON.parse(ret);
		}
/*		try {
			var img = new Image();
			img.src = 'http://www.jiedaibao.com/index.html?' + JSON.stringify(ret);

		} catch (e) {
			alert(e);
			alert('发送图片出错');
		}*/

		turnInBtn.removeClass( 'disabled' );

		if( result.status != 0 ) {
			

			if( result.status == 1 ) {
				turnInBtn.addClass( 'alive-button' );
			}
			return;
		}

		var str = parseParam( {
			amount: amount,
			calDate: calDateStr,
			estDate: estDateStr,
			token: params.token,
			txJurNo: params.txJurNo,
			accessToken: params.accessToken,
			memberID: params.memberID,
			udid: params.udid,
			appKey: params.appKey,
			clientVersion: params.clientVersion
		} );

		window.location.href = './turnInResult.html?' + str;
	}
})();

