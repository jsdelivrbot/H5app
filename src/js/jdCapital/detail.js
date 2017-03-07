;(function(){
	$.fn.cookie('key', 'true');
	var htmlStr = require('jdCapital/detail.string'),
	params = utls.getMyObjFromUrl( { 'token': '','txJurNo': '','applyTime': '','accessToken': '','memberID': '','udid': '','appKey': '' } );
	function getData( postData, callback ) {
		$.post( '{{getCapitalDetailApi}}',
			postData,
			function( result ){
				if( typeof result == 'string' ) {
					result = JSON.parse( result );
				}

				if( result.error.returnCode != 0 ) {
					toastError( '系统繁忙，请稍后再试' );
					return;
				}

				callback( result.data );
			}
		);
	};
	getData( 
		{ 
			reqData: JSON.stringify( params ) 
		},
		function( resultData ) {
			resultData = formateData( resultData );
			$( '.history-list' ).html( microtemplate( htmlStr, resultData ) );
		}
	);
	function formateData( data ) {
			data.txPayAmt = ( data.txPayAmt / 100 ).toFixed( 2 );
			data.curAcBal = ( data.curAcBal /100 ).toFixed( 2 );
			data.creDm = data.creDt.substr(5);
			if(data.begCalDt){
				data.begCalDt = data.begCalDt.substr(5);
			}
			if(data.getProfitDt){
				data.getProfitDt = data.getProfitDt.substr(5);
			}
			
			data.getCurLine = '';
			data.getCurText = '';
			data.begCurLine = '';
			data.begCurText = '';
			data.color = '';
			if(data.begCalDt){
				var begCur = data.sysTm.replace(/-/g, '')-data.begCalDt.replace(/-/g, ''),
					getCur = data.sysTm.replace(/-/g, '')-data.getProfitDt.replace(/-/g, '');
				
				if(begCur >= 0){
					data.begCurLine = 'alive-line';
					data.begCurText = 'alive-text';
				}else{
					data.begCurLine = '';
					data.begCurText = '';
					data.color = '#d2d3d6';
				}
				if(getCur >= 0){
					data.getCurLine = 'alive-line';
					data.getCurText = 'alive-text';
				}else{
					data.getCurLine = '';
					data.getCurText = '';
					data.color = '#d2d3d6';
				}
			}
			
			data.catchWeekDay = utls.formatWeek(data.catchWeekDay);
			data.begCalWeekDay = utls.formatWeek(data.begCalWeekDay);
			data.getProfitWeekDay = utls.formatWeek(data.getProfitWeekDay);
			data.lastCatchWeekDay = utls.formatWeek(data.lastCatchWeekDay)
			if( data.cardNo ){
				if(data.txCd == 0){
					data.title = '从银行卡转入';
					data.txAmt = '＋' + data.txPayAmt;
				}else {
					data.title = '转出到银行卡';
					data.txAmt = '-' + data.txPayAmt;
					
				}
			}else{
				if(data.txCd == 0){
					data.title = '从借贷宝余额转入';
					data.txAmt = '＋' + data.txPayAmt;
				}else {
					data.title = '转出到借贷宝余额';
					data.txAmt = '-' + data.txPayAmt;
					
				}
			}
			// if( data.txCd == 0 ) {//转入
			// 	data.txPayAmt = '＋' + data.txPayAmt;
			// 	data.viewClass = 'turnIn';
			// 	data.viewTitle = '银行卡转入';
			// } else if( data.txCd == 1 ) {//转出
			// 	data.txPayAmt = '－' + data.txPayAmt;
			// 	data.viewClass = 'turnOut';
			// 	data.viewTitle = '银行卡转出';
			// } else if( data.txCd == 2 ) {//转入退款
			// 	data.txPayAmt = '－' + data.txPayAmt;
			// 	data.viewClass = 'turnOut';
			// 	data.viewTitle = '余额转入';
			// } else {
			// 	data.txPayAmt = '＋' + data.txPayAmt;
			// 	data.viewClass = 'turnIn';
			// 	data.viewTitle = '余额转出';
			// };
			if( data.txSts == 'S1' ){//成功
				data.viewResult = '已到账';
			}else if( data.txSts == 'F1' ){//失败
				if( data.txCd == 1 ){
					data.viewResult = '转出失败';
				}else{
					data.viewResult = '转入失败';
				}
			}else{//转出到银行卡已提交
				data.viewResult = '已提交';
			}
			return data;
	}
})()