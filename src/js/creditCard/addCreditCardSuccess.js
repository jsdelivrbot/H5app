  //添加信用卡成页面
  function addCreditCardSuccess() {

    function renderPage() {
      var htmlStr = pageData.htmlStr;
      if (utls.checkBankDetailObj(creditPayData.cardDetail)) {
        pageData.renderData = creditPayData.cardDetail;
        utls.render({
          template: htmlStr,
          templateData: pageData.renderData,
          tools: {
            getShowNum: utls.getLastFourNum,
            getBankName: utls.getbankNameFromBankNo,
            getBankClass: utls.getCssNameFromBankNo
          }
        });
        initEvent();
      } else {
        services.getCreditDetail({
          data: {
            id: creditPayData.dataFromUrl.id,
            token: creditPayData.dataFromUrl.token
          },
          sucessFun: function(resData) {
            if (resData.error.returnCode * 1 === 0) {
              creditPayData.cardDetail = resData.data;
              pageData.renderData = resData.data;

              utls.render({
                template: htmlStr,
                templateData: pageData.renderData,
                tools: {
                  getShowNum: utls.getLastFourNum,
                  getBankName: utls.getbankNameFromBankNo,
                  getBankClass: utls.getCssNameFromBankNo
                }
              });
              initEvent();
            } else {}
          }
        });
      }



    }

    function initEvent() {
      $('#addCreditCardSuccess').on('click', '#gotoPay', function() {
        //alert('ccc');
        window.location.href = 'creditPayments.html' + window.location.search + '&id=' + creditPayData.cardDetail.id + '&page' + (+(new Date())) + '#creditPay';
      });

      $('#addCreditCardSuccess').on('click', '#backList', function() {
        //alert('ccc');
        window.location.href = 'index.html' + window.location.search;
      });


      $('.SelectContainer').hide();
      $('.selects').hide();
    }


    var pageData = {
      htmlStr: require('creditCard/addCreditCardSuccess.string'),
      renderData: {}
    }
    return {
      init: function() {
        renderPage();

      }
    }
  }
