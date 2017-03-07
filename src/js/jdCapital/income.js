;(function(){
	/**
	 * 累计收益是所有大于等于0.01的数据，七日年化只显示近一个月的数据。
		所有数据中的最小数据的金额槽最短覆盖日期和金额的文字。最大数据的金额槽为满格。
		其余数据按最大数据－最小数据等比例划分。最大值最小值为相对值。
		页面可滑动，顶栏收益固定。
	 */
	
	var htmlStr = require('jdCapital/income.string'),
		params = utls.getMyObjFromUrl( { 'token': '','amt': '' } ),
		nowPage = 1,
		width,
		maxAmt,minAmt,aveAmt;
		$('.income-title>h2').html(params.amt);
	getData( 
		{ 
			reqData: JSON.stringify( {
				token: params.token,
				recFlag: 2,
				pageNo: nowPage
			} ) 
		},
		function( resultData ) {
			resultData.compList = formateData( resultData.compList, false );
			resultData.page = nowPage;
			
			if( resultData.compList.length == 0 ) {
				toastError( '没有历史数据' );
			}
			
			$( '.income-list' ).html( microtemplate( htmlStr, resultData ) );
			widthItem(resultData);
			
		}
	);

	$('.con').dropload({
	    loadUpFn : function(me) {
	    	getData( 
	    		{ 
					reqData: JSON.stringify( {
						token: params.token,
						recFlag: 2,
						pageNo: 1
					} ) 
				},
				function( resultData ) {
					nowPage = 1;
					resultData.compList = formateData( resultData.compList, true );
					resultData.page = nowPage;

					$( '.income-list' ).html( microtemplate( htmlStr, resultData ) );
					widthItem(resultData);
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
						recFlag: 2,
						pageNo: ++nowPage
					} ) 
				}, 
				function( resultData ) {
					resultData.compList = formateData( resultData.compList, true );
					resultData.page = nowPage;
					if( resultData.compList.length == 0 ) {
						toastError( '无更多数据' );
					}

					$( '.income-list' ).append( microtemplate( htmlStr, resultData ) );
					//widthItem(resultData);
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
					toastError( '系统繁忙，请稍后再试' );
					return;
				}

				callback( result.data );
			}
		);
	};
	
	//初始化数据格式化
	function formateData( dataList, isAjax ) {
		$.each( dataList, function( i, item ) {
			item.PayAmt = ( item.txPayAmt / 100 ).toFixed( 2 );
			item.widthItem = width + width*(item.txPayAmt-minAmt)/aveAmt
		} );
		return dataList;
	}
	
	//下拉页面数据格式化
	function widthItem(resultData){
		maxAmt = resultData.maxPftAmt;
		minAmt = resultData.minPftAmt;
		aveAmt = maxAmt - minAmt;
		
		$.each( $('.income-content'), function( i, item ) {
			width = $($('.income-item')[0]).width()/2;
			if(aveAmt != 0){
				$(item).width(width + width*(resultData.compList[i].txPayAmt-minAmt)/aveAmt);
			}else{
				$(item).width(width + width);
			}
			
		} );
	}
})();