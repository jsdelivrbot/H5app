;

/*
@author:chenke@jiedaibao.com
	date: 2015.11.13 
descri:自助服务页面js


*/

	'use strict';
	//var htmlStr = require('payment/serveSelf.html');
	var utls = {
		parseParam: function (param, key) {
			var paramStr = '';
			if (param instanceof String || param instanceof Number || param instanceof Boolean) {
				paramStr += '&' + key + '=' + encodeURIComponent(param);
			} else {
				$.each(param, function (i) {
					var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
					paramStr += '&' + utls.parseParam(this, k);
				});
			}
			return paramStr.substr(1);
		},
		showTip: function(msg) {
			var msg = msg || '出错啦';
			$('.massage span').text(msg);
			$('.tip-container').show();
		},
		getMyObjFromUrl: function(obj) {

			var tempObj = {};
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				tempObj[sParameterName[0]] = sParameterName[1];
			}
			for (var i in obj) {
				obj[i] = tempObj[i] ? tempObj[i] : obj[i];
			}

			return obj;
		},
		getUrlParam: function () {
			var aQuery = window.location.search.split('?');
			var aGET = {};
			if (aQuery.length > 1) {
				var aBuf = aQuery[1].split('&');
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split('=');
					aGET[aTmp[0]] = aTmp[1];
				}
			}
			return aGET;
		},
		getUrlParameter: function(sParam) {

			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');

			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return decodeURI(sParameterName[1]);
				}
			}

		},
		getJsonNameArr: function(obj) {
			//只考虑一层，且键值为字符串
			var temp = [];
			for (var i in obj) {
				if (typeof(obj[i]) === 'string') {
					temp.push(i);
				}
			}
			return temp;

		},

		shengxuArr: function(arr) {
			//数字与字符混合升序？
			return arr.sort();
		},
		getJsonShengxuArr: function(obj) {
			var nameArr = utls.getJsonNameArr(obj).sort();
			var arrLength = nameArr.length;
			var tempArr = [];
			for (var i = 0; i < aarrLength; i++) {
				tempArr.push(obj[nameArr[i]]);
			}
			return tempArr;
		},
		checkMoney: function(moneyStr) {
			if (moneyStr === '') {
				return true;
			}
			var no = parseFloat(moneyStr);
			//先不管商家第三位小数四舍五入情况，假设。只能两位小数
			//console.log(moneyStr);
			if ((((no + '').length === moneyStr.length) || ((no.toFixed(2) + '').length === moneyStr.length)) && (no > 0)) {
				//console.log(no);
				return true;
			}
			console.log(no);
			return false;
		},
		ifOnePointNum: function(moneyStr) {

			return /^\d+\.?\d{0,1}$/.test(moneyStr);

			//^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$
			//	/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
			//   /^-?\d+\.?\d{0,1}$/
			//		/^\d+\.?\d{0,1}$/
			//	/^\d+(.\d{1,2})?$/.test('2.')
		},
		ifTwoPointNum: function(moneyStr) {

			return /^\d+\.?\d{0,2}$/.test(moneyStr);

			//^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$
			//	/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
			//   /^-?\d+\.?\d{0,1}$/
			//		/^\d+\.?\d{0,1}$/
			//	/^\d+(.\d{1,2})?$/.test('2.')
		},
		getOneImg: function(source, callBackSucess, callBackError) {
			var tempImg = new Image;
			tempImg.onload = function() {
				var opt = {};
				opt.imgWidth = tempImg.width || 100;
				opt.imgHeight = tempImg.height || 100;
				opt.source = source;
				callBackSucess(opt);
			};
			tempImg.onerror = function(e) {
				//console.dir(e);
				//console.log('图片失败');
				var opt = {};
				opt.source = source;
				callBackError(opt);

			}
			tempImg.src = source;
		}
	};
	var serveSelfData = {
		urls: {},
		money: '',
		theResData: '',
		postData: {}
	}
	var init = {
		eventInit: function() {
			$(document).on('click', '#next', function() {
				serveSelfData.money = $('#theMoney').val().trim();
				//console.log(serveSelfData.money );
				console.log(serveSelfData.money);
				if (serveSelfData.money === '' || serveSelfData.money * 1 === 0) {

					//utls.showTip('请输入正确的金额');

					toast({
						text: '请输入正确的金额', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					});
					return false;
				}
				console.log(serveSelfData.money);
				if (parseFloat(serveSelfData.money) <= 0) {


					toast({
						text: '请不要输入负数', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					});
					return false;

				}
				if (!utls.ifTwoPointNum(serveSelfData.money)) {
					//utls.showTip('请输入正确的金额');
					toast({
						text: '请输入正确的金额', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					});

					return false;

				}
				if (parseFloat(serveSelfData.money) > 10000000000) {
					//utls.showTip('您输入的金额过大，请不要超过 1 0000 0000 00');
					toast({
						text: '您输入的金额过大，请不要超过 1 0000 0000 0', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					});
					return false;
				}

				// if (utls.getUrlParameter('amount')) {
				// 	console.log(serveSelfData.theResData);
				// 	window.location.href = 'pay.html' + window.location.search + '&merchantName=' + serveSelfData.theResData.data.title;
				// } else {
				// 	console.log(serveSelfData.theResData);
				// 	window.location.href = 'pay.html' + window.location.search + '&amount=' + serveSelfData.money + '&merchantName=' + serveSelfData.theResData.data.title;
				// }
				if (!$(this).hasClass('disabled')) {
					$(this).addClass('disabled');

					var _payMoney = Math.round(serveSelfData.money*100);
					$.ajax({
						url: '{{generateOrderApi}}',
						data: {
							amount: _payMoney,
							account: utls.getUrlParameter('account'),
							request_source:'h5',
							jdb_id: utls.getUrlParameter('jdb_id'),
							pay_amount : _payMoney,
							access_token:utls.getUrlParameter('access_token')
						},
						type: 'post',
						dataType: 'json',
						success: function (ret) {
							//Pay.datas.generateOrderData = ret.data;
							if( ret.errno == "C0000" ){
								window.location.href = 'https://native.jiedaibao.com/web2Native/pay?tradeID=' + ret.data.trade_id + '&amount=' + (parseInt(ret.data.pay_amount)/100) + '&ext=' + ret.data.ext;
								$('#next').removeClass('disabled');
							}else{
								toastError( ret.errmsg );
								return;
							}
						},
						error: function() {
							$('#next').removeClass('disabled');
						}
					});
				}

			});

			$('.tip-container .confirm').click(function() {
				$('.tip-container').hide();
			});

			$('.tip-container .close').click(function() {
				$('.tip-container').hide();
			});

			$(document).on('input', '#theMoney', function(e) {
				//console.log(false);
				var moneyStr = $('#theMoney').val().trim();
				e = e || window.event;
				var exe = /^(\d+\.?\d{0,2}|\d+\.?\d{0,1}|\d+\.|\d+)$/;
				if (!exe.test(moneyStr)) {

					if (/^(\d+\.?\d{3,3})$/.test(moneyStr)) {
						var tempString = parseFloat(moneyStr).toFixed(2);
						$('#theMoney').val(moneyStr.substring(0, moneyStr.length - 1));
						return false
					}

					var tempString = parseFloat(moneyStr).toString();
					/*if(tempString === 'NaN') {
						$('#theMoney').val('');
						return false
					}*/
					console.log(tempString);
					$('#theMoney').val(moneyStr.substring(0, moneyStr.length - 1));
					//alert(tempString );
					return false
				}
				if (moneyStr.length === 11) {
					$('#theMoney').val(moneyStr.substring(0, 10));
					toast({
						text: '最多输入10位数字', //显示内容
						type: 'warn', //‘success’ － 成功； ‘error’ － 失败； ‘warn’ － 警告 ｜默认success
						ms: 1500, //持续时间｜默认1500ms
						callback: function() {}
					}); 

				}

				return false
			});

			$(document).on('focus', '#theMoney', function(e) {

				if (window.innerWidth <= 330) {
					//$(document).scrollTop(100);
					//document.body.scrollTop = 0
					//console.log('cc');
					setTimeout(function() {
						document.body.scrollTop = 150;
					}, 500);

				}
				//console.log(123);
			});
			//$('#theMoney').focus();
			//$('#theMoney').click();

		},
		pageInit: function() {
			//$('#theMoney').removeAttr('readonly');
			if (utls.checkMoney(serveSelfData.money)) {

				var moneyNum = parseFloat(serveSelfData.money);
				if (moneyNum > 0) {
					$('#theMoney').val(moneyNum.toFixed(2));
					$('#theMoney').attr('readonly', 'readonly');
				}
				//先不管商家第三位小数四舍五入情况，假设。只能两位小数


			} else {
				return false;
			}

			if(serveSelfData.postData.manufacturer === 'samsung') {
				$('#theMoney').attr('type','text');
			}
			




			$.ajax({
				url: '{{merchantDetailApi}}',
				type: 'POST',
				dataType: 'json',
				data: serveSelfData.postData,
				success: function(resData) {
					if (resData.errno === 'C0000') {

						serveSelfData.theResData = resData;
						//$('.container').html(microtemplate(htmlStr, result.data));
						//var tempString = '<div><div class="imgContainer"> <div class="box"> <img src="' + resData.data.logo + '" /> </div></div> <p>' + resData.data.title + '</p> </div>'
						var tempString = '<div><div class="imgContainer">  <img  style="display:none;"data-src="' + resData.data.logo + '"  /> </div> <p>' + resData.data.title + '</p> </div>'

						$('.topDiv').html(tempString);
						init.pageCheck();
						//console.log(resData);
					} else {
						console.log(resData.errmsg);
					}



				},
				error: function(e) {
					console.log(e);
				}
			});
		},
		dataInit: function() {
			serveSelfData.postData = utls.getMyObjFromUrl({
				account: '',
				request_source: 'h5',
				jdb_id: '',
				manufacturer:'',
				access_token: ''
			});
			//data.postData.id = utls.getUrlParameter('id') ? utls.getUrlParameter('id') : '';
			//data.postData.time = +(new Date());
			//data.postData.sign = md5(data.postData.id + '|' + data.postData.time);
			serveSelfData.money = utls.getUrlParameter('amount') || '';
			//data.toNextPage = utls.getMyObjFromUrl({});
		},
		pageCheck: function() {


			/*console.log($('img'));*/
			var imgDom = $('img');
			/*console.log(imgDom);*/
			for (var i = 0; i < imgDom.length; i++) {
				var tempDom = $(imgDom[i]);
				var sourceUrl = tempDom.data('src');
				/*console.log(tempDom );
				console.log(sourceUrl);*/
				utls.getOneImg(sourceUrl, function() {
					tempDom.attr('src', sourceUrl).show();

				}, function() {
					/*console.log(tempDom );*/

					tempDom.attr('src', '../../img/payment/icon_shop.png').show();
				});
			}


		}
	}

	function main() {

		init.dataInit();
		init.pageInit();
		init.eventInit();

	}

	$(main());

	// 支付完成之后的回调
	function JDBPayCallback(ret) {
		var result;
		if (typeof ret == 'object') {
			result = ret;
		} else {
			result = JSON.parse(ret);
		}
		//result = {status:0,statusText:"支付成功"};
		// status 1 为取消，取消按钮。修改逻辑，取消的时候页面不做跳转
		// status 1为是失败，其他为成功
		// amount 支付金额
		// merchantName 收款方
		// discount 优惠金额
		// tradeId 交易id，用于跳转查询明细
		// statusText 错误信息
		var forwardInfo = {
			amount: parseInt(serveSelfData.money),
			discount: 0,
			merchantName: serveSelfData.theResData.data.title,
			tradeId: result.merchantOrderID,
			realAmount: result.amount,
			statusText: result.statusText,
			status: result.status
		};
		var paramsObj = $.extend({}, forwardInfo, utls.getUrlParam());
		var str = utls.parseParam(paramsObj);
		if (result.status * 1 !== 1) {
			// location.href = './randomSuccess.html?status='+result.status+'&statusText='+result.statusText;
			
			if(result.status == 0){
				// location.href = './randomSuccess.html?'+str;
				location.href = result.redirectUrl;
			}else{
				location.href = './paymentResult.html?'+str;
			}
		} else {
			if (result.statusText !== '' && result.statusText.indexOf('取消') <= 0) {
				toastError(result.statusText);
			}
		}
	}
