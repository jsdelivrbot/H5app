var Index = {
	datas: {
		urlParams: {
			token: '1234567890'
		},
		payKind: null,
		addressList: [],
		kindMap: {
			40: {
				class: 'water',
				name: '水费'
			},
			41: {
				class: 'thunder',
				name: '电费'
			},
			42: {
				class: 'fire',
				name: '燃气取暖'
			}
		}
	},
	init: function () {
		Index.initData();
		Index.initHash();
		Index.initEvent();

	},
	initData: function () {
		//存储所有的参数
		var paramsObj = url('?') || {};
		// 获取hash上的参数
		var hashObj = Index.getHashParam();
		Index.datas.urlParams = $.extend({}, Index.datas.urlParams, hashObj, paramsObj);

		//渲染billList页面需要用payKind
		if (Index.datas.urlParams.payKind) {
			Index.datas.payKind = Index.datas.urlParams.payKind;
			//console.log(Index.datas.payKind + "chushi")
		}
	},
	getHashParam: function () {
		var hashParamStr = location.hash.split('?') || [];
		var searchStr = '';
		//console.log(hashParamStr + 'hasParamStr')
		if (hashParamStr.length == 2) {
			searchStr = hashParamStr[1];
		}
		var returnObj = url('?', '?' + searchStr) || {};
		//console.log(returnObj)
		return returnObj;
	},
	initHash: function () {
		window.onhashchange = function () {
			var hashStr = location.hash.replace('#', '').split('?')[0] || '';
			if (hashStr === 'billList') {
				Index.renderBillList();
			} else {
				Index.initIndexPage();
			}
		};
		window.onhashchange();
	},
	initEvent: function () {
		var startX = 0;
		var moveX = 0;
		var targetObj = null;
		var startTime;
		var payClass;
		$(document).on('tap', 'body', function (e) {
			$('#FeeCheck li').animate({left: '0px'}, 100);
			$('.delete').hide();
		});
		$('#FeeCheck').on('touchstart', 'li', function (e) {
			//event.preventDefault();
			var e = e || window.event;
			var target = e.target || e.srcElement;
			var touch = event.targetTouches[0];
			startX = touch.pageX;
			moveX = startX;
			targetObj = $(target).closest('li');
			startTime = +new Date();
		});
		$('#FeeCheck').on('touchmove', 'li', function (e) {
			//event.preventDefault();
			var e = e || window.event;
			var target = e.target || e.srcElement;
			var touch = event.targetTouches[0];
			moveX = touch.pageX;
		});
		$('#FeeCheck').on('touchend', 'li', function (e) {
			var payKind = Index.datas.payKind;
			var e = e || window.event;
			var endX = startX - moveX;
			var isDeleteShow = false;
			if (Math.abs(endX) > 20 && endX >= 0) {
				var index = $(this).attr('data-index');
				$('.delete').show();
				$(this).animate({left: '-62px'}, 200).siblings().animate({left: '0px'}, 100);
			} else if (Math.abs(endX) > 20 && endX < 0) {
				$(this).animate({left: '0px'}, 100);
				$('.delete').hide();
			} else if (Math.abs(endX) < 20) {
				if ($(this).find('.delete').css('display') == 'block') {
					isDeleteShow = true;
				};
				if ($('.delete').css('display') != 'block') {
					var index = $(this).attr('data-index');
					$('.plug' + index).animate('background', '#f0f2f5');
					var index = $(this).attr('data-index');
					var params = {
						payKind: Index.datas.payKind,
						token: Index.datas.urlParams.token,
						provinceId: Index.datas.addressList[index].provinceId,
						cityId: Index.datas.addressList[index].cityId,
						institutionNo: Index.datas.addressList[index].institutionNo,
						institutionName: Index.datas.addressList[index].institutionName,
						billKey: Index.datas.addressList[index].billKey,
						instRmk1: Index.datas.addressList[index].instRmk1
					};
					Index.checkBillStatus(params, function () {
						window.location.href = 'rechargeList.html' + '?' + Index.parseParam(params);
					});
				}
				if (isDeleteShow === true) {
					payClass = Index.datas.kindMap[payKind].class;
					$(this).animate({left: '0px'}, 100);
					$('.delete').hide();
				};
			};
		});

		// 此处逻辑，如果有缴费记录，会跳转到历史缴费记录页面
		// 如果没有缴费记录，会跳转到添加缴费记录页面
		$('#chargeId li').click(function() {
			var payKind = $(this).attr('data-type');
			Index.datas.payKind = payKind;
			Index.getBillList(function (ret) {
				Index.datas.addressList = ret.addressList || [];
				if (!$.isArray(ret.addressList) || ret.addressList.length <= 0) {
					location.href = 'recharge.html?payKind=' + Index.datas.payKind + '&token=' + Index.datas.urlParams.token;
				} else {
					//location.href = '?payKind=' + payKind + '&token=' + Index.datas.urlParams.token + '#billList';
					location.href = '#billList?payKind=' + payKind;
				}
			});
		});

		$('#chargeSelect').on('touchstart', 'p', function () {
			var addressList = Index.datas.addressList;
			if ($('#FeeCheck li').length >= 3) {
				toastError('最多可以添加3个账户，请先删除不用的再添加新账户');
				return false;
			}
			location.href = 'recharge.html?payKind=' + Index.datas.payKind + '&token=' + Index.datas.urlParams.token;
		}, false);
	},
	checkBillStatus: function(paramObj, successFn) {
		jdb.showLoading();
		$.ajax({
			url: '{{rechargeListApi}}',
			dataType: 'json',
			data: {
				reqData: JSON.stringify(paramObj)
			},
			type: 'post',
			success: function(res) {
				jdb.hideLoading();
				var jumpFlag = false;
				//后台提示不存在时，跳转到固定的错误页面
				if (res.error && res.error.returnCode * 1 === 1 && res.error.returnMessage === 'R20001') {

					jumpFlag = true;
				}

				// 账号虽然存在，但是账单为空的时候,也跳转到错误页面
				if (res.data) {
					if (res.data.billList && res.data.billList == null) {
						jumpFlag = true;
					}
					if (res.data.billList && res.data.billList.length == 0) {
						jumpFlag = true;
					}
				}

				if (res.error && res.error.returnCode * 1 !== 0 && jumpFlag === false) {
					toastError(res.error.returnUserMessage);
					return false;
				}

				if (jumpFlag) {
					location.href = './rechargeResFail.html?billKey=' + paramObj.billKey + '&institutionName=' + paramObj.institutionName + '#numberFail';
				} else {
					if (successFn && $.isFunction(successFn)) {
						successFn();
					}
				}
			},
			error: function () {
				toastError('请求接口出现错误，请稍后再试！');
				jdb.hideLoading();
			}
		});
	},
	renderBillList: function () {
		var kindMap = Index.datas.kindMap;
		var payKind = Index.datas.payKind;
		var addressList = Index.datas.addressList || [];
		var liStrArr = [];
		var className = kindMap[payKind].class;
		var textName = kindMap[payKind].name;
		document.title = textName;

		if (addressList.length === 0) {
			Index.getBillList(renderIt);
		} else {
			renderIt();
		}
		$('#chargeFee').hide();
		$('#chargeSelect').show();

		function renderIt(ret) {
			var addressList;
			if (ret) {
				addressList = ret.addressList || [];
			} else {
				addressList = Index.datas.addressList || [];
			}
			if (addressList.length > 0) {
				Index.datas.addressList = addressList;
				$.each(addressList, function (index) {
					var billKey = addressList[index].billKey;
					liStrArr.push('<li class="' + className + '" data-index="' + index + '" ><div class="plug' + index + '"><div class="chargeF"><div class="chargeThree">' + textName + '</div><div id="chargeNum">' + billKey + '</div></div><span>账单查询</span><div class="delete"></div></div></li>');
				});

				$('#FeeCheck').html(liStrArr.join(''));
				$('.delete').on('touchend', function (e) {
					var self = this;
					dialog.confirm('删除后不可恢复，确认删除？', function (ret) {
						if (ret.closeType == 'ok') {
							var nowIndex = $(self).closest('li').attr('data-index');
							Index.deleteAddress(delFn, nowIndex);
							function delFn (res) {
								$(self).closest('li').remove();
								$('.delete').hide();
								$('#FeeCheck').css('height', $('#FeeCheck li').length * 65 + 'px');
								if ($('#FeeCheck li').length == 0 || $('#FeeCheck li').length < 0) {
									$('#FeeCheck').hide();
									$('.tip').hide();
								}
							};
							return false;
						}
					});
				});
			};
			if ($('#FeeCheck li').length == 0 || $('#FeeCheck li').length < 0) {
				$('#FeeCheck').hide();
				$('.tip').hide();
			}
		}
	},
	deleteAddress: function(callbackFn, nowIndex) {
		if (!nowIndex) {
			toastError('获取当前要删除的项错误！');
			return false;
		}
		var paramsDelObj = {
			token: Index.datas.urlParams.token,
			payKind: Index.datas.payKind,
			id: Index.datas.addressList[nowIndex].id
		};
		jdb.showLoading();
		$.ajax({
			url: '{{deleteAddressApi}}',
			type: 'post',
			data: {
				reqData: JSON.stringify(paramsDelObj)
			},
			dataType: 'json',
			success: function (ret) {
				jdb.hideLoading();
				if (!ret.error) {
					toastError('接口返回异常，请重试');
					return false;
				}
				if (ret.error.returnCode * 1 !== 0) {
					toastError(res.error.returnUserMessage);
					return false;
				}
				if (callbackFn && $.isFunction(callbackFn) && ret.error.returnCode == 0 && paramsDelObj.id) {
					callbackFn(ret.data);
				}
			},
			error: function () {
				jdb.hideLoading();
				toastError('接口请求出错，请稍后再试');
			}
		});
	},
	getBillList: function (callbackFn) {
		var kindMap = Index.datas.kindMap;
		var payKind = Index.datas.payKind;

		if (!payKind && !kindMap[payKind]) {
			toastError('缴费的类型不存在!');
			return false;
		}
		var paramsObj = {
			token: Index.datas.urlParams.token,
			payKind: Index.datas.payKind
		};
		jdb.showLoading();
		$.ajax({
			url: '{{rechargeInfoApi}}',
			type: 'post',
			data: {
				reqData: JSON.stringify(paramsObj)
			},
			dataType: 'json',
			success: function (ret) {
				jdb.hideLoading();
				if (!ret.error || !ret.data) {
					toastError('接口返回异常，请重试');
					return false;
				}
				if (ret.error.returnCode * 1 !== 0) {
					toastError(res.error.returnUserMessage);
					return false;
				}

				if (callbackFn && $.isFunction(callbackFn)) {
					callbackFn(ret.data);
				}
			},
			error: function () {
				jdb.hideLoading();
				toastError('接口请求出错，请稍后再试');
			}
		});
	},
	initIndexPage: function () {
		$('#chargeFee').show();
		$('#chargeSelect').hide();
	},
	parseParam: function (param, key) {
		var paramStr = '';
		if (param instanceof String || param instanceof Number || param instanceof Boolean) {
			paramStr += '&' + key + '=' + encodeURIComponent(param);
		} else {
			$.each(param, function (i) {
				var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
				paramStr += '&' + Index.parseParam(this, k);
			});
		}
		return paramStr.substr(1);
	}
};
$(Index.init);
document.body.addEventListener('touchstart', function () { });

