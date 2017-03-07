/**
 * Created by user on 2016/3/9.
 */
;(function () {
    /*URL接收参数*/
    var redirectType=url("?redirectType") || 1;
    if(redirectType!=1){
        $('.callDurationBtn').html("去借贷宝查看");
    }
    $('.targetPro-detail-text'+redirectType).show();
    var avatarUrl=url("?avatarUrl") || "../../img/rechargeFee/head.png";
    var memberName=url("?memberName") || "";
	$('#headImg').attr('src',avatarUrl);
	$('.mian-title').html(memberName);
    //下载借贷宝跳转问题
    $('.callDurationBtn').on('click',function(e){
        e.preventDefault();
        var ua = navigator.userAgent;
        if (ua.match(/ipad|ios|iphone/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/MicroMessenger/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/android/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else {
            location.href = 'http://www.jiedaibao.com/pcIndex.html';
        }
    })
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
                    //     title: wxObj.title, // 分享标题
                    //     desc: wxObj.des,
                    //     link: location.href, // 分享链接
                    //     imgUrl: avatar, // 分享图标
                    //     success: function () {
                    //         // _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','success']);
                    //         // 用户确认分享后执行的回调函数
                    //     },
                    //     cancel: function () {
                    //         // _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','cancel']);
                    //         // 用户取消分享后执行的回调函数
                    //     }
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
    };
})();
