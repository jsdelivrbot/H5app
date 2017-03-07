/*
 * @common.js 通用函数
 * @author liang.tang
 * @time 2015-10-27
 **/

// var baseUrl = 'http://119.254.111.25:8080';
//var baseUrl = 'http://119.254.111.25:8889';
//var baseUrl = 'http://122.115.42.96:8888';
var baseUrl = 'https://licai.jiedaibao.com';

var common = function () {

    var delayTime = 500;

    //var deployTyle = 'jxfinance_dev';
    var deployTyle = 'licai';



    //获取当前时间 如2013-08-08 11:11:11
    var getTime = function (time, format) {
        var d = new Date(time);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;
        var date = d.getDate();
        date = (date < 10) ? "0" + date : date;
        var hour = d.getHours();
        hour = (hour < 10) ? "0" + hour : hour;
        var minute = d.getMinutes();
        minute = (minute < 10) ? "0" + minute : minute;
        var second = d.getSeconds();
        second = (second < 10) ? "0" + second : second;
        if (!format) {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }else if (format == 'YMD') {
            return year + "/" + month + "/" + date;
        } else if (format == 'Y-M-D') {
            return year + "-" + month + "-" + date;
        } else if (format == 'Y-M') {
            return year + "-" + month;
        } else if (format == 'Y-M-D H:M') {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute;
        } else {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
    };

    var bindscroll = function (params) {
        $(window).bind("touchmove", function (e) {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if ((scrollTop > 0 && scrollTop >= $(document).height() - $(window).height() - 2)) {
                params.callback && params.callback.call(params.scope, '');
            }
        });
    };

    /**
     * 获取url中的参数
     * @method getRequest
     */
    var getRequest = function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            if (str.indexOf("&") != -1) {
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    // theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            } else {
                theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
            }
        }
        return theRequest;
    };

    //判断是否为ios
    var isIos = function () {
        var u = navigator.userAgent;
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1) {
            return true;
        } else {
            return false;
        }
    };


    var parseMoney = function (money) {
        var money = money + '',
            point = money.indexOf('.');
        var result = "";
        if (point == -1) {
            result = money;
        } else {
            result = money.substring(0, point + 2);
            var data = result.split('.');
            if (data[1] == 0) {
                return data[0];
            }
        }
        return result;
    };

    //倒计时
    var getCountDownTime = function (time, serverDate, dom) {
        time = parseInt(time, 10);
        if (!time || time === null) {
            return;
        }

        var checkTime = function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        var leftTime = time - serverDate;

        if (leftTime < 0) {
            return;
        }

        var dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        leftTime -= dd * 1000 * 60 * 60 * 24;
        var hh = Math.floor(leftTime / 1000 / 60 / 60);
        leftTime -= hh * 1000 * 60 * 60;
        var mm = Math.floor(leftTime / 1000 / 60);
        leftTime -= mm * 1000 * 60;
        var ss = Math.floor(leftTime / 1000);
        leftTime -= ss * 1000;
        hh = checkTime(hh);
        mm = checkTime(mm);
        ss = checkTime(ss);

        var timeStr = dd ? (dd + '天' + hh + '时' + mm + '分' + ss + '秒') : (hh + '时' + mm + '分' + ss + '秒');
        if (dom) {
            $("#" + dom).html('还有 ' + timeStr + ' 开抢');
        } else {
            return timeStr;
        }
    };

    var timeElapsed = function (timeElapsed, isobj) {
        if (timeElapsed < 0) {
            return;
        }
        var s = ~~(timeElapsed / 1000),
            m = 0,
            h = 0,
            d = 0;
        var result = '';

        if (s > 59) {
            m = ~~(s / 60);
            s = s % 60;
        }
        if (m > 59) {
            h = ~~(m / 60);
            m = m % 60;
        }
        if (h > 24) {
            d = ~~(h / 24);
            h = h % 24;
        }

        if (s < 0) {
            s = 0;
        }
        result = '<span>' + s + '</span>秒';
        if (m) {
            result = '<span>' + m + '</span>分' + result;
        }
        if (h) {
            result = '<span>' + h + '</span>时' + result;
        }
        if (d) {
            result = '<span>' + d + '</span>天' + result;
        }
        return !isobj ? result : {
            day : d,
            hour: h,
            min : m,
            sec : parseInt(s)
        };
    };


    var formatAmount = function (money, unit, type) {
        if (unit == 'percent') {
            money = (parseInt(money) / 100).toFixed(2);
        } else {
            money = money.toFixed(2);
        }

        if (type == 'int') {
            var money = money + '',
                point = money.indexOf('.');
            var result = "";
            if (point == -1) {
                // result = money;
            } else {
                result = money.substring(0, point + 2);
                var data = result.split('.');
                if (data[1] == 0) {
                    money = data[0];
                }
            }
        }

        return money;
    };

    var formatMoney = function (s, n, unit) {
        if (unit == 'percent') {
            s = (parseInt(s) / 100).toFixed(2);
        }
        n = n > 0 && n <= 20 ? n : 0;
        if (s < 0) {
            var _s = 0;
            return _s.toFixed(n);
        }
        s = parseFloat((s + "")
            .replace(/[^\d\.-]/g, ""))
            .toFixed(n) + "";
        var l = s.split(".")[0].split("")
            .reverse();
        var r = s.split(".")[1];
        var t = "",
            i;
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ?
                "," :
                "");
        }
        if (r) {
            return t.split("")
                    .reverse()
                    .join("") + "." + r; // 99.99
        } else {
            return t.split("")
                .reverse()
                .join("");
        }
    };


    /**
     * 提示弹窗
     * @param {String} options.title 弹窗标题.
     * @param {String} options.tips 提示文字.
     * @param {function} options.callback 调用函数.
     * @method tipsDialog
     */

    var tip = function (options, id) {
        if (id) {
            var dom = id;
        } else {
            var dom = "#tipTpl";
        }

        var container = $("#tip_container");
        // content.html(options.message);
        container.unbind();
        var _options = {
            title      : "提示",
            confirmText: '关闭'
        };
        options && $.extend(_options, options);
        var tpl = _.template($(dom).html());
        var html = tpl({
            "data": _options
        });
        container.html(html);
        container.show();
        var height = Math.max($(window).height(), $(document).height());
        $("#mask").height(height).show();
        container.on('tap', '.confirm', function (event) {
            setTimeout(function () {
                container.hide();
                if (!$('#pay_container').size()) {
                    $("#mask").hide();
                } else if ($('#pay_container').css('display') == 'none') {
                    $("#mask").hide();
                }
                options.callback && options.callback();
            }, delayTime)
        }).on('tap', '.close', function (event) {
            setTimeout(function () {
                container.hide();
                if (!$('#pay_container').size()) {
                    $("#mask").hide();
                } else if ($('#pay_container').css('display') == 'none') {
                    $("#mask").hide();
                }
                options.closeCallback && options.closeCallback();
            }, delayTime);
        });
    };

    /**
     * 购买弹窗
     * @param {String} options.title 弹窗标题.
     * @param {String} options.tips 提示文字.
     * @param {function} options.callback 调用函数.
     * @method tipsDialog
     */

    var pay = function (options) {

        var dom = "#payModal";
        var container = $("#pay_container");
        // content.html(options.message);
        container.unbind();
        var _options = {
            title      : "提示",
            confirmText: '关闭'
        };
        options && $.extend(_options, options);
        var tpl = _.template($(dom).html());
        var html = tpl({
            "data": _options
        });
        container.html(html);
        container.show();
        var height = Math.max($(window).height(), $(document).height());
        $("#mask").height(height).show();
        container.on('tap', '.confirm', function (event) {
            event.stopPropagation();
            setTimeout(function () {
                container.hide();
                $("#mask").hide();
                options.callback && options.callback();
            }, delayTime);

        }).on('tap', '.close', function (event) {
            event.stopPropagation();
            $('#buyAccount').blur();
            setTimeout(function () {
                container.hide();
                $("#mask").hide();
                options.closeCallback && options.closeCallback();
            }, delayTime);
        });
    };


    var sendAjax = function (params) {
        if (!navigator.onLine) {
            tip({
                message: '当前网络不可用'
            });
            return false;
        }
        var _params = getRequest();
        $.ajax({
            url     : params.url,
            type    : params.type || 'POST',
            data    : $.extend(params.data, _params),
            async   : params.async || true,
            cache   : params.cache || false,
            // contentType: false,
            dataType: 'json',
            success : function (data, status, xhr) {
                if (data.error.returnCode == 0) {
                    if (params.scope) {
                        params.callback && params.callback.call(params.scope, data.data, xhr);
                    } else {
                        params.callback && params.callback(data.data, xhr);
                    }
                } else {
                    params.failCallback && params.failCallback();
                    var message = data.error.returnMessage;
                    if (message) {
                        tip({
                            message: message
                        });
                    }
                }
            },

            error: function (xhr, status, errorThrow) {
                params.errorCallback && params.errorCallback();
            }
        });
    };

    var parseJSON = function (str) {
        if (typeof str === 'string') {
            try {
                var t = JSON.parse(str);
            } catch (err) {
                return common.tip({message: '返回remark字段错误'});
            }
            return t;
        } else if (typeof str === 'object') {
            return str;
        }

    };

    var path = baseUrl + '/lcapi/product/showInvestContract?',
        params = getRequest(),
        param = '?token=' + params.token + '&memberId=' + params.memberId + '&jdb_force_get=1';

    var getContract = function (str, id) {
        // var url = '/lcapi/product/getInvestContract?token='+data.urlParams.token+'&memberId='+data.urlParams.memberId+'&productId='+data.id+'&contract='+data.contract+'&jdb_force_get=1';
        var url = baseUrl+'/lcapi/product/showInvestContract'+param+'&productId='+id+'&contract='+str;
        return url;
    };

    return {
        getTime         : getTime,
        // getRequest: getRequest,
        bindscroll      : bindscroll,
        parseMoney      : parseMoney,
        formatAmount    : formatAmount,
        timeElapsed     : timeElapsed,
        sendAjax        : sendAjax,
        //timeElapsed: timeElapsed,
        getCountDownTime: getCountDownTime,
        getRequest      : getRequest,
        tip             : tip,
        pay             : pay,
        parseJSON       : parseJSON,
        formatMoney     : formatMoney,
        getContract     : getContract,
        deployTyle: deployTyle
    };

}();

// var JDBRefreshFix = function(){
//     location.reload();
// }
