
;(function(){
    var ua = navigator.userAgent.toLowerCase();
    var payInfos = getHashStringArgs();
    // 根据不同业务场景来区分跳转
    var TYPECONFIG = {
        "08": "手机充值",
        "05": "条码支付",
        "03": "扫码支付"
    };
    var title = "";
    /**
     * 需要获取的参数，提交给server
     * mixed
     * memberID
     * orderID
     * ext
     * businessType
     * 手机充值目前url https://app.jiedaibao.com/h5app/partials/payment/paymentByResult.html?amount=19.90&statusText=%E4%BA%A4%E6%98%93%E6%88%90%E5%8A%9F&status=0&orderID=20160614160614174208725866&type=37
     */
    $.post('{{queryPayResultApi}}',payInfos, function(res){
        var json;
        if(typeof res === 'string'){
            json= JSON.parse(res);
        } else {
            json = res;
        }
        if(json.error.returnCode != '0'){
            // $("body").hide();
            toastError(json.error.returnMessage);
            return;
        }
        var data = json && json.data;
        var resultExt = data.resultExt || {};
        title = resultExt.title || data.title;
        var type = resultExt.type;
        document.title = title;
        window.location.href = 'https://native.jiedaibao.com/web2Native/setTitle?title=' + title;
        var demo = new Vue({
            el : '#success',
            data : {
                orderInfos : data || payInfos
            },
            methods : {
                continuePay : function(event){
                    /*获取到当前点击元素*/
                    var el = event.currentTarget;
                    /*添加按钮点击效果*/
                    $(el).addClass('btn2');
                    setTimeout(function(){
                        $(el).removeClass('btn2');
                    }, 200);
                    var suffix = "";
                    switch (type) {
                        case "03":
                            suffix += "?backToSomeView=backToSomeView";
                            //扫码支付需要加后面的参数才能才能会到钱包页面,条码支付不带参数
                            break;
                        default:
                            break;
                    }
                    /**
                     * 根据返回的不同的type置来设置不同的跳转路径
                     * return，没有特殊处理的话就默认关闭webview
                     */
                    /*执行点击后的逻辑*/
                    if (/iphone|ipad|ipod/.test(ua)) {
	                    location.replace('https://native.jiedaibao.com/web2Native/toastAndClose' + suffix);
	                } else if (/android/.test(ua)) {
	                    location.replace('https://native.jiedaibao.com/web2Native/close' + suffix);
	                }
                }
            }
        });
    });

    /*获取哈希参数*/
    function getHashStringArgs() {
        /*取得查询的hash，并去除开头的#号*/
        var hashStrings = (window.location.search.length > 0 ? window.location.search.substring(1) : ""),
        /*保持数据的对象*/
        hashArgs = {},
        // hashStrings = hashStrings.substring(0, hashStrings.indexOf('?') > 0 ? hashStrings.indexOf('?') : hashStrings.length )
        /*取得每一项hash对*/
        items = hashStrings.length > 0 ? hashStrings.split("&") : [],
        item = [],
        name = null,
        value = null,
        i = 0,
        len = items.length;
        /*逐个将每一项添加到hashArgs中*/
        for (i = 0; i < len; i++) {
           item = [];
           // 不能用split 方法，有特殊情况ext=asdfaf==as==
           item[0] = items[i].substring(0, items[i].indexOf('='));
           item[1] = items[i].substring(items[i].indexOf('=')+1);
           name = decodeURIComponent(item[0]);
           value = decodeURIComponent(item[1]);
           if (name.length > 0) {
               hashArgs[name] = value;
           }
        }
        console.log(hashArgs);
        return hashArgs;
    }

})();
