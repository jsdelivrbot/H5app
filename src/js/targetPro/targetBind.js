/**
 * Created by user on 2016/3/9.
 */
;(function () {
    /*URL接收参数*/
    var avatarUrl=url("?avatarUrl");
    var memberName=url("?memberName");
    var shareType=url("?shareType");
    var arg=url("?arg");
	var eventId;
	var wxstr;
	// 判断微信与否参数wxstr
	if(!isWeiXin()){
		wxstr = 0;
	};
	//获取验证码的配置参数
	var codeconfig = {

	};
	// 获取验证码 getcode
    $('.getCode').on('click',function() {
		var moblieNum=$.trim($('.moblie').val().replace(/\s/g,""));
		var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
		var timeCode = +new Date();
		var obj = {
			mobile:moblieNum,
			appID:'h5',
			t:timeCode,
		};
		var getSign = function (obj) {
			var keyName = [];
			var keyValue = [];
			for(var i in obj) {
				keyName.push(i);
			}
			keyName = keyName.sort();
			for(var i in keyName) {
				keyValue.push(obj[keyName[i]]);
			}
			keyValue.push('aDVfcGxhdGZvcm0=');
			var tempStr = keyValue.join('|');
			return md5(tempStr)
		};
		var signStr = getSign(obj);

		if(phoneReg.test(moblieNum)) {
		Counttime(60,$('.getCode'),this);
		$.ajax({
			url: '{{getCodeApi}}',
			dataType: 'json',
			data: {
				mobile:moblieNum,
				appID:'h5',
				t:timeCode,
				sign:signStr
			},
			type: 'post',
			async:false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function (res) {
				eventId = res.data.eventId
			},
			error:function () {
				toastError('验证码请求失败')
			}
		});
		}else{
			toastError('手机号输入有误！')
		};
	});

    $('.callDurationBtn').click(function(){
    	var phoneNumber=$.trim($('.moblie').val().replace(/\s/g,""));
    	var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    	var code=$('.code_value').val();
		phoneNumber1 = $.trim(phoneNumber.replace(/\s/g,""));
    	if(phoneReg.test(phoneNumber)){
			var wxdata =  {
				mobile:phoneNumber1,
				code:code,
				type:shareType,
				eventID:eventId,
				arg:arg
			};
			if(!isWeiXin()){
				wxdata.wxstr =0;
			};
    		if(code){
    		$.ajax({
	            url: '{{getResultDetailApi}}',
	            dataType: 'json',
	            data:wxdata,
	            type: 'post',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
	            success: function(res) {
	             jdb.hideLoading();
					if(isWeiXin()){
						if(res.error.returnCode == 0){
							if(res.data.redirectType){
								// 跳转问题 redirectType
								//console.log(res)
								//console.log(res.data.redirectType)
								window.location="targetDetail.html" +window.location.search +'&redirectType=' + res.data.redirectType;
							}
						} else if (res.error.returnCode == 503108 ) {
							window.location="index.html"+window.location.search;
						} else if (res.error.returnCode == 503109 ) {
							window.location="targetBind.html"+window.location.search;
						}else if (res.error.returnCode == 5001 ) {
							toastError('验证码输入有误！');
						} else {
							toastError('系统错误！');
						};
					} else {
						// 非微信
						if (res.error.returnCode == 0) {
							if(res.data.redirectType){
								window.location="targetDetail.html" +window.location.search + '&redirectType='+res.data.redirectType;
							}
						}else if (res.error.returnCode == 5001 ) {
							toastError('验证码输入有误！');
						} else {
							toastError('系统错误！');
						};
					}
				},
	            error: function () {
	                jdb.hideLoading();
	                toastError('服务器错误！')
	            }
            });
    	}else{
         toastError('请输入验证码');
    	}
    	}else{
    		toastError('手机号输入错误')
    	}
    });
    $(".moblie").on("keyup",function(e){
		var value = $('.moblie').val();
		if(typeof +value == 'number' && value.length ==11) {
			var reg = /^(\d{3})(\d{4})(\d{4})$/;
			var matches = reg.exec(value);
			var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3];
			$('.moblie').val(newNum);
		}
    });
	function Counttime(waitTime, o, _this) {
		if (waitTime == 0) {
			_this.removeAttribute("disabled");
			_this.innerHTML="获取验证码";
			waitTime = 60;
			authObj.code = 0;

		} else {
			_this.setAttribute("disabled", true);
			_this.innerHTML= waitTime + "s后重发";
			waitTime--;
			authObj.code = 1;

			setTimeout(function() {
					authObj.Counttime(waitTime, o, _this);
				},
				1000)
		}
	}
	if(isWeiXin()) {
		wxshare();
		function wxshare() {
			var wxurl = encodeURIComponent(location.href);
			var protocol = location.protocol || '';
			var avatar = 'http://rmw2.jdburl.com/other/img/share_120.png';
			var wxObj = {
				des:'借钱给我，获取收益，安全靠谱',
				title:'送你一个投资机会',
				url:wxurl
			};
			$.getJSON(protocol + '//tongji.jiedaibao.com/weixin/config?current_page_url='+ wxurl +'&app_id=wxaaf2e4fe16e38ba6', function (data) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature,// 必填，签名，见附录1
					// jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					jsApiList: [
						// 'onMenuShareTimeline',
						'onMenuShareAppMessage'
					]
				});

				wx.ready(function () {
					// 分享到朋友圈;
					// wx.onMenuShareTimeline({
					// 	title: wxObj.title, // 分享标题
					// 	desc: wxObj.des,
					// 	link: location.href, // 分享链接
					// 	imgUrl: avatar, // 分享图标
					// 	success: function () {
					// 		// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','success']);
					// 		// 用户确认分享后执行的回调函数
					// 	},
					// 	cancel: function () {
					// 		// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','cancel']);
					// 		// 用户取消分享后执行的回调函数
					// 	}
					// });
					// 分享给朋友
					wx.onMenuShareAppMessage({
						title: wxObj.title, // 分享标题
						desc: wxObj.des,
						link: location.href, // 分享链接
						imgUrl:avatar, // 分享图标
						success: function () {
							// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','success']);
							// 用户确认分享后执行的回调函数
						},
						cancel: function () {
							// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','cancel']);
							// 用户取消分享后执行的回调函数
						}
					});
				});

			});

		};
	};
	// 微信浏览器判断
	function isWeiXin(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	}
})();
