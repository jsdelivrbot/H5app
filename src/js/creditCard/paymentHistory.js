;(function() {
	var obj = {},
		arr = [],
		htmlStr = require('creditCard/paymentHistory.string'),
		params = utls.getMyObjFromUrl( { 'token': '','account': '' } );
	getData( 
		{ token: params.token,bankNo: params.account },
		function( resultData ) {
			resultData.orderDetail = formateData( resultData.orderDetail );
			$.each( resultData.orderDetail ,function( i,item ){
				item.unshift(i);
				arr.unshift(item);
			});
			obj.arr = arr;
			if( obj.arr.length == 0 ){
				$( '.history-list' ).html('<div id="error"><img src="../../img/payment/icon_error.png" alt=""><p>没有历史数据</p></div>')
				return;
			}
			$( '.history-list' ).html( microtemplate( htmlStr, obj ) );
		}
	);
	function getData( postData, callback ) {
		$.post( '{{getHistoryCardListApi}}',
			postData,
			function( result ){
				if( typeof result == 'string' ) {
					result = JSON.parse( result );
				}
				if( result.error.returnCode != 0 ) {
					$( '.history-list' ).html('<div id="error"><img src="../../img/payment/icon_error.png" alt=""><p>'+ result.error.returnUserMessage +'</p></div>')
					return;
				}
	
				// if( result.data.orderDetail == null ){
				// 	$( '.history-list' ).html('<div id="error"><img src="../../img/payment/icon_error.png" alt=""><p>没有历史数据</p></div>')
				// 	return;
				// }
				callback( result.data );
			}
		);
	};
	
	function formateData( dataList ) {
		$.each( dataList, function( i, item ) {
			$.each( item, function( j, item) {
				if( item.orderStatus == 4 ) {//转出
					item.viewClass = 'smoke';
					item.viewTitle = '银行处理中';
				} else if( item.orderStatus == 3 ) {
					
					item.viewClass = 'fail';
					item.viewTitle = '还款失败';
				} else if( item.orderStatus == 5 ) {
					item.viewClass = 'refund';
					item.viewTitle = '已退款';
				}else {
					item.viewClass = '';
					item.viewTitle = '';
				}
			})
		} );
		return dataList;
	}
})();
