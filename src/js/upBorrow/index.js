(function() {
    //获取url参数
    var memberID = url('?memberID');
    var productID = url('?productID');
    var orderID = url('?orderID');
    var key = url('?key');
    var type = url('?type');
    var isBorrowNow = true;
    var thePostData = {};
    var getParams = function() {
        var paramsObj = {};
        var paramsArr = location.search.substr(1).split('&');
        paramsArr.forEach(function(item) {
            paramsObj[item.split('=')[0]] = item.split('=')[1];
        });
        return paramsObj;
    };
    var getParamsData = getParams();
    $.ajax({
        url: '{{getTradeInfoApi}}',
        type: 'post',
        data: getParamsData,
        dataType: 'json',
        success: function(res) {
            if (res.error.returnCode == 0) {
                var getData = res.data;
                $('#share_title').html(getData.text.shareTitle);
                $('.head_desc').html(getData.text.shareText);
                if (getData.loanData.status == 1) {
                    //借款中
                    isBorrowNow = true;
                    //new
                    $('.borrow_me_desc').css('margin-bottom', '15px');
                } else if (getData.loanData.status == 2) {
                    //是否已结束
                    isBorrowNow = false;
                    $('#borrow_state').removeClass();
                    $('#borrow_state').addClass('desc_top_bg_alreday_end');
                } else if (getData.loanData.status == 3) {
                    //是否已抢光
                    isBorrowNow = false;
                    $('#borrow_state').removeClass();
                    $('#borrow_state').addClass('desc_top_bg_alreday_no');
                }
                //用户名
                $('.head_right h2').html(getData.memberInfo.userName);
                //用户头像
                if (getData.memberInfo.thumbnail_url) {
                    $('.head_img').css('background-image', 'url(' + getData.memberInfo.thumbnail_url + ')');
                } else {
                    $('.head_img').css('background-image', 'url(../../img/upBorrow/default_head.png)');
                }

                //借款总笔数
                //平均利息
                //为好友创造收益
                if (isBorrowNow) {
                    // if(getData.statics.totalCount==1||getData.statics.totalAmount<10){
                    //  $('.head_desc').html('银行存款利息低，理财产品有风险，不如直接投给我');
                    // }else{
                    //  $('.head_desc').html('我已借款'+getData.statics.totalCount+'笔，为好友创造'+getData.statics.totalAmount+'元收益。');
                    // }

                    //是否显示10元起借
                    $('.borrow_me').css('visibility', 'visible');
                    // if(getData.loanData.amount<10){
                    //  $('.borrow_me').css('visibility','hidden');
                    // }else{
                    //  $('.borrow_me').css('visibility','visible');
                    // }
                    //是否显示预期收益多少元

                    if (getData.loanData.earnings > 0) {
                        $('.borrow_me_desc').html(getData.text.footerB);
                        $('.borrow_me_desc').css('visibility', 'visible');
                        $('.borrow_me').css('visibility', 'hidden');
                    } else {

                        $('.borrow_me').css('margin-bottom', '10px');
                        $('.borrow_me_desc').css('display', 'none');
                    }
                    $('.add_friends').html('借给TA 赚利息');
                } else {
                    // if(getData.loanData.rate>3){
                    //  $('.head_desc').html('借款利率高达'+getData.loanData.rate+'%，1年相当于银行'+parseInt(getData.loanData.rate/1.5)+'年的利息。');
                    // }else{
                    //  $('.head_desc').html('银行存款利息低，理财产品有风险，不如直接投给我');
                    // }
                    $('.borrow_me').css('visibility', 'hidden');
                    $('.borrow_me_desc').html(getData.text.footerA);
                    $('.borrow_me_desc').css('visibility', 'visible');
                    $('.borrow_me_desc').css('margin-bottom', '15px');
                    $('.add_friends').html('关注TA的借款');
                }

                //借款利率
                $('.desc_rate').html(getData.loanData.rate + '<span>%</span>');
                //借款金额
                $('.desc_borrow span').html(filterAmount(getData.loanData.amount));
                //借款期限
                $('.desc_day span').html(getData.loanData.term);

            } else {
                toastError(res.error.returnMessage);
            }
        },
        error: function() {
            toastError('系统错误！');
        }
    });
    $('#mobile').on('keyup', function(ev) {
        $('#correct_num').css('visibility', 'hidden');
        var val = $("#mobile").val();
        var oEvent = ev || event;
        if (oEvent.keyCode == 8) {
            if (val) {
                for (var i = 0; i < val.length; i++) {
                    var newStr = val.replace(/\s$/g, '');
                }
                $("#mobile").val(newStr);
            }
        } else {
            if (val == null || val == "" || val.length == 0) return;
            if (val.length == 3 || val.length == 8) {
                val = val + ' ';
                $("#mobile").val(val);
            } else {
                if ((val.length == 4 || val.length == 9) && val.charAt(val.length - 1) != ' ') {
                    var temp = val.charAt(val.length - 1);
                    val = val.slice(0, val.length - 1);
                    val = val + " " + temp;
                    $("#mobile").val(val);
                } else {
                    return;
                }
            }
        }
    });
    var mobile = $('#mobile').val();
    var message = $('#re_captha').val();
    var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
    var regMessage = /^\d{6}$/;
    var changeMobile = mobile.replace(/\s/g, '');
    var timer = null;
    var flag = true;
    var eventId;
    var getmdMobile;
    var getMobile;

    function getDownloadUrl() {
        var ua = navigator.userAgent;
        var url = '';
        if (ua.match(/ipad|ios|iphone/i)) {
            url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/MicroMessenger/i)) {
            url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/android/i)) {
            url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else {
            url = 'http://www.jiedaibao.com/pcIndex.html';
        }
        return url;
    }
    $('.download').attr('href', getDownloadUrl);

    function getMessage(getMessageClass) {

        var timeCode = +new Date();
        var obj = {
            mobile: changeMobile,
            appID: 'h5',
            t: timeCode,
        };
        var getSign = function(obj) {
            var keyName = [];
            var keyValue = [];
            for (var i in obj) {
                keyName.push(i);
            }
            keyName = keyName.sort();
            for (var i in keyName) {
                keyValue.push(obj[keyName[i]]);
            }
            keyValue.push('aDVfcGxhdGZvcm0=');
            var tempStr = keyValue.join('|');
            return md5(tempStr)
        };
        var signStr = getSign(obj);
        if (flag) {
            mobile = $('#mobile').val();
            changeMobile = mobile.replace(/\s/g, '');
            if (mobile) {
                if (reg.test(changeMobile)) {
                    var seconds = 60;
                    timer = setInterval(function() {
                        flag = false;
                        if (seconds < 0) {
                            $('.get-message').val('获取验证码');
                            clearInterval(timer);
                            flag = true;
                        } else {
                            $('.get-message').val(seconds + "s后重发");
                            seconds--;
                        }
                    }, 1000);
                    thePostData = $.extend({
                        mobile: changeMobile,
                        appID: 'h5',
                        t: timeCode,
                        sign: signStr
                    }, getParamsData);
                    $.ajax({
                        url: '{{getPhoneCodeApi}}',
                        dataType: 'json',
                        data: thePostData,
                        type: 'post',
                        success: function(res) {
                            eventId = res.data.eventId
                        },
                        error: function(res) {
                            toastError('验证码请求失败')
                        }
                    });
                } else {
                    $('#correct_num').css('visibility', 'visible');
                }
            } else {
                $('#correct_num').css('visibility', 'visible');
            }

        }
    }

    function postRequest(thePostData) {
        $.ajax({
            url: '{{bindProductApi}}',
            dataType: 'json',
            data: thePostData,
            type: 'post',
            success: function(res) {
                jdb.hideLoading();
                if (res.error.returnCode == 0) {
                    $('.wrapper').hide();
                    $('.follow').show();

                    getData = res.data;
                    getmdMobile = getData.mdMobile;
                    getMobile = getData.mobile;
                    var Days = 90;
                    var exp = new Date();
                    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                    $.fn.cookie('mdMobile', getmdMobile, { expires: exp });
                    $.fn.cookie('mobile', getMobile, { expires: exp });
                    $('.bind_mobile_num').html('当前绑定手机号 ' + getData.mobile);
                    if (getData.resultNo == 0) {
                        //关注成功
                        if (isBorrowNow) {
                            $('.follow_guide').html('登录借贷宝完成出借');
                            $('.follow_guide_detail').html('在借贷宝首页即可查看该借款详情');
                        } else {
                            $('.follow_guide').html('关注成功');
                            $('.follow_guide_detail').html('登录借贷宝即可查看');
                        }

                    } else if (getData.resultNo == 1) {
                        $('.follow').hide();
                        flag = true;
                        clearBox();
                        toastError('不能借给自己哦');
                    } else if (getData.resultNo == 2) {
                        //客态关注人数已满
                        $('.follow_guide').html('您关注的人数已爆表');
                        $('.follow_guide_detail').html('忍痛取消部分关注，再来试试把～');
                    } else if (getData.resultNo == 3) {
                        //主态粉丝数已满
                        //判断是正在借款页分享出来的还是借款结束页分享出来的

                        if (isBorrowNow) {
                            $('.follow_top_bg').css('background-image', '../../img/upBorrow/how_borrow.png');
                            $('.follow_guide').html('如何借给TA?');
                            $('.follow_guide_detail').html('登录借贷宝关注TA，即可出借');
                        } else {
                            $('.follow_top_bg').css('background-image', '../../img/upBorrow/follow_full.png');
                            $('.follow_guide').html('关注TA的人已达上限');
                            $('.follow_guide_detail').html('登录借贷宝看看其他借款吧');
                        }

                    } else if (getData.resultNo == 5) {
                        if (isBorrowNow) {
                            $('.follow_guide').html('登录借贷宝完成出借');
                            $('.follow_guide_detail').html('在借贷宝首页即可查看该借款详情');
                            //isBorrowNow=true;
                        } else {
                            $('.follow_guide').html('已经关注TA了 无需重复关注');
                            $('.follow_guide_detail').html('登录借贷宝即可查看');
                        }
                    }
                    if (getData.followStatus == 3) {
                        if (isBorrowNow) {
                            $('.follow_guide').html('登录借贷宝完成出借');
                            $('.follow_guide_detail').html('在借贷宝首页即可查看该借款详情');
                        } else {
                            $('.follow_guide').html('已经关注TA了 无需重复关注');
                            $('.follow_guide_detail').html('登录借贷宝即可查看');
                        }
                    }

                } else if (res.error.returnCode == 503001) {
                    $('.wrapper').hide();
                    $('.follow').show();
                    $('.follow_guide').html('去借贷宝关注TA的借款');
                    $('.follow_guide_detail').html('');
                    $('.download').html('下载借贷宝');
                    $('.bind_mobile_num').html('当前绑定手机号 ' + changeMobile);
                } else if (res.error.returnCode == 200002) {
                    $('#correct_message').css('visibility', 'visible');
                } else {
                    toastError('系统错误！');
                }
            },
            error: function(res) {
                jdb.hideLoading();
                toastError('服务器错误！')
            }
        });
    }

    function submitFollow() {
        mobile = $('#mobile').val();
        changeMobile = mobile.replace(/\s/g, '');
        message = $('#re_captha').val();
        //判断手机号是否为空
        if (mobile) {
            //判断手机号是否符合格式
            if (reg.test(changeMobile)) {
                //判断验证码是否为空
                if (message) {
                    //判断验证码是否格式正确
                    if (regMessage.test(message)) {
                        thePostData = $.extend({
                            mobile: changeMobile,
                            code: message,
                            eventId: eventId,
                            friendId: memberID,
                            productId: productID
                        }, getParamsData);
                        postRequest(thePostData);
                    } else {
                        $('#correct_message').css('visibility', 'visible');
                    }
                } else {
                    $('#correct_message').css('visibility', 'visible');
                }
            } else {
                $('#correct_num').css('visibility', 'visible');
            }

        } else {
            $('#correct_num').css('visibility', 'visible');
        }
    }

    function clearBox() {
        clearInterval(timer);
        $('.get-message').val('获取验证码');
        $('#correct_message').css('visibility', 'hidden');
        $('#correct_num').css('visibility', 'hidden');
        $('#mobile').val('');
        $('#re_captha').val('');
    }

    function filterAmount(num) {
        var numArr = num.split('');
        var numArr2 = numArr.reverse();
        var numResu = [];
        for (var i = 0; i < numArr2.length; i++) {
            if (numArr2.length > 3) {
                var numMidd = numArr2.splice(0, 3);
                numMidd.push(',');
                numResu = numResu.concat(numMidd);
                i -= 3;
            } else {
                var numMidd = numArr2.splice(0, numArr2.length);
                numResu = numResu.concat(numMidd);
            }
        }
        numResu = numResu.reverse();
        return numResu.join('');
    }
    // $.fn.cookie('mdMobile',123,{expires:-1});
    // $.fn.cookie('mobile',123,{expires:-1});
    $('.get-message').on('click', function() {
        getMessage('.get-message');
    });
    $('.login_submit').on('click', submitFollow);
    $('.add_friends').on('click', function() {
        var isMobile = $.fn.cookie('mobile');
        var ismdMobile = $.fn.cookie('mdMobile');
        if (isMobile && ismdMobile) {
            thePostData = $.extend({
                mdMobile: ismdMobile,
                friendId: memberID,
                productId: productID,
                mobile: isMobile
            }, getParamsData);
            postRequest(thePostData);
        } else {
            $('.wrapper').show();
        }
    });

    $('#modify_mobile').on('click', function() {
        $('.follow').hide();
        $('.wrapper').show();
        flag = true;
        clearBox();
    });
    $('.shutdown').on('click', function() {
        $('.wrapper').hide();
        flag = true;
        clearBox();
    });
    $('#follow_shut').on('click', function() {
        $('.follow').hide();
    });

    (function() {
        if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            handleFontSize();
        } else {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
            }
        }

        function handleFontSize() {
            // 设置网页字体为默认大小
            WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
            // 重写设置网页字体大小的事件
            WeixinJSBridge.on('menu:setfont', function() {
                WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
            });
        }
    })();
    //借给TA 埋点统计
    _czc.push(["_trackEvent", "借给TA 赚利息", "点击", "标的分享", "", "borrowTA"]);
    //提交 埋点统计
    _czc.push(["_trackEvent", "提交", "点击", "标的分享", "", "subCnzz"]);
    //去借贷宝看看 埋点统计
    _czc.push(["_trackEvent", "去借贷宝看看", "点击", "标的分享", "", "goSeeCnzz"]);
})();