;(function() {
	if($.fn.cookie('key') == 'true'){
		$.fn.cookie('key', 'false');
		location.reload();
	}else{
		var htmlStr = require('jdCapital/history.string'),
		params = utls.getMyObjFromUrl( { 'token': '' } );
		nowPage = 1;
		getData( 
			{ 
				reqData: JSON.stringify( {
					token: params.token,
					recFlag: 3,
					pageNo: nowPage
				} ) 
			},
			function( resultData ) {
				resultData.compList = formateData( resultData.compList, false );
				if( resultData.compList.length == 0 ){
					$( '.history-list' ).css('border-bottom','none');
					$( '.history-list' ).html( '<div id="error"><img src="../../img/jdCapital/icon_business.png" alt=""><p>暂无交易</p></div>' );
				}else{
					$( '.history-list' ).html( microtemplate( htmlStr, resultData ) );
				}
			}
		);

		$('.list-wrap').dropload({
		    loadUpFn : function(me) {
		    	getData( 
		    		{ 
						reqData: JSON.stringify( {
							token: params.token,
							recFlag: 3,
							pageNo: 1
						} ) 
					},
					function( resultData ) {
						nowPage = 1;
						resultData.compList = formateData( resultData.compList, true );

						if( resultData.compList.length != 0 ){
							$( '.history-list' ).html( microtemplate( htmlStr, resultData ) );
						}
						
						setTimeout( function() {
							me.resetload();
						}, 500 );
					}
				);
		    },
		    loadDownFn : function(me) {
		    	getData( 
		    		{ 
						reqData: JSON.stringify( {
							token: params.token,
							recFlag: 3,
							pageNo: ++nowPage
						} ) 
					}, 
					function( resultData ) {
						resultData.compList = formateData( resultData.compList, true );

						if( resultData.compList.length == 0 ) {
							toastError( '无更多数据' );
						}
						
						$( '.history-list' ).append( microtemplate( htmlStr, resultData ) );
						me.resetload();					
					}
				);
		    }
		});

		function getData( postData, callback ) {
			$.post( '{{getCapitalHistoryApi}}',
				postData,
				function( result ){
					if( typeof result == 'string' ) {
						result = JSON.parse( result );
					}
					
					if( result.error.returnCode != 0 ) {
						$( '.history-list' ).css('border-bottom','none');
						$( '.history-list' ).html( '<div id="error"><img src="../../img/jdCapital/icon_business.png" alt=""><p>' + result.error.returnUserMessage + '</p></div>' );
						return;
					}

					callback( result.data );
				}
			);
		};
		
		function formateData( dataList, isAjax ) {
			$.each( dataList, function( i, item ) {
				item.token = params.token;
				item.date = utls.formatData();
				item.txPayAmt = ( item.txPayAmt / 100 ).toFixed( 2 );
				//item.dateTime = item.creDt + ' ' + item.creTm;
				item.className = isAjax ? 'opacity' : '';
				if( item.txCd == 0 ) {//转入
					item.txPayAmt = '＋' + item.txPayAmt;
					item.viewClass = 'turnIn';
					item.viewTitle = '从银行卡转入-尾号'+item.cardNo;
					item.viewtype = '转入';
				} else if( item.txCd == 1 ) {//转出
					item.txPayAmt = '－' + item.txPayAmt;
					item.viewClass = 'turnOut';
					item.viewTitle = '转出到银行卡-尾号'+item.cardNo;
					item.viewtype = '转出';
				} else if( item.txCd == 2 ) {//转入退款
					item.txPayAmt = '＋' + item.txPayAmt;
					item.viewClass = 'turnIn';
					item.viewTitle = '从借贷宝余额转入';
					item.viewtype = '转入';
				} else {
					item.txPayAmt = '－' + item.txPayAmt;
					item.viewClass = 'turnOut';
					item.viewTitle = '转出到借贷宝余额';
					item.viewtype = '转出';
				};
				if( item.txSts == 'S1' ){//成功
					item.viewResult = '已到账';
				}else if( item.txSts == 'F1' ){//失败
					if( (item.txCd == 1) || (item.txCd == 3) ){
						item.viewResult = '转出失败';
					}else{
						item.viewResult = '转入失败';
					}
				}else{//转出到银行卡已提交
					item.viewResult = '已提交';
				}
			} );
			return dataList;
		}
	}
	
})();