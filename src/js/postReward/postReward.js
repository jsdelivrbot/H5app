/*by zhangling*/
var postReward = {
    datas:{
        "rewardID":"",
        "isActivity":0
    },
    init:function() {
        postReward.getUrl();
        postReward.getInfo();
        postReward.bindElvent('.load');
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
        var rewardID =  getQuery(window.location.href);
        postReward.datas =  $.extend(postReward.datas, rewardID);
    },
    getInfo: function () {
        var prString = require('postReward/postReward.string');
        var prWrongString = require('postReward/postRewardWrong.string');
        $.ajax({
            url: '{{postRewardApi}}',
            dataType: 'json',
            data: {
                rewardID:postReward.datas.rewardID,
                isActivity:postReward.datas.isActivity
            },
            type: 'post',
            success: function(res) {
                jdb.hideLoading();
                if (res.data.isShielded != 1) {
                    var res = res.data;
                    if(res.topicDetail.leftBonus||res.topicDetail.totalBonus){
                        var leftBonus = res.topicDetail.leftBonus;
                        var totalBonus = res.topicDetail.totalBonus;
                        if(leftBonus || totalBonus){
                            res.topicDetail.leftBonus = postReward.accountShow(leftBonus);
                            res.topicDetail.totalBonus = postReward.accountShow(totalBonus);
                        }
                    }
                    postReward.render(prString, res, '#xuanshang');
                    if(!!res.topicDetail.memberInfo.thumbnailUrl){
                        $('.xs_title_ico').css({
                            background: 'rgba(0,0,0,0) url('+ res.topicDetail.memberInfo.thumbnailUrl+') center center no-repeat',
                            backgroundSize: 'auto 100%'
                        })
                    } else{
                        $('.xs_title_ico').css({
                            background: "rgba(0,0,0,0) url('../../img/postReward/default.png') center center no-repeat",
                            backgroundSize: 'auto 100%'
                        })
                    }

                }else {
                    var res = res.data;
                    postReward.render(prWrongString, res, '#xuanshang');
                };
            },
            error: function () {
                jdb.hideLoading();
                toastError('服务器错误！')
            }
        });
    },
    render:function (prString,data,Dom) {
        var Dom = Dom || '#xuanshang';
        $(Dom).html(microtemplate(prString, data));
    },
    bindElvent:function(load) {
        $(load).on('click',function(){
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

    },
    accountShow:function (str){
        var strVal = +str;
        if(strVal>0&&strVal<100){
            if(Math.round(strVal) == strVal){
                return strVal;
            } else{
                return strVal.toFixed(2);
            }
        } else if (strVal>=100&&strVal<10000) {
            return Math.round(strVal)
        } else if (strVal>=10000&&strVal<1000000) {
            strVal = strVal/10000;
            if(Math.round(strVal) == strVal){
                return strVal+'万';
            } else{
                return strVal.toFixed(2) +'万';
            }
        } else if (strVal>=1000000&&strVal<100000000) {
            strVal = strVal/10000;
            return Math.round(strVal)+'万';
        } else if (strVal>=100000000) {
            strVal = strVal/100000000;
            return strVal.toFixed(2)+'亿';
        };
    }
};
$(postReward.init);
