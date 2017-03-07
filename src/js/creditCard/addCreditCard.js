  //添加信用卡
  function addCreditCard() {

      function renderPage() {
          var htmlStr = pageData.htmlStr;

          utls.render({
              template: htmlStr,
              templateData: {
                  dataFromUrl: pageData.dataFromUrl,
                  bankList: creditPayData.banks
              }
          });
          initEvent();
          initStatus();
      }

      function initStatus() {
          //$('#ifRemind').attr('checked', true)
          //初始化提醒日期
          var dateNo = (new Date()).getDate();
          if (dateNo <= 28) {

              $('#remindDate').val(dateNo + '日');
              $('.dateFont').html($('#remindDate').val().trim() + '');
          } else {
              $('#remindDate').val(28 + '日');
              $('.dateFont').html($('#remindDate').val().trim() + '');
          }

          //初始化隐藏删除用的叉叉
          $('.deleteBox').hide();

          //隐藏 银行一栏
          $('#bankName').parents('li').hide();

          $('#cusName').parents('li').css('border-bottom', '0px solid #e6e8eb');


          document.title = '添加信用卡';

          utls.selectToNewUls($('#remindDate'));
          $('.SelectContainer').hide();
          $('.selects').hide();

          var ua = navigator.userAgent;
          if (ua.match(/ipad|ios|iphone/i)) {
              //location.href = 'phone.html' + (from ? ('?from=' + from) : '');
              $('#remindDate').css('z-index', '11');
          }
          //$(this).attr('disabled', 'disabled');
          //$('#confirm').attr('disabled', 'disabled');

          $('#confirm').attr('disabled', 'disabled').addClass('disableButton');


      }

      function initEvent() {

          $('#addCreditCard').on('click', '.deleteBox', function() {
              var inputZep = $(this).prev();
              inputZep.val('');
              //alert('');
          });
          $('#addCreditCard').on('touch', '.deleteBox', function() {
              var inputZep = $(this).prev();
              inputZep.val('');
              //alert('');
          });
          $('#addCreditCard').on('change', '#remindDate', function() {
              //alert('1');
              $('.dateFont').html($('#remindDate').val().trim() + '');
          });

          $('#addCreditCard').on('click', '.dateFont', function(e) {


              $('.SelectContainer').show();
              $('.selects').show();

              setTimeout(function() {
                  if (pageData.ifFisrtshowSe) {
                      if ($('.checked').position().top > 200) {
                          //console.log($('.checked').position().top);
                          $("#selectUl").scrollTop($('.checked').position().top - 200);
                          //console.log($('.checked').position().top);
                      };
                  }
                  pageData.ifFisrtshowSe = false;
              }, 200);

              //console.log(e);
              //return false;

          });

          $('#addCreditCard').on('change', '#ifRemind', function() {
              //alert('1');
              //待UE确认
              if ($('#ifRemind').attr('checked')) {
                  //$('#remindDate').show();
                  $('#ifRemind').parents('li').css('border-bottom', '1px solid #e6e8eb').next().show();
                  //$('#ifRemind').parents('li').css('border-bottom', '0px solid #e6e8eb');
              } else {
                  //$('#remindDate').hide();
                  $('#ifRemind').parents('li').css('border-bottom', '0px solid #e6e8eb').next().hide();
              }

          });

          $('#addCreditCard').on('blur', '#bankNo', function() {
              //信用卡号特征，待确认
              //alert('信用卡blur');
              //$('#bankName').val('农业银行');

              setTimeout(function() {

                  if (!pageData.ifcheckIng) {
                      toCheckCard(function() {}, false);
                  }

              }, 500);

              //var thisDom = $(this);
              //thisDom.attr('type', 'number');



          });

          $('#addCreditCard').on('input', '#bankNo', function(e) {
              var thisDom = $(this);
              thisDom.attr('type', 'text');
              if ($(this).val() === '') {
                  return false;
              }
              ifDisablleConfirm();
              //console.log(thisDom.val().trim());
              var cardString = thisDom.val().trim().replace(/\s/g, '');
              // alert(cardString);
              //console.log(cardString);
              if (!/^[0-9]*$/.test(cardString)) {
                  $(this).val('');
                  return false;
              }
              if (cardString.length === 20) {
                  cardString = cardString.substr(0, 19);
                  //return false
              }
              var emptyArr = [];
              for (var i = 0; i < cardString.length; i += 4) {
                  emptyArr.push(cardString.substring(i, i + 4));
              }
              //console.log(emptyArr.join('  '))
              thisDom.val(emptyArr.join('  '));
              setTimeout(function() {
                  var o = document.getElementById("bankNo");
                  try {
                      //alert(o.selectionEnd);
                      o.setSelectionRange(o.value.length, o.value.length);
                      // o.selectionEnd =
                      //o.setSelectionRangecollapseToEnd();
                  } catch (e) {
                      //alert(e);
                  }

                  o.focus();
              }, 200);
              thisDom.focus();


          });

          $('#addCreditCard').on('input', '#cusName', function(e) {
              //检验是否可点击confirm
              ifDisablleConfirm();
          });



          $('#addCreditCard').on('blur', 'input', function() {
              //if(hasClass){}
              var thidDom = $(this);
              setTimeout(function() {
                  var nextDom = thidDom.next();
                  if ($(nextDom).hasClass('deleteBox')) {
                      $(nextDom).hide();
                  }
              }, 200);


          });


          $('#addCreditCard').on('focus', 'input', function() {
              //if(hasClass){}
              var nextDom = $(this).next();
              if ($(nextDom).hasClass('deleteBox')) {
                  $(nextDom).show();
              }

          });

          $('#addCreditCard').on('click', '#confirm', function() {
              //$('#confirm').attr('disabled', 'disabled');
              $(this).attr('disabled', 'disabled');
              if (pageData.ifcheckCardNo) {
                  confirmAddCreditCard();
              } else {
                  var tempObj = updatePageData();
                  if (checkData(tempObj) && (!pageData.ifcheckIng)) {
                      toCheckCard(confirmAddCreditCard);
                  } else {
                      if (pageData.ifcheckIng) {
                          toastError('请等待银行卡校验结果');
                      }
                      $(this).removeAttr('disabled');

                  }

              }

          });

          $('#addCreditCard').on('change', '#bankListSelect', function() {
              var tempName = $('#bankListSelect').val();
              $('#bankName').val(tempName);
              var tempArr = creditPayData.banks.filter(function(item, index, arr) {
                  if (item.bankName === tempName) {
                      return item;
                  }
                  //return item.bankName === tempName;
              });
              var newClassName = tempArr[0].cssClass;
              var zepObj = $('.logoContainer');
              zepObj.attr('class', '').attr('class', 'logoContainer ' + newClassName);

          });


          /* window.onpopstate = function(event) {
             if(window.location.search.indexOf('nocard')!=-1){
               window.location.href='https://www.baidu.com';
             }

           };*/


      }

      function checkData(obj) {

          if (!/^\d{14,19}$/.test(obj.bankcard)) {
              toastError('请您输入正确的银行卡号');
              return false;
          }
          if (!/[\u4E00-\u9FA5]{2,15}(?:·[\u4E00-\u9FA5]{2,15})*/.test(obj.cardname)) {
              toastError('请您输入正确的姓名');
              return false;
          }
          return true;
      }

      function updatePageData() {
          var tempObj = {};
          tempObj.bankcard = parseFloat($('#bankNo').val().trim().replace(/\s/g, '')).toString();

          tempObj.cardname = $('#cusName').val().trim();
          tempObj.bankname = $('#bankName').val().trim();
          tempObj.reminddate = parseInt($('#remindDate').val().trim());
          tempObj.cardstatus = $('#ifRemind').attr('checked') ? '1' : '0';
          var tempArr = creditPayData.banks.filter(function(item, index, arr) {
              if (item.bankName === tempObj.bankname) {
                  return item;
              }
          });
          tempObj.bankno = tempArr[0].bankNo;

          return utls.addProterty(tempObj, creditPayData.dataFromUrl);
      }

      function toCheckCard(callBack, flageIfShowToast) {
          pageData.ifcheckIng = true;
          var bankcardString = parseFloat($('#bankNo').val().trim().replace(/\s/g, '')).toString();

          if (/^\d{14,19}$/.test(bankcardString)) {
              var tempObj = tempObj || {};
              tempObj = utls.addProterty(tempObj, creditPayData.dataFromUrl);
              tempObj.memberID = creditPayData.dataFromUrl.memberID;
              tempObj.bankcard = bankcardString;
              tempObj.cardname = $('#cusName').val().trim();

              services.getBankFromBanNo({
                  data: tempObj,
                  sucessFun: function(resData) {
                      //根据数据，待完善
                      if (resData.error.returnCode * 1 === 0 && resData.data.bankNm) {

                          var tempArr = creditPayData.banks.filter(function(item, index, arr) {
                              if (item.bankNo === resData.data.bankCorg) {
                                  $('#confirm').removeAttr('disabled').removeClass('disableButton');
                                  return item;
                              }
                          });

                          if (tempArr.length === 1) {
                              var newClassName = tempArr[0].cssClass;
                              var zepObj = $('.logoContainer');
                              $('#confirm').css('background-color', '#2a8bf8');
                              zepObj.attr('class', '').attr('class', 'logoContainer ' + newClassName);

                              $('#bankName').val(tempArr[0].bankName);
                              $('#bankName').parents('li').show();
                              $('#cusName').parents('li').css('border-bottom', '1px solid #e6e8eb');
                              pageData.ifcheckCardNo = true;
                              callBack && callBack();
                          } else {
                              toastError('对不起，暂不支持此银行信用卡还款');

                              pageData.ifcheckCardNo = false;
                          }
                          $('#confirm').removeAttr('disabled').removeClass('disableButton');
                      } else {
                          if (!(typeof(flageIfShowToast) != 'undefied' && flageIfShowToast === false)) {
                              toastError(resData.error.returnUserMessage);
                              $('#confirm').removeAttr('disabled').removeClass('disableButton');
                          }

                          pageData.ifcheckCardNo = false;
                          /*console.log('cc');*/

                      }


                      pageData.ifcheckIng = false;
                  },
                  errorFun: function(e) {
                      //console.log(e);

                      $('#confirm').removeAttr('disabled').removeClass('disableButton');
                      pageData.ifcheckIng = false;
                  }
              });
          } else {
              pageData.ifcheckIng = false;
              if (($('#bankNo').val().trim()) != '') {
                  // toastError('请输入正确地银行卡号');
              }
              //$(this).attr('disabled', 'disabled');
          }
      }

      function confirmAddCreditCard() {
          var tempObj = updatePageData();
          if (checkData(tempObj)) {
              services.addCreditCard({
                  data: tempObj,
                  sucessFun: function(resData) {
                      if (resData.error.returnCode * 1 === 0) {
                          creditPayData.cardDetail = resData.data;
                          creditPayData.cardDetail.bankName = tempObj.bankname;
                          creditPayData.cardDetail.bankNo = tempObj.bankno;
                          creditPayData.dataFromUrl.id = resData.data.id;
                          //添加银行卡详情的数据
                          //window.location.href = window.location.path + window.location.search + '&id=' + resData.data.id+'#addCreditCardSuccess'
                          // window.location.href = '#addCreditCardSuccess';
                          var pagefun = addCreditCardSuccess();
                          pagefun.init();

                      } else {
                          toastError(resData.error.returnUserMessage);

                      }
                      $('#confirm').removeAttr('disabled').removeClass('disableButton');
                  }
              });
          } else {
              $('#confirm').removeAttr('disabled');
          }

      }

      function ifDisablleConfirm() {
          if (($('#cusName').val().trim() != '') && ($('#bankNo').val().trim() != '')) {
              $('#confirm').removeAttr('disabled').removeClass('disableButton');
          } else {
              $('#confirm').attr('disabled', 'disabled').addClass('disableButton');
          };
      }
      var pageData = {
          htmlStr: require('creditCard/addCreditCard.string'),
          ifcheckCardNo: false,
          ifcheckIng: false,
          ifFisrtshowSe: true
      }

      return {
          init: function() {
              renderPage();

              //initEvent();
          }
      }
  }
