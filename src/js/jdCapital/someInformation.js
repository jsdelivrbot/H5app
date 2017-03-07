/*

显示顶部提示信息---支付合规性
@author: chenke@jiedaibao.com
    依赖zepto
    对应css
    html dom
*/

(function () {

    $('.someInformation').on('click','.delete',function() {
        $('.someInformation').hide();
    });
  $.ajax({
    url:'{{tradeOuterApi}}?type=2',
    type: 'get',
    dataType: 'json',
    success:function(res) {
        if(typeof res === 'string'){
            res = JSON.parse(res);
        }
        if(res.error.returnCode * 1 === 0) {
            $('.detailInfomation').html(res.data.tip);
            $('.someInformation').show();
        }else {
            $('.someInformation').hide();
        }
    },
    error:function() {
        $('.someInformation').hide();
    }
  });

})();
