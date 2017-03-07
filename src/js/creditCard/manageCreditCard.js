  //管理信用卡
  ;function manageCreditCard() {

    function renderPage() {
      var htmlStr = pageData.htmlStr;
      
      if (utls.checkBankDetailObj(creditPayData.cardDetail)) {
        pageData.renderData = creditPayData.cardDetail;
        utls.render({
          template: htmlStr,
          templateData: pageData.renderData,
          tools: {
            getRestDays: utls.getDaysFromTwoDate,
            getBankName: utls.getbankNameFromBankNo,
            getBankClass: utls.getCssNameFromBankNo
          }
        });
        initEvent();
      } else {
        services.getCreditDetail({
          data: creditPayData.dataFromUrl,
          sucessFun: function(resData) {
            if (resData.error.returnCode * 1 === 0) {
              creditPayData.cardDetail = utls.addProterty(creditPayData.cardDetail, resData.data);
              pageData.renderData = resData.data;
              utls.render({
                template: htmlStr,
                templateData: pageData.renderData,
                tools: {
                  
                  getRestDays: utls.getDaysFromTwoDate,
                  getBankName: utls.getbankNameFromBankNo,
                  getBankClass: utls.getCssNameFromBankNo
                }
              });
              initEvent();
            } else {
              utls.render({
                template: htmlStr,
                templateData: pageData.dataFromUrl
              });
              render();
            }
          }
        });
      }

    }

    function initEvent() {
      $('#link').on('click',function(){
          window.location.href = './paymentHistory.html?token=' + creditPayData.dataFromUrl.token + '&account=' + creditPayData.cardDetail.allBankNo;
      });
      $('#manageCreditCard').on('click', '#deleteCard', function() {
        var tempString = '';
        var lastFourNo = creditPayData.cardDetail.account.substr(creditPayData.cardDetail.account.length - 4, 4);
        var bankname = utls.getbankNameFromBankNo(creditPayData.cardDetail.bankNo);
        tempString = '确定删除尾号为' + lastFourNo + '的' + bankname + '信用卡？';

        dialog.confirm(tempString, function(result) {
          if (result.closeType === 'ok') {
            services.delteCredit({
              data: creditPayData.dataFromUrl,
              sucessFun: function(resData) {
                //根据数据，待完善
                if (resData.error.returnCode * 1 === 0) {

                  window.location.href = 'index.html' + window.location.search;
                } else {
                  toastError(resData.error.returnUserMessage);
                }
              }
            });

          }

        });
        /*if (window.confirm(tempString)) {
          
        }*/
      });

      $('#manageCreditCard').on('click', '#back', function() {

        //window.location.href = '#creditPay';
        history.back();
      });
      $('#manageCreditCard').on('change', '#remindDate', function() {
        //alert('1');
        $('.dateFont').html($('#remindDate').val().trim() + '');
        var tempObj = {
          cardStatus: $('#ifRemind').attr('checked') ? 1 : 0,

          remindDate: parseInt($('#remindDate').val().trim().replace('每月', ''))

        };

        services.updateCreditCard({
          data: utls.addProterty(creditPayData.dataFromUrl, tempObj),
          sucessFun: function(resData) {
            if (resData.error.returnCode * 1 === 0) {
              creditPayData.cardDetail = utls.addProterty(creditPayData.cardDetail, tempObj);


            } else {
              toastError(resData.error.returnUserMessage);
            }
          }
        });


      });

      $('#manageCreditCard').on('change', '#ifRemind', function() {
        //alert('1');
        //待UE确认
        if ($('#ifRemind').attr('checked')) {
          $('#remindDate').show();
          $('#ifRemind').parents('li').next().show();

        } else {
          $('#remindDate').hide();
          $('#ifRemind').parents('li').next().hide();

        }
        var tempObj = {
          cardStatus: $('#ifRemind').attr('checked') ? 1 : 0,
           remindDate: parseInt($('#remindDate').val().trim().replace('每月', ''))
        };
        JSON.stringify(tempObj);
        services.updateCreditCard({
          data: utls.addProterty(creditPayData.dataFromUrl, tempObj),
          sucessFun: function(resData) {
            if (resData.error.returnCode * 1 === 0) {
              creditPayData.cardDetail = utls.addProterty(creditPayData.cardDetail, tempObj);
            } else {
              toastError(resData.error.returnUserMessage);
            }
          }
        });

      });

      $('#manageCreditCard').on('click', '.dateFont', function(e) {

        $('.SelectContainer').show();
        $('.selects').show();
        setTimeout(function() {
          if (pageData.ifFisrtshowSe) {
            if ($('.checked').position().top > 200) {
             // console.log($('.checked').position().top);
              $("#selectUl").scrollTop($('.checked').position().top - 200);
              //console.log($('.checked').position().top);
            };
          }
          pageData.ifFisrtshowSe = false;
        }, 200);
        //console.log(e);
        //return false;

      });

      utls.selectToNewUls($('#remindDate'));

      var ua = navigator.userAgent;
      if (ua.match(/ipad|ios|iphone/i)) {
          //location.href = 'phone.html' + (from ? ('?from=' + from) : '');
          $('#remindDate').css('z-index', '11');
      }

    }

    function initStatus() {
      document.title = '管理信用卡';
      window.location.href = 'https://native.jiedaibao.com/web2Native/setTitle?title=' + '管理信用卡';
      $('.SelectContainer').hide();
      $('.selects').hide();
     

    }


    var pageData = {
      htmlStr: require('creditCard/manageCreditCard.string'),
      renderData: {},
      ifFisrtshowSe: true,
      dataFromUrl: utls.urlSearchToObj()
    }

    return {
      init: function() {
        renderPage();
        initStatus();
      }
    }
  }
