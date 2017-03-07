/**
 * Created by zhaobin on 15/11/17.
 */
;(function() {
    var htmlStr = require('payment/paymentDetail.string');
    var inter;
    if(!url('?memberID')){
      inter = '{{oldCodeApi}}';
    }else{
      inter = '{{newCodeApi}}';
    }
    var data = {
        businessType: url('?businessType'),
        orderId: url('?orderId'),
        jdbUserId: url('?memberID')
    };
    var fixed = function(num){
        if(num.indexOf('.') == -1){
          return num + '.00';
        }else if(num.substr(num.indexOf('.')+1).length == 1){
          return num.substr(0,num.indexOf('.'))+num.substr(num.indexOf('.'),2)+'0';
        }else{
          return num.substr(0,num.indexOf('.'))+num.substr(num.indexOf('.'),3);
        }
    };
    $.ajax({
       url: inter,
       dataType: 'json',
       data: {reqData:JSON.stringify(data)},
       type: 'post',
       success: function(xhr) {
        if(!xhr.data.orderDetail){
            $(".container").html(microtemplate(htmlStr, xhr));
            return;
        }
        var len = xhr.data.orderDetail.length;
        if(xhr.data && xhr.data.orderDetail[len-1].displayStatus != '3'){
          //console.log(xhr.data.orderDetail[len-1].displayStatus);
        //if(xhr.data){

          if(xhr.data.base&&(xhr.data.base.money != null)){
            xhr.data.base.money = fixed(xhr.data.base.money);
          }
          if(!url('?memberID')&&xhr.data.base.tradingObject.icon){
            xhr.data.base.tradingObject.icon = '../../img/payment/icon/' + xhr.data.base.tradingObject.icon;
          }

        //}

        $(".container").html(microtemplate(htmlStr, xhr));

        //链接跳转
        $('.linkIcon').on('click',function(){
          location.href = '../../partials/payment/paymentDetail.html?memberID='+url('?memberID')+'&orderId='+ xhr.data.ext.orderId+'&businessType='+xhr.data.ext.businessType;
        });
        }else{
          useVueTelement(xhr);
        }

        /**
         * help 内容撑起来
         */
        var ua = navigator.userAgent;
        var uamatch = /com.renrenxing.JDBEnterprise\/([\w.]+)/i.exec(ua);
        var androidUa = /JDBClient Android (\S+)/g.exec(ua)
        if (uamatch && +uamatch[1].replace(/\./g, '') >= 250 || (androidUa && androidUa[1].replace(/\./g, '') >= 250)) {
            var bh = $('body').height();
            var wh = $('#j-wrap').height();
            if (wh < bh - 56) {
                $('#j-wrap').height(bh - 56);
            }
            $('#j-help').show();
        }
       },
       error: function(){

       }
    });



   function useVueTelement(json){
        var serchParmer = {reqData : null};
            serchParmer.reqData = JSON.stringify(getHashStringArgs());

        var len = json.data.orderDetail.length;
        var barcodeInfo = json.data.orderDetail[len-1];
        json.data.orderDetail.splice(-1,1);

        //条形码过滤器
        Vue.filter('tiaoXingMaFilter', function (value) {

            //creatBarcode(value,'code128',1,30);//小码
            $("#barcode").barcode(value, 'code128', {barWidth: 1, barHeight: 30});//小码
            $("#bgBarcode").barcode(value, 'code128', {barWidth: 2, barHeight: 100});//大码

            $("#codeBg").css({'height':window.innerHeight+'px'});
            $("#barcode").find('div:last-child').css({'position':'relative','top':'4px'});

            var last = $('#barcode').find('div:last-child');
            var bgLast = $('#bgBarcode').find('div:last-child');
            var code = value;
            var len = Math.floor(code.length/4);
            var arr = [];
            for(var i=0; i<len;i++){
              if(i!=len-1){
               arr.push(code.slice(i*4,4*(i+1)));
              }else{
               arr.push(code.slice(i*4));
              }
            }
            code = arr.join(' ');
            last.html(code);
            bgLast.html(code);

            return '';
        });fixed

         Vue.filter('moneyFilter', function (value) {
           return fixed(value);
         });

        var demo = new Vue({
            el : '#orderInfos',
            data : {
                baseInfos : json.data.base,
                detailInfos : json.data.orderDetail,
                barcodeInfo : barcodeInfo
            },
            methods : {

                bigShow : function(){
                  $('#codeBg').show();
                  var width = $('#bgBarcode').width();
                  var height = $('#bgBarcode').height();
                  $("#bgBarcode").find('div:last-child').css({'position':'relative','top':'4px'});
                  $('#bgBarcode').css({
                    'top':window.innerHeight/2-height/2+'px',
                    'left':window.innerWidth/2-width/2+'px'

                  });
                },
                smallShow : function(){
                  $('#codeBg').hide();
                }
            }
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
    }
})();
