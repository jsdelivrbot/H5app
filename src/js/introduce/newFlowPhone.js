/*guofei write*/

;(function () {
    var resJson;
    var jinzhi = 1;

    //安卓重新加载
    window.onBackPressed = function(){
        window.location.reload();
    };


    /*URL参数*/
    var parameter = {
        memberId : url('?memberID'),
        mobile : url('?mobile'),
        clientVersion : url('?clientVersion'),
        investUrl : null,
        investTitle : null,
        investShareImgUrl : null,
        investMessageID : null
    };


    if( parameter.memberId && parameter.mobile ){
        $('body').css('fontSize', '12px');
        $('.oClick,.firstBnt').show();
        $('.wrapSecond').hide();
        if (parameter.clientVersion) {
            $('.sign').show();
            $('.investNew').show();
            $('.investOld').hide();
            //端上签到状态scheme
            location.href = 'https://native.jiedaibao.com/web2Native/requestSignInStatus';
        }
    }
    function getTimeAjax () {
        var surplusObj = {
            memberID: parameter.memberId,
            noAvatar: 1  //是否需要头像(默认需要) 0 需要 1 不需要
        };
        $.ajax({
            url: '{{flowPhoneApi}}',
            type: 'post',
            dataType: 'json',
            data: surplusObj,
            success: function (jsonData) {
                if (jsonData.error.returnCode == '10002') {
                    toastError('非法访问');
                } else if (jsonData.error.returnCode == '10011') {
                    toastError('查询失败，请稍后重试');
                }
                var surplusTime = jsonData.data.timeLength;
                surplusTime = surplusTime/60;
                if (surplusTime > 9999) {
                    surplusTime = Math.floor(surplusTime/60);
                    $('.surplusMins').html('<span style="font-weight: 300;">' + surplusTime + '</span><br>小时剩余时长');
                    if (surplusTime > 9999) {
                        $('.surplusMins span').css('fontSize', '30px');
                        if (surplusTime > 99999) {
                            $('.surplusMins span').css('fontSize', '28px');
                        }
                    }

                }else {
                    surplusTime = Math.floor(surplusTime);
                    $('.surplusMins span').html(surplusTime);
                }

                return surplusTime;
            }
        });
    }
    getTimeAjax();




    function investmentAjax () {
        var investmentObj = {
            start: 0, //分页请求，默认值为0，每次请求的是最后一个messageID
            limit: 10  //请求的文章个数
        };
        $.ajax({
            url: '{{investmentApi}}',
            type: 'get',
            dataType: 'json',
            //data: investmentObj,
            success: function (jsonData) {
                var investData = jsonData.data.activityStategyList;
                var investFirst = investData[0];
                var investNew = null;
                for (var i = 1; i < investData.length; i++) {
                    if (investData[i].messageID >investFirst.messageID) {
                        investNew = investData[i];
                    }else {
                        investNew = investFirst;
                    }
                }

                parameter.investUrl = encodeURIComponent(investNew.contentUrl);
                parameter.investTitle = investNew.title;
                parameter.investShareImgUrl = encodeURIComponent(investNew.shareImgUrl);
                parameter.investMessageID = investNew.messageID;

            }
        });
    }
    investmentAjax();


    /*
     * 首次点击“去分享”，通过scheme，获取端的cookie数据，弹出弹窗
     * 点击弹窗里的确定，则跳转到投资有道
     * 非首次点击“去分享”，则直接跳转到投资有道
     * */
    $('.investmentLink').on('click', function() {
        location.href = 'https://native.jiedaibao.com/web2Native/requestStorageValue?key=investmentCookie&type=0';
    });

    //禁止滑动屏幕
    document.addEventListener('touchmove', function(e){
        if(jinzhi == 0){
            e.preventDefault();
            e.stopPropagation();
        }
    },false);



    /*跳转到充值时长页面并传递参数*/
    $('#rechargeTime').on('click', function(e) {
         // toastError(
         //    {
         //        type: 'success',
         //        text: '由于业务调整，暂停充值服务，您可以继续使用剩余免费电话时长',
         //        ms: 2500,
         //        callback: undefined
         //    });
        window.dialog.alert('由于业务调整，暂停充值服务，您可以继续使用剩余免费电话时长')
         return;
        e.preventDefault();
        location.href = '../rechargeFee/flowRecharge.html' + '?memberID=' + parameter.memberId + '&mobile=' + parameter.mobile;
    });
    /*显示通用分享*/
    $('.invitation').on('click', function(e) {
        e.preventDefault();
        ShareFriends.open();
    });
    $('.oClick').click(function () {
        $('#shareModal').hide();
    });

    /*电话号码转换*/
    var convertTo32 = function(num) {
        var phoneNum = parseInt(num);
        if (isNaN(phoneNum)) {
            return;
        }
        if (/^1\d{10}$/.test(phoneNum + '')) {
            var search = {I: 'W', L: 'X', O: 'Y', S: 'Z'};
            var icode = phoneNum.toString(32).toUpperCase();
            for (var i in search) {
                if (search.hasOwnProperty(i)) {
                    icode = icode.replace(new RegExp(i, 'g'), search[i]);
                }
            }
            return icode;
        } else {
            return;
        }
    };
    var icode = convertTo32(parameter.mobile);
    ShareFriends.init({
        shareImg: '', // icon地址
        shareUrl: 'https://rmw.jdburl.com/conRank/?icode=' + icode,// 分享链接
        shareContent: { //内容
            sms: {
                shareTitle: '',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长！详情猛戳{{shareUrl}}'
            },
            wxfeed: {
                shareTitle: '',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长'
            },
            wxmsg: {
                shareTitle: '借贷宝送您免费通话时长啦',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长'
            },
            qq: {
                shareTitle: '',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长'
            },
            qqzone: {
                shareTitle: '借贷宝送您免费通话时长啦',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长'
            },
            weibo: {
                shareTitle: '',
                shareText: '我在借贷宝用专线电话，清晰稳定，一起来用吧~送你300分钟免费通话时长！详情猛戳{{shareUrl}}'
            }
        }
    });

    //cookie端存储回调
    window.storageCallback = function (res) {
        //alert(res);
        var cookie;
        if (typeof res == 'string') {
            cookie = JSON.parse(res);
        } else {
            cookie = res;
        }
        //alert(cookie.value);
        if (cookie.value != undefined) {
            location.href = 'https://native.jiedaibao.com/web2Native/investmentDetail?url=' + parameter.investUrl + '&title=' + parameter.investTitle + '&shareImgUrl=' + parameter.investShareImgUrl +'&messageID=' + parameter.investMessageID;
        }else {
            $('.gray, .investmentBox').css('display', 'block');
            $('.gray').on('click', function() {
                $('.gray, .investmentBox').css('display', 'none');
                jinzhi = 1;
            });
            $('.investmentBox a').on('click', function () {
                location.href = 'https://native.jiedaibao.com/web2Native/investmentDetail?url=' + parameter.investUrl + '&title=' + parameter.investTitle + '&shareImgUrl=' + parameter.investShareImgUrl +'&messageID=' + parameter.investMessageID;
                $('.gray, .investmentBox').css('display', 'none');
                jinzhi = 1;
                cookie = parseInt(Math.random()*1000000000);
            });
            jinzhi = 0;
            location.href = 'https://native.jiedaibao.com/web2Native/storage?key=investmentCookie&value=1234567890&type=0';
        }
    };



    //签到弹出框回调
    window.signCallback = function (res) {
        //参数为数字类型： 1 为已签到， 0 为未签到scheme

        if (typeof res === 'string') {
            resJson = JSON.parse(res);
        } else {
            resJson = res;
        }
        if (resJson.signInStatus == 1) {
            $('.signGo').html('已签到').css('color', '#afcbee');
            getTimeAjax();
        } else if (resJson.signInStatus == 0) {
            $('.signGo').html('去签到');
            $('.signGo').on('touchstart', function () {
                location.href = 'https://native.jiedaibao.com/web2Native/dailySignIn';
            });
        }

    };

    //投资有道分享回调
    window.shareCallback = function (res) {
        //参数为布尔类型： true 为已分享+分钟， false 为未分享不+分钟
        var resJson;
        if (typeof res === 'string') {
            resJson = JSON.parse(res);
        } else {
            resJson = res;
        }
        if (resJson == true) {
            getTimeAjax();
        }
    };


})();
