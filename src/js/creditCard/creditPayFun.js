 //信用卡还款页面
 function creditPayFun() {
     function renderPage() {
         var htmlStr = pageData.htmlStr;
         var memberID;
         //先检查是否有详情数据
         if (utls.checkBankDetailObj(creditPayData.cardDetail)) {
             pageData.renderData = creditPayData.cardDetail;

             utls.render({
                 template: htmlStr,
                 templateData: pageData.renderData,
                 tools: {
                     getShowNum: utls.getLastFourNum,
                     getRestDays: utls.getDaysFromTwoDate,
                     getBankClass: utls.getCssNameFromBankNo,
                     getBankName: utls.getbankNameFromBankNo
                 }
             });
             initEvent(memberID);

         } else {
             services.getCreditDetail({
                 data: {
                     id: creditPayData.dataFromUrl.id,
                     token: creditPayData.dataFromUrl.token
                 },
                 sucessFun: function(resData) {
                     if (resData.error.returnCode * 1 === 0) {
                         memberID = resData.data.memberId;

                         creditPayData.cardDetail = utls.addProterty(creditPayData.cardDetail, resData.data);
                         pageData.renderData = resData.data;

                         utls.render({
                             template: htmlStr,
                             templateData: pageData.renderData,
                             tools: {
                                 getShowNum: utls.getLastFourNum,
                                 getRestDays: utls.getDaysFromTwoDate,
                                 getBankClass: utls.getCssNameFromBankNo,
                                 getBankName: utls.getbankNameFromBankNo
                             }
                         });
                         initEvent(memberID);
                     } else {

                     }
                 }
             });
         }
     }

     function initData() {

     }

     function initstatus() {
         //初始隐藏叉叉
         $('#deletMoney').hide();
         document.title = '信用卡还款';
         //$('#submitPay').css('background-color', '#d0e2f7');
         $('.SelectContainer').hide();
         $('.selects').hide();
         setTimeout(function() {
             $('#submitPay').attr('disabled', 'disabled').addClass('disableButton').css('background-color', '');
         }, 200);
         window.location.href = 'https://native.jiedaibao.com/web2Native/setTitle?title=' + '信用卡还款';


     }

     function initEvent(memberID) {
         $('#creditPay').on('click', '#toManage', function() {
             window.location.href = location.origin + location.pathname + location.search + '&page=' + (+(new Date())) + '#manageCreditCard';
         });

         $('#creditPay').on('click', '#submitPay', function() {
             $('#submitPay').attr('disabled', 'disabled');
             var tempObj = {};
             /*console.log($('#theMoney').val().trim());
             console.log(parseFloat($('#theMoney').val().trim()));*/
             //tempObj.amount = Math.floor(parseFloat($('#theMoney').val().trim()) * 100);
             tempObj.amount = Math.floor(parseInt((parseFloat($('#theMoney').val().trim()) * 100).toFixed(2)));
             //Math.round( parseFloat( input ) * 100 )
             /*console.log(tempObj.amount);*/
             tempObj = utls.addProterty(tempObj, creditPayData.dataFromUrl);

             if (!($('#creditPay .read').attr('checked'))) {
                 toastError('请同意服务协议');
                 $('#submitPay').removeAttr('disabled', 'disabled');
                 return false;
             }
             if (tempObj.amount === 0) {
                 toastError('输入金额不能为0');
                 $('#submitPay').removeAttr('disabled', 'disabled');
                 return false;
             }
             if (tempObj.amount > 10000000) {
                 // 大约100w 提示
                 toastError("单笔最多10万元");
                 $('#submitPay').removeAttr('disabled', 'disabled');
                 return false;
             }
             if (/^(\d{1,10}|\d{1,10}.\d{1,2})$/.test($('#theMoney').val().trim())) {

                 services.creditPay({
                     data: tempObj,
                     sucessFun: function(resData) {
                         if (resData.error.returnCode * 1 === 0) {
                             //window.location.href = '#';
                             var tradeID = resData.data.preOrderId;
                             var memberID = resData.data.memberId;
                             //var tradeID = resData.data;
                             var amount = tempObj.amount;

                             var ext = resData.data.txnType || '';
                             // 支付完成之后的回调
                             window.JDBPayCallback = function(ret) {
                                     var result;
                                     if (typeof ret == 'object') {
                                         result = ret;
                                     } else {
                                         result = JSON.parse(ret);
                                     }
                                     // status 1为是失败，其他为成功
                                     // amount 支付金额
                                     // merchantName 收款方
                                     // discount 优惠金额
                                     // tradeId 交易id，用于跳转查询明细
                                     // statusText 错误信息
                                     var forwardInfo = {
                                         amount: tempObj.amount / 100,
                                         discount: 0,
                                         merchantName: '',
                                         orderID: result.merchantOrderID,
                                         realAmount: tempObj.amount / 100,
                                         statusText: result.statusText,
                                         type: '19',
                                         status: result.status
                                     };
                                     var paramsObj = $.extend({}, forwardInfo, {});
                                     var str = utls.parseParam(paramsObj);
                                     if (result.status === '0' || result.status === 0) {
                                         location.href = '../payment/paymentByResult.html?' + str + "&memberID=" + memberID;
                                     } else {
                                         if (result.status == 2) {
                                             toastError(result.statusText);
                                         }
                                     }

                                 }
                                 //alert('https://native.jiedaibao.com/web2Native/pay?tradeID=' + tradeID + '&amount=' + amount + '&ext=' + ext);
                             window.location.href = 'https://native.jiedaibao.com/web2Native/pay?tradeID=' + tradeID + '&amount=' + amount + '&ext=' + ext;


                         } else {
                             toastError(resData.error.returnUserMessage);
                         }

                         $('#submitPay').removeAttr('disabled', 'disabled');
                     }
                 });
             } else {
                 toastError('请您输入正确金额');
                 $('#submitPay').removeAttr('disabled', 'disabled');
             }

         });

         $('#creditPay').on('tap', '#deletMoney', function() {
             $('#theMoney').val('');
         });

         $('#creditPay').on('change', '.read', function() {
             //$('#creditPay .read').attr('checked');
             if ($('#creditPay .read').attr('checked')) {
                 //$('#theMoney').val('');
                 $('#submitPay').removeAttr('disabled', 'disabled').css('background-color', '#2a8bf8');

             } else {
                 $('#submitPay').css('background-color', '#d0e2f7');

             }
         });

         $('#creditPay').on('blur', '#theMoney', function() {
             //if(hasClass){}
             $('#deletMoney').hide();
             $('#theMoney').attr('type', 'number');
         });


         $('#creditPay').on('focus', '#theMoney', function() {
             //if(hasClass){}
             $('#deletMoney').show();
             var moneyStr = $('#theMoney').val();
             if (moneyStr.length != 0) {
                 $('#theMoney').attr('type', 'text');
             }

         });

         $('#creditPay').on('input', '#theMoney', function(e) {
             var moneyStr = $('#theMoney').val();
             if (moneyStr.length != 0) {
                 $('#theMoney').attr('type', 'text');
             }

             e = e || window.event;
             if (moneyStr === '' && moneyStr.length === 0) {
                 $('#submitPay').attr('disabled', 'disabled').addClass('disableButton');
                 $('#theMoney').val('');
                 return false;
             }
             var exe = /^(\d+\.?\d{0,2}|\d+\.?\d{0,1}|\d+\.|\d+)$/;
             if (!exe.test(moneyStr)) {

                 /*if(/^(\d+\.?\d{3,3})$/.test(moneyStr)) {
                   var tempString = parseFloat(moneyStr).toFixed(2);
                   $('#theMoney').val(moneyStr.substring(0,moneyStr.length - 1));
                   //alert('三维小数');
                   return false
                 }

                 var tempString = parseFloat(moneyStr).toString();
                 console.log(moneyStr.length);*/
                 $('#theMoney').val(moneyStr.substring(0, moneyStr.length - 1));

                 return false;

                 //貌似最后的结果都是 $('#theMoney').val(moneyStr.substring(0,moneyStr.length - 1));

             } else {
                 if (moneyStr.length === 11) {
                     $('#theMoney').val(moneyStr.substring(0, 10));
                 }

                 $('#submitPay').removeAttr('disabled', 'disabled').removeClass('disableButton');
                 setTimeout(function() {
                     var o = document.getElementById("theMoney");
                     try {

                         o.setSelectionRange(o.value.length, o.value.length);

                     } catch (e) {

                     }

                     o.focus();
                 }, 100);
                 /* if (parseFloat(moneyStr) > 0) {
                    $('#theMoney').val(parseFloat(moneyStr));
                    $('#submitPay').removeAttr('disabled','disabled').removeClass('disableButton');

                  } else {
                    $('#theMoney').val('');
                    $('#submitPay').attr('disabled','disabled').addClass('disableButton');
                  }*/

                 return false
             }



         });

         initstatus();



     }
     var pageData = {
         htmlStr: require('creditCard/creditPay.string'),
         renderPage: {}
     }
     return {
         init: function() {
             renderPage();

         }
     }
 }
