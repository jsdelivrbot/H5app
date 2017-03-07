;(function () {
    /*URL接收参数*/
    var  icode = url('?icode');
    $('#icode').text(icode);
    
    $.get( '{{getTransactionInfoApi}}', 
        {
           icode: icode
        },
        function(result) {
            var res = result;
            if (typeof result === 'string') {
                res=JSON.parse(result);
            }
            console.log(res)
            if( res.status != 0 ) {
                toastError( res.message );
                return;
            }
            if(res.avatar){
              $('#headImg').attr('src',res.avatar);
            }else{
               $('#headImg').attr('src','../../img/rechargeFee/head.png');
            }
            
            if(res.lendOutCount == 0){
              $('.loan').html('借钱给好友，最高利率可达<span>24</span>%');
            }else{
              $('.loan').html('我已在借贷宝借出 <span id="loanNum">'+res.lendOutCount+'</span> 笔，平均利率 <span id="loanRate">'+res.averageRate+'</span> %');
            }
            
        }
    );

   if($('.wenan').height()==42){
      $('.wenan').css('margin-top','-2px')
   }
   
})();