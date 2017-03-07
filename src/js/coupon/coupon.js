;(function(win){
    var returnInfo = [];
    var platform = checkPlatform();
    var returnInfoStr='';

    var theSelectedCoupon = [];/*选中的优惠劵*/

    var userInfos = getHashStringArgs();/*获取当前用户数据*/
    /*console.log(userInfos);*/
    /*用户数据字段
    请求参数    必选  类型及范围   说明
    orderID     yes   string       预支付订单ID
    payType     yes   int          支付类型(0:未知;1;余额支付;2:银行卡支付;3:余额生息支付;)
    cardID      yes   string       payType=2时，表示银行卡ID
    couponIDs   yes   string       已选择优惠券ID列表（逗号分割）*/
    if(typeof(payType) != "undefined"){
        userData.payType = parseInt(userData.payType)
    }
       
    /*获取优惠劵列表数据'/data/coupon/couponList.json'*/
    $.post('{{getCouponListsApi}}', userInfos, function(res){
    
        var couponLists;
        if(typeof res === 'string'){
            couponLists = JSON.parse(res).data;
        }else{
            couponLists = res.data;
        }
        if(res.data === null){
            $("body").hide();
            return;
        }

        /*优惠劵列表渲染*/    
        var demo = new Vue({
            el : '#coupon_list',
            data : {
                coupons : couponLists
            },
            methods : {
                /*删除数组中属性key值为val的一项*/
                deleArrayHas : function(key, val ,oArray){
                    var i=0,
                        len = oArray.length;
                    var oindex;
                    for(;i<len;i++){
                        if(oArray[i][key] === val){
                            oindex = i;
                        }
                    }
                    oArray.splice(oindex,1);
                },
                /*选择/取消选择 优惠劵*/
                switchCheck : function(index){
                    /*多选代金卷开始*/
                    /*var isCK = (!!this.coupons[index]["hasSelected"]);
                    
                    if(isCK){

                        this.deleArrayHas("hasSelected", 1 ,theSelectedCoupon);
                        this.coupons[index]["hasSelected"] = 0;

                        console.log(this.coupons[index]["hasSelected"]);
                    }else{

                        this.coupons[index]["hasSelected"] = 1;
                        theSelectedCoupon.push(this.coupons[index]);

                        console.log(this.coupons[index]["hasSelected"]);

                    }//多选结束*/

                    /*单选开始*/
                    if(this.coupons[index]["hasSelected"] == 0){
                        for(var p=0;p<this.coupons.length;p++){
                           this.coupons[p]["hasSelected"] = 0;
                        }

                        this.coupons[index]["hasSelected"] = 1;

                        theSelectedCoupon[0]=this.coupons[index];
                    }else{
                        this.coupons[index]["hasSelected"] = 0;
                        theSelectedCoupon.length=0;
                    }
                    /*单选结束*/
                    var returnJson = [];
                    var amount=0;
                    var type = "";
                    for(var l=0;l<theSelectedCoupon.length;l++){
                        var pp = {                            
                            "couponID" : theSelectedCoupon[l].couponID,
                            "categoryID" : theSelectedCoupon[l].categoryID,
                            "type" : theSelectedCoupon[l].type,
                            "version" : theSelectedCoupon[l].version                         
                        };
                        
                        returnJson[l] = pp;
                        type = theSelectedCoupon[l].type;
                        /*amount+=theSelectedCoupon[l].amount;//多选*/
                        amount=theSelectedCoupon[l].amount;
                    }
                    
                    var content = amount==0?'':(amount/100)+"元优惠劵";
                   
                    //returnInfoStr = JSON.stringify({"content":(amount/100)+"元优惠劵","value":returnJson});
                    returnInfoStr = JSON.stringify({"content":content,"value":{"type":type,"ids":returnJson.slice(-1)}});
                    //console.log(returnInfoStr);

                    if(platform === 'android'){
                        window.location.href = 'http://native.jiedaibao.com/web2Native/couponInfo?couponInfo='+returnInfoStr;
                    }
                    
                }
            }
        });

        /*默认选中的代金卷*/
        for(var i=0; i<couponLists.length;i++){
            if(couponLists[i]["hasSelected"] === 1){
                theSelectedCoupon.push(couponLists[i]);
                /*theSelectedCoupon = couponLists[i];*/
                /*window.sessionStorage.theSelectedCoupon=couponLists[i];*/
            }
        }    
    });

    Vue.filter('getRightTime', function (value) {

        var oTime = new Date(value);
            year = oTime.getFullYear(),
            month = oTime.getMonth()+1,
            day = oTime.getDate();

        return year+"-"+(month<10?'0'+month:month)+"-"+(day<10?'0'+day:day);
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
    /*检测平台*/
    function checkPlatform(){
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; /*android终端*/
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); /*ios终端*/
        if(isAndroid){
            return 'android';
        }else if(isiOS){
            return 'ios';
        }
    }

    /*供端上调用的方法*/
    window.getCouponInfo = function(){


        var returnJson = [];
        var amount=0;
        var type = '';
        for(var l=0;l<theSelectedCoupon.length;l++){
            var pp = {                            
                "couponID" : theSelectedCoupon[l].couponID,
                "categoryID" : theSelectedCoupon[l].categoryID,
                "type" : theSelectedCoupon[l].type,
                "version" : theSelectedCoupon[l].version                          
            };
            
            returnJson[l] = pp;
            type = theSelectedCoupon[l].type;
            /*amount+=theSelectedCoupon[l].amount;//多选*/
            amount=theSelectedCoupon[l].amount;
        }
        
        var content = amount==0?'':(amount/100)+"元优惠劵";
        //returnInfoStr = JSON.stringify({"content":(amount/100)+"元优惠劵","value":returnJson});
        returnInfoStr = JSON.stringify({"content":content,"value":{"type":type,"ids":returnJson.slice(-1)}});

        if(platform === 'ios'){
            //alert(returnInfoStr);
            return returnInfoStr;  

        }
    }

})(window);