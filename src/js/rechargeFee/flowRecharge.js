GlobalData = {
	businessType: '52', 
	orderId: '0000'
};
;(function() {
	var youhuiDataArr = [];
	var feeAmount ;
	var htmlStr = require('rechargeFee/flowRechargeList.string'),
		params = url('?'),
		phone = params.mobile,
		memberId = params.memberID;
	$('.phoneImg').hide();
	$.post( '{{getQueryTimeApi}}', 
		{
			memberID: memberId
		},
		function(result) {
			var res = result;
			if (typeof result === 'string') {
				res=JSON.parse(result);
			}
			if( res.error.returnCode != 0 ) {
				toastError( '操作失败' );
				return;
			}
			$('#phone').text(phone);
			$('#queryTime').text(parseInt(res.data.timeLength / 60));
			if(res.data.avatar_url){
				$('#head').attr('data','1');
				$('#head').attr('src',res.data.avatar_url);
				
			} else {
				$('#head').attr('data','1');
				$('#head').attr('src','../../img/rechargeFee/head.png');
				
			}

			if($('#head').attr('data') == 1){
		        $('.phoneImg').show();
			}
		}
	);

	
	$('.Recommend').hide();
	
	$.post( '{{getparValueQueryApi}}', 
		{
			reqData: JSON.stringify({
				memberId : memberId,
				businessType: GlobalData.businessType
			})
		},
		function(result) {
			var res = result;
			if (typeof result === 'string') {
				res=JSON.parse(result);
			}
			var resultData=res.data;
			if( res.error.returnCode != 0 ) {
				toastError( '操作失败' );
				return;
			}
			resultData.flowRechargeList = resultData.parValueList;
			if( resultData.flowRechargeList.length == 0 ) {
				toastError( '没有历史数据' );
			}


			youhuiDataArr = resultData.parValueList;
			$( '#favorable' ).append( microtemplate( htmlStr, resultData ) );
			if($('#favorable').find('dl').length>0){
				$('.Recommend').show();
			}
		}
	);


	function bind(){
		var sub = false;
		$('#favorable').on('touchstart', '.cost-btn', function() {
			var index=$(this).parents('dl').attr('data');
			if(sub === true){
				return;
			}
			
			var nowClickedData = youhuiDataArr[index];
			var totalAmount = nowClickedData.peAmt;
			feeAmount = nowClickedData.payAmt;
			var paramObj = {
				memberId:memberId,
				totalAmount:totalAmount,
				feeAmount: feeAmount,
				idName: nowClickedData.idName,
				businessType:GlobalData.businessType
			};

			sub = true;
			$.ajax({
				url: '{{prepayApi}}',
				dataType: 'json',
				data:{
					reqData: JSON.stringify(paramObj)
				},
				type: 'post',
				error: function () {

				},
				success:function(res) {
					sub = false;
					if (res.error.returnCode != 0) {
						toastError(res.error.returnUserMessage);
						return;
					};
					var resData = res.data;
					var ext = res.data.ext;
					var merchantId = res.data.merchantId;
					GlobalData.businessType = res.data.businessType || '52';
					GlobalData.orderId = res.data.orderId || '';
					window.location.href = 'https://native.jiedaibao.com/web2Native/pay?tradeID=' + resData.prepayOrderId + '&amount=' + feeAmount + '&ext=' + ext + '&merchantId=' + merchantId;
				}
			});
		});

		
	}

	// 收银台回调函数 跳转结果页
	window.JDBPayCallback = function (res) {
		var resJson;
		if (typeof res === 'string') {
			resJson = JSON.parse(res);
		} else {
			resJson = res;
		};

		if(resJson.statusText.indexOf('取消') > -1) {
			return false;
		}
		// 当为取消状态的时候，停留在当前页面
		if (resJson.status * 1 === 1) {
			toastError(resJson.statusText);



		} else {
			location.href = '../payment/paymentByResult.html?amount=' + (feeAmount / 100) + '&statusText=' + resJson.statusText + '&status=' + resJson.status + '&orderID=' + resJson.merchantOrderID + '&type=' + GlobalData.businessType;
		}
	}

	bind();
})();

