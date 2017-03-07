;
/**
 * @author human
 * 1、获取优惠券列表信息
 * 2、选择最优的可以被使用的优惠券,展示在首页计算最终金额
 * 3、优惠券列表拿到后的排序策略
 *
 * 注意项，所有与后端交互的金额都是分为单位。。
 */
var Common = {
	/**
	 * 将obj转换为URL上拼接的参数格式
	 */
	parseParam: function (param, key) {
		var paramStr = '';
		if (param instanceof String || param instanceof Number || param instanceof Boolean) {
			paramStr += '&' + key + '=' + encodeURIComponent(param);
		} else {
			$.each(param, function (i) {
				var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
				paramStr += '&' + Common.parseParam(this, k);
			});
		}
		return paramStr.substr(1);
	},
	/**
	 * 获取URL的所有传递的参数
	 */
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
	secondsToYYDDHHMMSS: function(seconds) {
		if (typeof (seconds) !== 'number') {
			seconds = parseInt(seconds);
		}
		try {
			var seconds = seconds * 1000;
			var DateObj = new Date(seconds);
			var year = DateObj.getFullYear();
			var month = DateObj.getMonth() + 1 + '';
			var theDate = DateObj.getDate() + '';
			if (month.length === 1) {
				month = '0' + month;
			}

			if (theDate.length === 1) {
				theDate = '0' + theDate;
			}
			var dateStr = year + '-' + month + '-' + theDate;
			var hour = (new Date(seconds)).toTimeString().substring(0, 8);
			return dateStr + ' ' + hour;
		} catch (e) {
			console.log(e);
			return seconds;
		}
	},

	/**
	 * 通用的ajax请求处理，对返回的参数和错误进行集中处理
	 * @param object options
	 */
	commonAjax: function (options) {
		// ajax请求error失败统一处理
		function errorFn (xhr, errorType, error) {
			//Pay.showTip('请求出错啦，请稍后再试！');
			toastError('请求出错啦，请稍后再试！');
			if (options.error && $.isFunction(options.error)) {
				options.error(xhr, errorType, error);
			}
		}
		// ajax请求成功处理
		function successFn (data, status, xhr) {
			/**
			    C0000	成功
			 	F1001	没有权限
			 	F1002	无效验签
				F1003	请求已过期
				F2001	请求方式错误
				F2002	请求参数错误
				F2003	手机号格式错误
				F2004	验签失败
				F3001	系统内部错误
			*/
			if (data.errno !== 'C0000') {
				toastError(data.errmsg);
				if (options.successErrorDo && $.isFunction(options.successErrorDo)) {
					options.successErrorDo(data);
				}
				return false;
			}

			if (options.success && $.isFunction(options.success)) {
				options.success(data, status, xhr);
			}
		}

		//data默认带上所有URL里面参数
		var newData = $.extend({}, Common.getUrlParam(), options.data);
		newData.request_source = 'h5';
		var newOptions = $.extend({}, options, {
			error: errorFn,
			success: successFn,
			data: newData
		});

		$.ajax(newOptions);
	}
};

var Pay = {
	datas: {
		coupons: [],
		// 单位为分，均是整数
		payMoney: 0,
		shouldPay: 0,
		selectedCouponIndex: -1,
		isUserChooseNo: false,
		urlParams: {},
		generateOrderData: {}
	},
	init: function () {
		Pay.prepareData();
		Pay.initEvent();
		Pay.getCouponList();
	},
	prepareData: function () {
		var obj = Common.getUrlParam();
		Pay.datas.urlParams = obj;
		Pay.datas.payMoney = Math.round(obj.amount * 100) || 0;
		if (Pay.datas.payMoney <= 0) {
			toastError('提交的金额有误！');
			Pay.datas.payMoney  = 0;
		}
	},
	getCouponList: function () {
		/**
		 * account
		 * jdb_id
		 */
		Common.commonAjax({
			url: '{{couponListApi}}',
			data: {
				amount: Pay.datas.payMoney
			},
			dataType: 'json',
			type: 'post',
			success: function (ret) {
				var couponArr = ret.data || [];
				if (couponArr.length === 0) {
					$('.youhui_info').hide();
					Pay.renderPayPage();
				} else {
					Pay.sortCoupons(couponArr);
				}
			}
		});
	},
	sortCoupons: function (couponArr) {
		/**
		 * 如果用户有当前该商户当前消费金额可用的优惠券时，自动为用户填充一张可用优惠券，优惠券填充规则：
		 * i：优惠后实付金额为0时，金额小的优先
		 * ii：优惠后实付金额不为0时，金额大的优先
		 * iii：金额相同时，剩余有效期短的优先 
		 * 点击后进入优惠券选择页面（详见优惠券需求），优惠券排序规则：
		 * i：金额递减
		 * ii：金额相同时，剩余有效期短的优先
		 * iii:该商户可用但当前不满足使用条件的，置灰不可点击，排列在可用券后面，排序按照金额递减，相同金额有限期时长递减规则排列；
		 */

		// type 1 现金券 2 其他 3 折扣券
		// amount 金额
		// discount 折扣
		var couponArr = couponArr || [];
		var length = couponArr.length;
		var temp;

		if (couponArr.length === 0) {
			Pay.datas.selectedCouponIndex = -1;
			return false;
		}

		//所有的券加上减免金额字段 discountNum
		for (var i = 0; i < length; i++) {
			temp = couponArr[i];
			// 折扣券
			if (temp.type * 1 === 3) {
				temp.discountNum = Math.round(0.01 * Pay.datas.payMoney * (100 - temp.discount * 1));
			} else if (temp.type * 1 === 1) {
				temp.discountNum = Math.round(temp.amount * 1);
			} else {
				temp.discountNum = Math.round(temp.amount) || 0;
			}
		}
		// 按照减免金额数进行冒泡排序
		for (var i = 0; i < length; i++) {
			for (var j = i; j < length; j++) {
				if (couponArr[i].discountNum < couponArr[j].discountNum) {
					var tempK = couponArr[i];
					couponArr[i] = couponArr[j];
					couponArr[j] = tempK;
				}

				//金额相同时，按照过期时间排序
				if (couponArr[i].discountNum === couponArr[j].discountNum) {
					if (couponArr[i].valid_time_end > couponArr[j].valid_time_end) {
						var tempK = couponArr[i];
						couponArr[i] = couponArr[j];
						couponArr[j] = tempK;
					}
				}
			}
		}
		// 将不可用的券放在最后
		for (var i = 0, j = 0; i < length; i++) {
			if (!couponArr[j].usable) {
				var tempArr = couponArr.splice(j, 1);
				couponArr.push(tempArr[0]);
			}else {
				j++;
			}
		}

		var selectedIndex = -1;
		if (couponArr[0].usable) {
			selectedIndex = 0;
		}

		//选中适合的券:减免后金额为0的券，要越小越好；减免金额不为0的券要越大越好
		for (var i = 0; i < length; i++) {
			if (couponArr[i].usable) {
				if (couponArr[i].discountNum >= Pay.datas.payMoney) {
					// 金额相同时，有限选中快过期的
					if (i > 0 && couponArr[i].discountNum != couponArr[i - 1].discountNum) {
						selectedIndex = i;
					}
				}
			}
		}

		Pay.datas.selectedCouponIndex = selectedIndex;
		Pay.datas.coupons = couponArr;
		Pay.renderPayPage();
	},
	renderPayPage: function () {
		var couponText = '';
		var index = Pay.datas.selectedCouponIndex;
		var isUserChooseNo = Pay.datas.isUserChooseNo;
		var selectedCoupon;
		var discountNum = 0;
		var payMoney = Pay.datas.payMoney;
		var shouldPay = payMoney;
		if (index === -1) {
			couponText = '本单暂无可用优惠券';
			if (isUserChooseNo) {
				couponText = '不使用优惠券';
			}
		} else {
			selectedCoupon = Pay.datas.coupons[index];
			discountNum = selectedCoupon.discountNum;
			shouldPay = payMoney - discountNum;
			if (shouldPay <= 0) {
				shouldPay = 1;
				discountNum = payMoney;
			}
			couponText = '-' + (discountNum / 100).toFixed(2) + '元';

			// 是折扣券的时候，展示折扣
			if (selectedCoupon.type * 1 === 3) {
				couponText = (selectedCoupon.discount / 10) + '折';
			}
		}
		Pay.datas.shouldPay = shouldPay;
		$('#sumMoney').text((payMoney / 100).toFixed(2));
		$('#couponDis').text(couponText);
		if (couponText.indexOf('元') !== -1) {
			$('#couponDis').addClass('color_yellow');
		} else {
			$('#couponDis').removeClass('color_yellow');
		}
		$('#disMoney').text((shouldPay / 100).toFixed(2));
	},
	renderCoupons: function () {
		if (Pay.datas.couponRendered) {
			return false;
		}
		var couponArr = Pay.datas.coupons;
		var itemArr = [];
		var merchantName = Pay.datas.urlParams.merchantName || '商家名称';
		merchantName = decodeURIComponent(merchantName);
		$.each(couponArr, function (index) {
			var typeClass = 'can_use';
			var styleStr = 'style="border-bottom-color:' + couponArr[index].color + '"';
			if (couponArr[index].usable == 0) {
				typeClass = 'cannot_use';
				styleStr = '';
			}
			if (index === Pay.datas.selectedCouponIndex) {
				typeClass = 'can_use choosed';
			}

			if (!couponArr[index].merchant_logo) {
				couponArr[index].merchant_logo = '../../img/payment/icon_shop.png';
			}
			var endTime = Common.secondsToYYDDHHMMSS(couponArr[index].valid_time_end);
			itemArr.push(
					'<div class="card_item ' + typeClass + '" ' + styleStr + '>' +
						'<div class="top">' +
							'<div class="logo_wrap">' +
								'<img class="logo" src="' + couponArr[index].merchant_logo + '"/>' +
							'</div>' +
							'<h3>' + merchantName + '</h3>' +
							'<p class="money">' + couponArr[index].title + '</p>' +
						'</div>' +
						'<p class="expire_time">有效期至 ' + endTime + '</p>' +
						'<img src="../../img/payment/checked.png" class="checked_icon"/>' +
					'</div>'
			);
		});
		$('.coupon_zone').html(itemArr.join(''));
		Pay.datas.couponRendered = true;

		$('.can_use').each(function (index) {
			$(this).click(function () {
				if ($(this).hasClass('cannot_use')) {
					return false;
				}
				Pay.datas.selectedCouponIndex = index;
				Pay.renderPayPage();
				$(this).addClass('choosed').siblings().removeClass('choosed');
				history.back();
			});
		});
	},
	initEvent: function () {
		Pay.initHash();
		$('.youhuiquan').click(function () {
			location.href = '#coupons';
			Pay.renderCoupons();
			Pay.datas.isUserChooseNo = true;
		});
		$('.nouse_btn').click(function () {
			Pay.datas.selectedCouponIndex = -1;
			Pay.renderPayPage();
			$('.card_item').removeClass('choosed');
			history.back();
			return false;
		});
		$('#pay_btn').click(function () {
			if (!$(this).hasClass('disabled')) {
				$(this).addClass('disabled');
				Pay.generateOrder();
			}
			return false;
		});

		$('.tip-container .confirm').click(function () {
			$('.tip-container').hide();
		});
		$('.tip-container .close').click(function () {
			$('.tip-container').hide();
		});
	},
	showTip: function (msg) {
		var msg = msg || '出错啦';
		$('.massage span').text(msg);
		$('.tip-container').show();
	},
	generateOrder: function () {
		var shouldPay = Pay.datas.shouldPay;
		var urlParams = Pay.datas.urlParams;
		var payMoney = Pay.datas.payMoney;
		var couponIndex = Pay.datas.selectedCouponIndex;
		var selectedCoupon;
		var specialObj = {
			coupon: '',
			amount: payMoney,
			pay_amount: shouldPay,
			source: urlParams.source || 1
		};
		var commitCoupon = [];
		if (couponIndex !== -1) {
			selectedCoupon = Pay.datas.coupons[couponIndex];
			commitCoupon.push({
				code: selectedCoupon.code,
				version: selectedCoupon.version,
				category: selectedCoupon.category,
				amount: selectedCoupon.amount,
				title: selectedCoupon.title,
				ctype: selectedCoupon.ctype
			});
		}
		specialObj.coupon = JSON.stringify(commitCoupon);
		Common.commonAjax({
			url: '{{generateOrderApi}}',
			data: specialObj,
			type: 'post',
			dataType: 'json',
			success: function (ret) {
				Pay.datas.generateOrderData = ret.data;
				window.location.href = 'https://native.jiedaibao.com/web2Native/pay?tradeID=' + ret.data.trade_id + '&amount=' + ret.data.pay_amount + '&ext=' + ret.data.ext;
				$('.pay').removeClass('disabled');
			},
			successErrorDo: function() {
				$('.pay').removeClass('disabled');
			},
			error: function() {
				$('.pay').removeClass('disabled');
			}
		});
	},
	initHash: function () {
		window.onhashchange = function () {
			var hashStr = location.hash.replace('#', '');
			Pay.renderPage(hashStr);
		};
		window.onhashchange();
	},
	renderPage: function (hashStr) {
		if (hashStr && hashStr === 'coupons') {
			$('.coupon_select').show();
			$('.pay_page').hide();
		} else {
			$('.coupon_select').hide();
			$('.pay_page').show();
		}
	}
};

// 支付完成之后的回调
function JDBPayCallback(ret) {
	var result;
	if (typeof ret == 'object') {
		result = ret;
	} else {
		result = JSON.parse(ret);
	}
	// status 1 为取消，取消按钮。修改逻辑，取消的时候页面不做跳转
	// status 1为是失败，其他为成功
	// amount 支付金额
	// merchantName 收款方
	// discount 优惠金额
	// tradeId 交易id，用于跳转查询明细
	// statusText 错误信息
	var forwardInfo = {
		amount: Pay.datas.payMoney / 100,
		discount: (Pay.datas.payMoney - Pay.datas.shouldPay) / 100,
		merchantName: Pay.datas.urlParams.merchantName,
		tradeId: result.merchantOrderID,
		realAmount: result.amount / 100,
		statusText: result.statusText,
		status: result.status
	};
	var paramsObj = $.extend({}, forwardInfo, Pay.datas.urlParams);
	var str = Common.parseParam(paramsObj);
	if (result.status * 1 !== 1) {
		location.href = './paymentResult.html?' + str;
	} else {
		if (result.statusText !== '') {
			toastError(result.statusText);
		}
	}
}
$(Pay.init);
