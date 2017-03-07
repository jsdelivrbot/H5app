/**
 * Created by user on 2016/3/21.
 */
var index = {
    imgUrl:'',
    wxconfig:{
        title:'借贷宝发大红包，抢起来！',
        des:'红包不多，先到先得！'
    },
    config:{
        avatar:{
            memberID:'',
            productID:'',
            appID:'',
            type:'',
            orderID:''
        }
    },
    init:function() {
        index.getAvatar();
        index.bindEvent();
        index._moblieReg('.moblie');
        index.wxshare();
        var display = navigator.userAgent.toLowerCase().indexOf('iphone') >= 0 ? 'block' : 'none';
        $("#apple_rule").css('display',display);
    },
    _moblieReg:function(elem, errmsg){
        $(elem).on('keyup',function(){
            var value = $(elem).val();
            if(typeof +value == 'number' && value.length ==11){
                var reg = /^(\d{3})(\d{4})(\d{4})$/;
                var matches = reg.exec(value);
                var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3];
                $(elem).val(newNum);
                authObj.init({
                        url: window.location.hostname +"/h5app/partials/bigDraw/index.html" + window.location.search,
                        bind_url: window.location.hostname +"/h5app/partials/bigDraw/second.html" + window.location.search,
                        authorizer:"wechat"
                });
                authObj.codeMa('.getCode', '.moblie');
                authObj.bind('.bd_btn','.moblie','','.code_value',function(){
                    window.location.replace('https://' + authObj.params.url);
                })
            };
        })
    },
    bindEvent:function () {
        //点击，弹层打开;
        $('.bd_rule').on('tap',function(){
            $('.mask').show();
        })
        $(document).on('touchstart', function (){
            $('.mask').hide();
        })
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
        index.config.avatar  =  $.extend({},index.config.avatar, queryObj);
        index.config.Award  =  $.extend({},index.config.Award, queryObj);
    },
    getAvatar:function () {
        index.getUrl();
        var getAvatarString = require('bigDraw/getAvatar.string');
        var paramData = {
            memberID:index.config.avatar.memberID,
            productID:index.config.avatar.productID,
            orderID:index.config.avatar.orderID,
            type:index.config.avatar.type,
            voucherID:index.config.avatar.voucherID
        };
        //如果是虚标，就添加 virtual 参数
        if(index.config.avatar.virtual){
            paramData.virtual = index.config.avatar.virtual;
        }
        $.ajax({
            url: '{{getAvatarApi}}',
            dataType: 'json',
            data: paramData,
            type: 'post',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,

            success: function(res) {
                if(!res.data){ 
                    toastError(res.error.returnMessage);
                    return false;
                }
                if(!!res.data.personInfo && !!res.data.personInfo.avatar) {
                    objimg = {avatar:res.data.personInfo.avatar};
                    index.wxconfig = $.extend({}, index.wxconfig, objimg);
                };
                //动态替换banner
                var bannerUrl = res.data.bannerUrl || '../../img/bigDraw/bd_bg.jpg';
                $('#bd_banner').css('backgroundImage','url('+bannerUrl+')');
                $('#bigDraw').show();
                index.render(getAvatarString,res);
                
            },
            error:function (res) {
                //toastError('服务器错误！')
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
         index.wxconfig.avatar = index.wxconfig.avatar || 'https://rmw2.jdburl.com/other/img/share_zlnew.png';
        var wxObj = {
            des:index.wxconfig.des,
            title:index.wxconfig.title,
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
                    'onMenuShareTimeline','onMenuShareAppMessage'
                ]
            });

            wx.ready(function () {
                // 分享到朋友圈;
                // 由于某种原因 ，去掉了。
                // wx.onMenuShareTimeline({
                //     title: wxObj.title, // 分享标题
                //     desc: wxObj.des,
                //     link: location.href, // 分享链接
                //     imgUrl: index.wxconfig.avatar, // 分享图标
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
                    imgUrl:index.wxconfig.avatar, // 分享图标
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
$(index.init());
