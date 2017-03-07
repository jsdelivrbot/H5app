/**ssh root@100.73.16.42
 * Created by zhangling on 2016/3/21.
 */
var second = {
    imgUrl:'',
    wxconfig:{
        title:'送你借贷宝大礼包,最高28.88元快来抢!',
        des:'直投熟人更高明,玩转借贷钱生钱,我最高明!'
    },
    config:{
        Award:{
            memberID:'',
            productID:'',
            laundryID:'',
            appID:'',
            t:'',
            sign:''
        },
        urlObj:{
            url: window.location.hostname +'/h5app/partials/bigDraw/index.html',
            bindUrl: window.location.hostname +'/h5app/partials/bigDraw/second.html',
            show:''
        },
        string:['','<span><img src="../../img/bigDraw/good_hand.png" alt=""/><b class="bd_i_good">手气最佳</b></span>']
    },
    init:function () {

        var outer_open_id = $.fn.cookie('outer_open_id')|| '';
        var jdb_mobile = $.fn.cookie('jdb_mobile')||'';
        var auth_token = $.fn.cookie('auth_token')||'';
            authObj.init({
                 url: window.location.hostname +"/h5app/partials/bigDraw/index.html"+ url('query'),
                 bind_url:window.location.hostname +"/h5app/partials/bigDraw/second.html" + url('query'),
                 authorizer:"wechat"
             });
            authObj.checkAuth(function (res) {
                if (res.data.user_id){
                    second.getAward();
                    $('#bigDraw2').show();
                } else {
                    second.init()
                };
            }, second.config.urlObj.url + window.location.search, second.config.urlObj.bindUrl + window.location.search);
        //$('#bigDraw2').show();
        second.wxshare();
    },
    getUrl:function () {
        var getQuery=function(url){
            if(typeof url!=='string'){
                return null;
            }
            var query=url.match(/[^\?]+\?([^#]*)/,'$1');
            if(!query || !query[1]){
                return null;
            }
            var kv=query[1].split('&');
            var map={};
            for(var i=0,len=kv.length;i<len;i++){
                var result=kv[i].split('=');
                var key=result[0],value=result[1];
                //将"c="认为key为c，value为null，将"e"认为key为e，value为true
                map[key]=value || (typeof value=='string'?null:true);
            }
            return map;
        }
        var objUrl = url('?url');
        if(objUrl){
            var queryObj =  getQuery(objUrl);
        } else {
            var queryObj =  getQuery(window.location.href);
        }
        second.config.avatar  =  $.extend({},second.config.avatar, queryObj);
        second.config.Award  =  $.extend({},second.config.Award, queryObj);
    },
    getAward:function (){
        second.getUrl();
        var timeLabel = +new Date();
        var moblieValue = $('.mobile').val();
        var mbCookie = $.fn.cookie('jdb_mobile') || moblieValue;
        var obj = {
            mobile:mbCookie,
            voucherID:second.config.Award.voucherID,
            memberID:second.config.Award.memberID,
            t:timeLabel,
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
        var listArray = [];
        var paramData = {
                mobile:mbCookie,
                voucherID:second.config.Award.voucherID,
                memberID:second.config.Award.memberID,
                appID:'h5',
                t:timeLabel,
                sign:signStr
            };
        //如果是虚标，就添加 virtual 参数
        if(second.config.Award.virtual){
            paramData.virtual = second.config.Award.virtual;
        }
        //获取页面数据
        $.ajax({
            url: '{{getAwardApi}}',
            dataType: 'json',
            data: paramData,
            type: 'post',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(res) {
                if(res.error.returnCode === 0){
                    if(!!res.data.payInfo.avatar) {
                        objimg = {avatar:res.data.payInfo.avatar};
                        second.wxconfig = $.extend({}, second.wxconfig, objimg);
                    };
                    var tongjiText = '/h5app/bigDraw/统计立即使用按钮点击';//统计文案
                    var avatarStr = '<div class="bd_ico"><img src="'+res.data.payInfo.avatar+'" alt=""/></div><div class="bd_detail"><div><p class="bd_title">'+ res.data.payInfo.name+'</p><p class="bd_content">'+ res.data.payInfo.transactInfo+'</p></div></div>';
                    $('.bd_info').html(avatarStr);
                    //动态替换banner
                    var bannerUrl = res.data.bannerUrl || '../../img/bigDraw/bd_bg.jpg';
                    $('#bd_banner').css('backgroundImage','url('+bannerUrl+')');

                    if(res.data.couponInfo.status == 1){
                        var canUseString = '';
                        var strInfo = '';

                        if( (res.data.couponInfo.type === 1) && (res.data.couponInfo.minTradeAmount > 10)){

                            canUseString = '交易满<br/>' + res.data.couponInfo.minTradeAmount+ '元可用';
                        }

                        strInfo = '<p class="draw_txt">'
                            + res.data.couponInfo.name +
                            '</p><p class="draw_num"><em>'
                            + res.data.couponInfo.content +
                            '</em><span>'
                            + canUseString +
                            '</span></p><p class="draw_tip"><img src="../../img/bigDraw/bg_tip.png" alt=""/>'
                            + res.data.couponInfo.useRule +
                            '</p>';

                        $('.draw_content').html(strInfo);

                        //button 上方的提示文案
                        var tip_text = '';
                        if(res.data.couponInfo.type === 5){

                            var identified = res.data.identified;
                            if(identified === 1){
                                tip_text = '已放入借贷宝账户' +res.data.mobile+ '<br/>可在钱包-余额中查看';
                            }else{
                                tip_text = '已放入借贷宝账户' +res.data.mobile+ '<br/>可在钱包-红包卡券中查看';
                            }

                        }else if(res.data.couponInfo.type === 3){
                            tip_text = '';
                        }else{
                            tip_text = '可在钱包-红包卡券中查看';
                        }

                        $('#tip_text').html(tip_text);

                    } else{
                        var strInfo = '<p class="gameOver">手慢了，红包派完了</p>';
                        $('.draw_content').html(strInfo);
                        $('.bd_bt_a').html('下载借贷宝');
                        tongjiText = '/h5app/bigDraw/统计下载按钮点击';//统计文案
                    };

                    $('.bd_bt_a').click(function(){
                        _hmt.push(['_trackEvent', tongjiText ]);//下载按钮点击统计
                    });

                    var awardList = res.data.awardList;
                    $.each(awardList, function (index) {
                        var listObj = awardList[index];
                        var avatar = listObj.avatar || '../../img/bigDraw/default.png';
                        // 礼包被抢完后，再显示“手气最佳”
                        var isBestString = res.data.total === res.data.sent ? second.config.string[listObj.isBest] : '';
                        var name = listObj.name;
                        name = name.length > 4 ? name.substr(0,4) + '...' : name;

                        listArray.push(
                            '<li><div class="bd_info_left"><img src="'
                            + avatar+
                            '" alt=""/></div><div class="bd_info_right"><p>'
                            + name +
                            '<span class="b_i_r_c">'
                            + listObj.content+
                            '</span></p><p><em>'
                            + listObj.awardTime+
                            '</em>'
                            + isBestString +
                            '</p></div></li>'
                        );
                    });

                    $('.redBag_info_title').html(res.data.awardInfo);
                    $('.listMap').html(listArray.join(''));
                    $('.bd_bind').hide();
                    $('.drawDetail').show();
                    $('.share_bg ').show();
                    $('.redBag_info').show();
                    (function(){
                        var _hmt = _hmt || [];

                        var hm = document.createElement("script");
                        hm.src = "https://hm.baidu.com/hm.js?b65227112318be3ab7c8c12a81815fd7";
                        var s = document.getElementsByTagName("script")[0];
                        s.parentNode.insertBefore(hm, s);
                    })();
                }else if(res.error.returnCode === 503108) {
                    authObj.init({
                        url:window.location.hostname + "/h5app/partials/bigDraw/index.html"+ url('query'),
                        bind_url:window.location.hostname + "/h5app/partials/bigDraw/second.html" + url('query'),
                        authorizer:"wechat"
                    })

                    authObj.checkAuth(function (res) {
                        if (res.data.user_id){
                            second.getAward();
                            $('#bigDraw2').show();
                        }
                    }, second.config.urlObj.url + window.location.search, second.config.urlObj.bindUrl + window.location.search);
                }else{
                    toastError(res.error.returnMessage);
                };

            },
            error:function (res) {
                toastError('服务器错误！');
            }
        });
    },
    render:function (prString,data,Dom) {
        var Dom = Dom || '.bd_info';
        $(Dom).html(microtemplate(prString, data));
    },
    wxshare:function () {
        var wxurl = encodeURIComponent(location.href);
        var protocol = location.protocol || '';
        second.wxconfig.avatar = second.wxconfig.avatar || 'https://rmw2.jdburl.com/other/img/share_zlnew.png';
        var wxObj = {
            title:second.wxconfig.title,
            des:second.wxconfig.des,
            url:wxurl
        };
        $.getJSON(protocol + '//tongji.jiedaibao.com/weixin/config?current_page_url='+ wxurl +'&app_id=wxc9a3c8c03a7fd87c', function (data) {
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

                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: wxObj.title, // 分享标题
                    desc: wxObj.des,
                    link: location.href, // 分享链接
                    imgUrl: second.wxconfig.avatar, // 分享图标
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

    }
};
second.init();
//second.getAward();  //这里用于调试时打开
