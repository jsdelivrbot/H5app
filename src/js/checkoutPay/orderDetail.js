;(function(){
    var serchParmer = {reqData : null};
        serchParmer.reqData = JSON.stringify(getHashStringArgs());

    console.log(serchParmer);
    //$.post('http://114.113.64.52:18281/order/query/queryPayOrder',serchParmer,successPost);
    $.post('{{orderDetailApi}}',serchParmer,successPost);
    function successPost(res, status, xhr){
       console.log(res);
        var json;
        if(typeof res === 'string'){
            json= JSON.parse(res);
        }else{
            json = res;
        }
        if(res.data === null){
            $("body").hide();
            return;
        }
        //console.log(res, status, xhr);
        if(json.error.returnCode !== 0){return}

        var len = json.data.orderDetail.length;
        var barcodeInfo = json.data.orderDetail[len-1];
        json.data.orderDetail.splice(-1,1);

        var demo = new Vue({
            el : '#orderInfos',
            data : {
                baseInfos : json.data.base,
                detailInfos : json.data.orderDetail,
                barcodeInfo : barcodeInfo
            },
            methods : {
                scale : function(event){
                    var ma = this.barcodeInfo.val || '12345678900111';
                    var el = event.currentTarget;
                    
                        if(!$(el).hasClass('scale')){
                            $(el).addClass('scale');
                            
                            creatBarcode(ma,'code11',2,120);
                            $(el).find('div:last-child').css({'fontSize':'20px'});

                            $("#barcode").css('marginLeft','-'+$("#barcode").outerWidth()/2+'px');
                        }else{
                            $(el).removeClass('scale');

                            creatBarcode(ma,'code11',1,50);
                            $(el).find('div:last-child').css({'fontSize':'10px'});

                            $("#barcode").css('marginLeft',0+'px');
                        }
                }
            }
        }); 

    }
    //条形码过滤器
    Vue.filter('tiaoXingMaFilter', function (value) {
        //var value = '12345678900';
        creatBarcode(value,'code11',1,50);
        return '';
    }); 
    //条形码解析
    function creatBarcode(code,encode,bW,bH){ 
        $("#barcode").barcode(code, encode, {barWidth: bW, barHeight: bH})
    }
    

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


})();