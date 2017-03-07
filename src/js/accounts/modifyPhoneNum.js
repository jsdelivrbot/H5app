/*
@author:chenke@jiedaibao.com
@date: 2015.11.19
decription: 修改密码页面对应页面主要js逻辑
						工具zepto，无模板
						data获取，， php页面有一个id为‘data’的div
							以及其他客户输入input



*/

;
(function() {
	'use strict';
	var utls = {
		addProterty: function(toObj, fromObj) {
			//将fromObj的属性添加覆盖到toObj，暂时只考虑简单数据
			for (var i in fromObj) {
				toObj[i] = fromObj[i];
			}
			console.log(toObj);
			return toObj;
		}
	};
	var globalData = {
		url: '',
		targetUrlToApp: 'http://native.jiedaibao.com/web2Native/changeBindPhone?token=',
		postData: {
			'memberID': '',
			'udid': '',
			'accessToken': ''
		}
	};

	function init() {
		initData();
		initEvent();
	}

	function initEvent() {
		/*$(document).on('click', '#next', function() {
			alert('click');
			var tempObj = {};
			tempObj.cusName = $('#cusName').val().trim();
			tempObj.IDNo = $('#cusID').val().trim();
			tempObj.visaNo = $('#bankNo').val().trim();
			tempObj.phoneNo = $('#cusTele').val().trim();
			console.log(tempObj);
			if (checkData(tempObj)) {
				goToNext(tempObj);
			} else {
				alert('请填上相应空白字段');
			}

		});*/
		$(document).on('click', 'button', function() {
			//alert('click');
			var tempObj = {};
			tempObj.name = $('#cusName').val().trim();
			tempObj.identity = $('#cusID').val().trim();
			tempObj.bankCardNo = $('#bankNo').val().trim();
			tempObj.bankPhoneNum = $('#cusTele').val().trim();
			console.log(tempObj);
			if (checkData(tempObj)) {

				if(!(/[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/.test(tempObj.name))) {
					toastError('请输入真实姓名');
					return false;
				}
				if (!(/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(tempObj.identity))) {
					//alert('请输入正确银行卡号');
					toastError('请输入正确的身份号');
					return false;
				}
				if (!(/^(\d{10,25})$/.test(tempObj.bankCardNo))) {
					//alert('请输入正确银行卡号');
					toastError('银行卡格式有误');
					return false;
				}
				if (!(/^(\d{11,11})$/.test(tempObj.bankPhoneNum))) {
					//alert('请输入正确银行卡号');
					toastError('手机号格式有误');
					return false;
				}
				tempObj.bankCardNo = $('#bankNo').val().trim() + $('#tailNo').html();
				goToNext(tempObj);
			} else {
				//alert('请填上相应空白字段');
				toastError('请填上相应空白字段');
		
			}

		});

	}

	function initData() {
		function getDataFromDiv() {
			var dataDIv = $('#data');
			var inputArr = dataDIv.find('input');
			var emptyObj = {};
			inputArr.forEach(function(ele, index, arr) {
				if ($(ele).data('key')) {
					emptyObj[$(ele).data('key')] = $(ele).val().trim();
				}
			});
			return emptyObj;
		}
		var tempObj = getDataFromDiv();
		//console.log(tempObj);
		globalData.postData = utls.addProterty(globalData.postData, tempObj);
		//console.log(globalData.postData);
	}

	function checkData(obj) {
		var flag = true;
		for (var i in obj) {
			if (obj[i] === '') {
				flag = false;
				break;
			}
		}
		return flag;
	}

	function goToNext(obj) {
		//console.log(globalData.postData);
		globalData.postData = utls.addProterty(globalData.postData, obj);
		console.log(globalData.postData);
		$.ajax({
			url: '{{modifyPhoneApi}}',
			//url: '/data/accounts/checktNo.json',

			type: 'POST',
			data: globalData.postData,
			dataType: 'JSON',
			success: function(resData) {
				console.log(resData);

				if (typeof(resData) === 'string') {
					resData = JSON.parse(resData);
				}

				try {
					if (resData.error.returnCode === 0) {
						toast({
							text: '验证成功',
							type: 'warn',
							ms: 1500,
							callback: function() {}
						});

						window.location.href = globalData.targetUrlToApp + resData.data.bankCardToken;
					} else {
						toast({
							text: resData.error.returnUserMessage,
							type: 'warn',
							ms: 1500,
							callback: function() {}
						});
						//window.location.href = globalData.targetUrlToApp + globalData.postData.accessToken;
					}
				} catch (e) {
					console.log(e);
					toast({
						text: 'js报错', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					});
				}
			},
			error: function(e) {
				console.log(e);
				toast({
					text: '网络错误', //显示内容
					type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
					ms: 1500, //持续时间｜默认1500ms
					callback: function() {}
				});
				//	window.location.href = globalData.targetUrlToApp + globalData.postData.accessToken;
				//alert('error');
			}
		});

	}

	$(init);

})();