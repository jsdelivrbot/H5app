/**
 * Created by user on 2016/3/9.
 */
 if(location.hostname === 'app.jiedaibao.com'){
    location.hostname = 'app.jiedaibao.com.cn';
}
;(function () {
    /*URL接收参数*/
    var arg=url("?arg") || "7A19C9713C5D1F8472560D870D787C5AE804D08E28AA79247FF655347676BBEC75276E27BBB05AAE73326DA17BC10A89";
    var appKey=url("?appKey") || "fb371c48e9a9b2a1174ed729ae888513";
    var shareType=url("?shareType") || 1;
	var avatarUrl,
		memberName,
   		res,
		sharerate,
		wxstr,
		shareTitle,
		shareTitle1,
		sharedes;
	var parms = {
		"arg":arg,
		"appKey":appKey
	};
	var wxconfig = {
		initurl:{
			url:window.location.hostname + "/h5app/partials/targetPro/index.html?"+ url('query'),
			bindUrl:window.location.hostname + "/h5app/partials/targetPro/targetBind.html?" + url('query')
		}
	};
	// 判断微信与否参数wx
	if(!isWeiXin()){
		wxstr = 0;
		parms.wxstr =0;
	};
    $.ajax({
            url: '{{getPersonalInfoApi}}',
            dataType: 'json',
            data: parms,
            type: 'post',
            success: function(result) {
                jdb.hideLoading();
	            if (typeof result === 'string') {
	                result=JSON.parse(result).data;
	            };
	            res=result.data;
				if(res){
					shareTitle = '给你一个年利率'+ res.rate +'%的理财机会';
					shareTitle1 = '给你一个年利率'+ res.rate +'%的理财机会。借钱给我，可以赚'+ res.rate +'%利息，轻松理财又安全';
					sharedes = '借钱给我，可以赚'+res.rate+'%利息，轻松理财又安全';
					sharerate =res.rate;
					if((res.rate/4.42)>1){
						$('.zenking').html(parseFloat(res.rate/4.42).toFixed(1));
					}else{
						$('.btn_tip').html('借钱给我，可以赚'+'<em>'+res.rate+'</em>' +'%利息，轻松理财又安全');
					};
				}
	            if(res.avatarUrl){
	              $('#headImg').attr('src',res.avatarUrl);
					avatarUrl = res.avatarUrl;

	            }else{
	               $('#headImg').attr('src','../../img/rechargeFee/head.png');
					avatarUrl = '../../img/rechargeFee/head.png';
	            }
	            if(res.memberName){
	             $('#member-name').html(res.memberName);
					memberName = res.memberName;
	            }else{
	             $('#member-name').html('某某某');
					memberName = '某某某';
	            }   
	            if(res.context){
	              $('.main-context').html(res.context);	
	            }
	            if(res.amount){
	            	$('.rent-amount').html(parseFloat(res.amount).toFixed(1)+"<em>元</em>");
	            } 
	            if(res.rate){
	            	$('.rent-rate').html(parseFloat(res.rate).toFixed(1)+"<em>%</em>");
	            };
				if(isWeiXin()) {
					wxshare();
					function wxshare() {
						var wxurl = encodeURIComponent(location.href);
						var protocol = location.protocol || '';
						var avatar = 'http://rmw2.jdburl.com/other/img/share_120.png';
						var wxObj = {
							des:sharedes,
							title:shareTitle,
							title1:shareTitle1,
							url:wxurl
						};
						$.getJSON(protocol + '//tongji.jiedaibao.com/weixin/config?current_page_url='+ wxurl +'&app_id=wxb94031e4971ddfa7', function (data) {
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: data.appId, // 必填，公众号的唯一标识
								timestamp: data.timestamp, // 必填，生成签名的时间戳
								nonceStr: data.nonceStr, // 必填，生成签名的随机串
								signature: data.signature,// 必填，签名，见附录1
								// jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
								jsApiList: [
									'onMenuShareTimeline','onMenuShareAppMessage'
								]
							});

							wx.ready(function () {
								// 分享到朋友圈;
								wx.onMenuShareTimeline({
									title: wxObj.title1, // 分享标题
									desc: wxObj.des,
									link: location.href, // 分享链接
									imgUrl: avatar, // 分享图标
									success: function () {
										// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','success']);
										// 用户确认分享后执行的回调函数
									},
									cancel: function () {
										// _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','cancel']);
										// 用户取消分享后执行的回调函数
									}
								});
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
            },
            error: function () {
                //jdb.hideLoading();
                toastError('服务器错误！')
            }
        });
    $('.callDurationBtn').click(function(){
		//判断微信环境进行授权逻辑
			if(isWeiXin()){
				// 判断是否授权接口
				var outer_open_id = $.fn.cookie('outer_open_id')|| '';
				var auth_token = $.fn.cookie('auth_token')||'';
				$.ajax({
					url: '{{getResultDetailApi}}',
					dataType: 'json',
					data: {
						outer_open_id:outer_open_id,
						auth_token:auth_token,
						type:shareType,
						arg:arg
					},
					type: 'post',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					success: function (res) {
						if(res.error.returnCode == 0){
							window.location.href="targetDetail.html?redirectType="+res.data.redirectType+"&avatarUrl="+avatarUrl+"&memberName="+memberName+"&sharerate=" + sharerate;
						} else if (res.error.returnCode == 503108 ) {
							// 授权 初始化
							authObj.init({
								url: window.location.hostname +"/h5app/partials/targetPro/index.html"+ window.location.search,
								bind_url: window.location.hostname +"/h5app/partials/targetPro/targetBind.html" + window.location.search,
								authorizer:"wechat"
							});
							// 授权checkauth
							authObj.checkAuth(function () {
							}, window.location.hostname +"/h5app/partials/targetPro/index.html" + window.location.search,window.location.hostname +"/h5app/partials/targetPro/targetBind.html" + window.location.search);
						} else if (res.error.returnCode == 503109 ) {
							window.location="targetBind.html?avatarUrl="+res.avatarUrl+"&memberName="+res.memberName+"&arg="+arg+"&shareType="+shareType+"&sharerate=" + sharerate;
						} else if (res.error.returnCode == 5001 ) {
							toastError('验证码输入有误！');
						} else {
							toastError('系统错误！');
						};;
					},
					error:function () {
						toastError('请求失败')
					}
				})
			} else {
				window.location="targetBind.html?avatarUrl="+res.avatarUrl+"&memberName="+res.memberName+"&arg="+arg+"&shareType="+shareType+"&sharerate=" + sharerate;
			};
    });
	// 微信浏览器判断
	function isWeiXin(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	};

})();
