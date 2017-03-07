;
GlobalData = {
	businessType: '40', //默认先写上水费的
	orderId: '0000'
};
(function () {
	var oUrl = url('?');
	var oToken =  oUrl.token || '1234567890';
	var rechargeF = require('rechargeFee/rechargeF.string');
	var globalOriginResBill = null;
	// hash控制
	/*window.location.href = '#chargeList';
	window.onhashchange = function () {
		var hashStr = location.hash.replace('#', '');
		if (hashStr === 'secBillList') {
			$('#bindDomSe').hide();
			$('#bindDom').show();
		}
	};
	window.onhashchange();*/
	//传参数据
	var parObj = {
		token: oToken,
		provinceId: oUrl.provinceId,
		cityId: oUrl.cityId,
		payKind: oUrl.payKind,
		institutionNo: oUrl.institutionNo,
		institutionName: oUrl.institutionName,
		billKey: oUrl.billKey,
		instRmk1: oUrl.instRmk1
	};
	//隐藏btn 和协议
	$('#agree,#btn').hide();
	//  ajax获取数据注入Dom
	jdb.showLoading();
	$.ajax({
		url: '{{rechargeListApi}}',
		dataType: 'json',
		data: {
			reqData: JSON.stringify(parObj)
		},
		type: 'post',
		error: function () {
			jdb.hideLoading();
		},
		success: function(res) {
			jdb.hideLoading();
			if (res.error.returnCode != '0') {
				/*if (res.error.returnCode == 1 && res.error.returnMessage == 'R20001') {
					$('#agree,#btn').hide();
					window.location.replace('../rechargeFee/rechargeResFail.html?billKey=' + oUrl.billKey + '&institutionName=' + oUrl.institutionName + '#numberFail');
				} else {*/
				toast(res.error.returnUserMessage);
				return false;
				//}
			} else {
				// 获取btn状态值
				var btnNum = $('button').data('num');
				var resData = res.data;// 纠正后的json  格式
				globalOriginResBill = $.extend({}, resData.billList[0]);
				$('.unnormal').removeAttr('disabled').addClass('defaultColor');
				//判断是否为智能表1为非智能2为智能
				var isCapacity = resData.isCapacity;
				var  oUrl1 = url('?');
				var oToken = oUrl.token;
				resData.dataPaykind = oUrl1.payKind;
				//隐藏btn 和协议
				$('#agree,#btn').show();
				// 判断智能非智能电表
				if (isCapacity === '1') {
					// 绑定数据格式
					resData.billList[0].vueDue = (+resData.billList[0].vueDue / 100).toFixed(2);
					resData.billList[0].payAmount = (+resData.billList[0].payAmount / 100).toFixed(2);
					resData.billList[0].balance = (+resData.billList[0].balance / 100).toFixed(2);
					resData.billList[0].endDate = DateStr(resData.billList[0].endDate);
					resData.billList[0].billDat = DateStr(resData.billList[0].billDat);
					resData.billList[0].beginDate = DateStr(resData.billList[0].beginDate);
					var data = resData.billList[0];
					//绑定DOM
					charge.bindDom(rechargeF, {resData:resData});
					$('.unnormal').addClass('defaultColor');
					//绑定事件
					if (btnNum == 1) {
						$('#btn .secondCmt').on('click', function () {
							// 取消缴费  可点击
							$('.unnormal').removeClass('defaultColor');
							PreOrderFn(oUrl1, data, oToken, resData);
						});
					}
				};
				$(document).on('click', function () {
					$('.banBtn').hide();
					$('.unnormal').removeAttr('disabled').addClass('defaultColor');
				}, false);
			};
		}
	});
	// 智能，非智能 预下单函数
	function PreOrderFn(oUrl1,data,oToken,resData) {
		var params = {
				token:oToken,
				billKey:oUrl1.billKey,
				payKind:oUrl1.payKind,
				totalAmount: globalOriginResBill.payAmount,
				currency: 'CNY',
				institutionNo:oUrl1.institutionNo,
				contractNo:data.contractNo,
				billDate: globalOriginResBill.billDat,
				customerName:data.customerName
			};
		jdb.showLoading();
		$.ajax({
			url: '{{rechargePreOrderApi}}',
			dataType: 'json',
			data:{
				reqData: JSON.stringify(params)
			},
			type: 'post',
			error: function () {
				jdb.hideLoading();
			},
			success:function(res) {
				jdb.hideLoading();
				$('button').data('num', '1');
				$('.unnormal').removeClass('defaultColor').attr('disabled', true);
				$('.banBtn').show();
				if (res.error.returnCode != 0) {
					toast(res.error.returnUserMessage);
				};
				var resData = res.data;
				var ext = res.data.ext;
				var merchantId = res.data.merchantId;
				GlobalData.businessType = res.data.businessType || '40';
				GlobalData.orderId = res.data.orderId || '';
				window.location.href = 'https://native.jiedaibao.com/web2Native/pay?tradeID=' + resData.preOrderId + '&amount=' + data.payAmount * 100 + '&ext=' + ext + '&merchantId=' + merchantId;
			}
		});
	}
	// DOM注入函数
	var charge = {
		bindDom:function (rechargeList,data,Dom) {
		var Dom = Dom || '#bindDom';
		$(Dom).html(microtemplate(rechargeList, data));
	}
	};
})();

//  日期预处理函数
function DateStr(str) {
	var len = str.length;
	if (len == 8) {
		var x = str.substring(0, 4);
		var y = str.substring(4, 6);
		var z = str.substring(6);
		str = x + '年' + y + '月' + z + '日';
		return str;
	} else if (len == 6) {
		var x = str.substring(0, 4);
		var y = str.substring(4);
		str = x + '年' + y + '月';
		return str;
	};
};
// 收银台回调函数 跳转结果页
function JDBPayCallback(res) {
		var resJson;
		if (typeof res === 'string') {
			resJson = JSON.parse(res);
		} else {
			resJson = res;
		};
		// 当为取消状态的时候，停留在当前页面
		if (resJson.status * 1 === 1) {
			toastError(resJson.statusText);
		} else {
			location.href = '../payment/paymentByResult.html?amount=' + (resJson.amount / 100) + '&statusText=' + resJson.statusText + '&status=' + resJson.status + '&orderID=' + resJson.merchantOrderID + '&type=' + GlobalData.businessType;
		}
	}
document.body.addEventListener('touchstart', function () { });
