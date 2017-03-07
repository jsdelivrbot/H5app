;(function(win){
    var payInfos = getHashStringArgs();
    $.post('{{payOkApi}}',payInfos, function(res){
    //$.post('http://119.254.111.25:1282/mybankv21/payui/pay/getQRPaySuccessInfo',payInfos, function(res){
    

        //var json = JSON.parse(res).data;
        var json;
        if(typeof res === 'string'){
            json= JSON.parse(res).data;
        }else{
            json = res.data;
        }
        if(res.data === null){
            $("body").hide();
            return;
        }
        //console.log(json);
        //if(json.error.returnCode !== 0){return}
        /**/    
        var demo = new Vue({
            el : '#success',
            data : {
                orderInfos : json
            },
            methods : {
               
                /**/
                continuePay : function(event){
                
                    console.log('继续支付');
                    /*获取到当前点击元素*/
                    var el = event.currentTarget;

                    /*添加按钮点击效果*/
                    $(el).addClass('btn2');
                    setTimeout(function(){
                        $(el).removeClass('btn2');
                    },200);

                    /*执行点击后的逻辑*/
                    window.location.href = 'https://native.jiedaibao.com/web2Native/continuePay?continuePay=1';
                }
            }
        });  
    });

    //支付方式过滤器
    Vue.filter('payTypeFilter', function (value) {
        if(value === '1') return "条形码支付";
        else if(value ==='2') return "二维码支付"
        else return "未知";
    });
    /*获取哈希参数*/
    function getHashStringArgs() {

        /*取得查询的hash，并去除开头的#号*/
        var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "")||(window.location.search.length > 0 ? window.location.search.substring(1) : ""),

        /*保持数据的对象*/
        hashArgs = {},
        /*取得每一项hash对*/
        items = hashStrings.length > 0 ? hashStrings.split("&") : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
        /*逐个将每一项添加到hashArgs中*/
        for (i = 0; i < len; i++) {
           item = items[i].split("=");
           name = decodeURIComponent(item[0]);
           value = decodeURIComponent(item[1]);
           if (name.length > 0) {
               hashArgs[name] = value;
           }
        }

        return hashArgs;
    }

})(window);