;(function() {
	var rechargeInfoApi = require('rechargeFee/index.string');
	/*window.onhashchange = function () {
		var hashStr = location.hash.replace('#', '');
		if (hashStr === 'billList') {
			$('#chargeFee').hide();
			$('#chargeSelect').show();
		};
	};
	window.onhashchange();*/
	var oUrl = url('?');
	var oToken = oUrl.token;
	var chargeType = ['water','thunder','fire'];
	var payKind = [04,05,06];
	$('#chargeId').on('click', function (e) {
		//location.href = '#billList';
		var $target = $(e.target);
		var feeTypeNum = $target.data('type');
		var payKindNum = '0' + payKind[feeTypeNum - 1];
		var pars = {
			token: oToken,
			payKind: payKindNum
		};
		$.ajax({
			url: '{{rechargeInfoApi}}',
			dataType: 'json',
			data: {
				reqData: JSON.stringify(pars)
			},
			type: 'post',
			success: function(res) {
				if (res.error.returnCode == '1') {
					toast('请求错误，请返回重试！');
					return false;
				};
				// console.log(res.data);

				if (!!res.data.addressList) {
					var len = res.data.addressList.length;
					for (var i = 0; i < len; i++) {
						var payKindOut = ['水费','电费','燃气取暖'];
						var data = res.data.addressList[i];
						//  水电煤的号码，如水- 04
						var payKindClass = chargeType[feeTypeNum - 1];
						// 添加水电煤的class  如水的class  water
						data.payKindClass = payKindClass;
						// 添加DOM 中的水电煤类型  如'水费'
						var payKindOut = payKindOut[feeTypeNum - 1];
						// 让水电煤的类型代号连接起来
						data.payKindOut = payKindOut;
						data.payKind = payKind[feeTypeNum - 1];
						$(document).on('click', '.' + data.payKindClass, function(e) {
							var e = e || event;
							window.location.href = 'rechargeList.html' + '?payKind' + '=0' + data.payKind + '&provinceId=' + data.provinceId + '&cityId=' + data.cityId + '&institutionNo=' + data.institutionNo + '&institutionName=' + data.institutionName + '&billKey=' + data.billKey + '&instRmk1=' + data.instRmk1 + '&token=' + oToken;
						});
						$(document).on('click', '#addCharge', function(e) {
							var e = e || event;
							window.location.href = 'recharge.html' + '?payKind' + '=' + payKindNum + '&token=' + oToken;
						});
						if (!!data.billKey) {
							showFeeType(chargeType[feeTypeNum - 1]);
							$('#FeeCheck').append(microtemplate(rechargeInfoApi, data));
						}else {
							window.location.href = 'recharge.html';
						};
					};
				} else {
					$('#chargeFee').hide();
					$('#addCharge').show();
					$('#FeeCheck').hide();
					$(document).on('click', '#addCharge', function(e) {
						var e = e || event;
						window.location.href = 'recharge.html' + '?payKind' + '=' + payKindNum + '&token=' + oToken;
					});
				}
			}
		});
	});
	function showFeeType (feeTypeNum) {
		// 九宫格水电煤隐藏
		$('#chargeFee').hide();
		// 水电煤盒子整体div显示
		$('#FeeCheck').show();
		// 查询费用类型全部隐藏
		$('.water,.fire,.thunder').hide();
		//查询项显示
		$('.' + feeTypeNum).show();
		//添加项显示
		$('#addCharge').show();
	}
})();
