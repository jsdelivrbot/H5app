/*
@author:chenke@jiedaibao.com
  date: 2015.11.20
descri:信用卡还款页面js
      1.采用路由区分不同模块，使用不同的js,渲染不同的page
      2.utls为一些公用方法
      3.保留一些全局变量
跟踪记录：
  1.因为要动态修改title，所以放弃单页面应用形式，跳转时增加修改search参数（其实应该找端上，开个接口修改title）
  2.

*/


//alert(navigator.userAgent);

  //'use strict';
  //var htmlStr = require('payment/serveSelf.html');
  //提供常用方法
  var utls = utls || {};
  utls = {
    getMyObjFromUrl: function(obj) {

      var tempObj = {};
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        tempObj[sParameterName[0]] = sParameterName[1];
      }
      for (var i in obj) {
        obj[i] = tempObj[i] ? tempObj[i] : obj[i];
      }

      return obj;
    },
    urlSearchToObj: function() {
      var tempObj = {};
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        tempObj[sParameterName[0]] = sParameterName[1];
      }
      return tempObj;
    },
    objToString: function(json) {

      var arr = [];

      for (var i in json) {
        var str = '' + i + '=' + json[i];
        arr.push(str);
      }

      var ms = arr.join('&');
      return ms;
    },
    render: function(opt) {
      var template = opt.template || '';
      var goal = opt.goal || $('.container');
      var templateData = opt.templateData || {};
      var tools = opt.tools || {};
      goal.html(microtemplate(template, {
        'data': templateData,
        'tools': tools
      }));
    },
    getLastFourNum: function(srcString) {
      var xingString = '**************************';
      if (srcString.length === 4) {
        return '**** **** **** ' + srcString;
      }
      var getString = xingString.substr(0, srcString.length - 4);

      var newString = getString + srcString.substr(srcString.length - 4, srcString.length);
      var emptyArr = [];
      for (var i = 0; i < newString.length; i += 4) {
        emptyArr.push(newString.substring(i, i + 4));
      }
      return emptyArr.join(' ');
    },
    addProterty: function(toObj, fromObj) {
      //将fromObj的属性添加覆盖到toObj，暂时只考虑简单数据
      for (var i in fromObj) {
        toObj[i] = fromObj[i];
      }
      return toObj;
    },
    getReqId: function(token) {
      var timeStamp = +(new Date()); //13位
      var token = token || utls.randomString(19);
      var wholeString = +(new Date()) + token;

      if (typeof(md5) === 'function') {
        return md5(wholeString);
      } else {
        return wholeString.substr(0, 32);
      }
      // return typeof(md5) === 'function' ? md5(wholeString) : wholeString.substr(0,32)

    },
    randomString: function(len) {
      //网上考的
      len = len || 32;
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length;
      var pwd = '';
      for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    checkBankDetailObj: function(obj) {
      //如果obj有键值为空字符串，则返回false
      var keyArr = ['bankname', 'id', 'remindDate', 'cardStatus', 'bankNo', 'noticeDays'];
      for (var i in keyArr) {
        if (obj[keyArr[i]] === '' || obj[keyArr[i]] === null) {
          return false
        }
      }
      return true;
    },
    getCssClassFromBankname: function(bankname) {
      if (bankname) {
        var tempArr = creditPayData.banks.filter(function(item, index, arr) {
          if (item.bankName === bankname) {
            return item;
          }
        });
        if (tempArr.length === 1) {
          return tempArr[0].cssClass;
        } else {
          return '';
        }

      }
    },
    getbankNameFromBankNo: function(bankNo) {
      if (bankNo) {
        var tempArr = creditPayData.banks.filter(function(item, index, arr) {
          if (item.bankNo === bankNo) {
            return item;
          }
        });
        if (tempArr.length === 1) {
          return tempArr[0].bankName;
        } else {
          return '';
        }

      }
    },
    getCssNameFromBankNo: function(bankNo) {
      if (bankNo) {
        var tempArr = creditPayData.banks.filter(function(item, index, arr) {
          if (item.bankNo === bankNo) {
            return item;
          }
        });
        if (tempArr.length === 1) {
          return tempArr[0].cssClass;
        } else {
          return '';
        }

      }
    },
    getDaysFromTwoDate: function(reminddate) {
      if (typeof(reminddate) === 'string') {
        reminddate = parseInt(reminddate);
      }
      var today = new Date();
      var todayNO = today.getDate();
      if (reminddate > todayNO) {
        return reminddate - todayNO;
      } else {

        //可以考虑直接按大小月份，二月等判断
        var month = today.getMonth() + 1;
        var year = today.getFullYear();
        var todayStr = year + '/' + month + '/' + todayNO;
        if (month !== 12) {
          var nextMonthTodayStr = year + '/' + (month + 1) + '/' + reminddate;
        } else {
          var nextMonthTodayStr = (year + 1) + '/' + (1) + '/' + reminddate;
        }
        var millionSeconds = (new Date(nextMonthTodayStr)).getTime() - (new Date(todayStr)).getTime();
        return millionSeconds / (24 * 60 * 60 * 1000)
      }

    },
    parseParam: function(param, key) {
      var paramStr = '';
      if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += '&' + key + '=' + encodeURIComponent(param);
      } else {
        $.each(param, function(i) {
          var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
          paramStr += '&' + utls.parseParam(this, k);
        });
      }
      return paramStr.substr(1);
    },
    selectToNewUls: function(theSelectDom) {
      var optionsArray = $(theSelectDom).find('option');
      var liHtmlArr = [];

      for (var i = 0; i < optionsArray.length; i++) {
        var tempDom = $(optionsArray[i]);
        if (tempDom.html().trim() === $(theSelectDom).val()) {
          //console.log('checked');
          liHtmlArr.push('<li class="checked"><div>' + tempDom.html().trim() + '</div></li>');
        } else {
          liHtmlArr.push('<li class=""><div>' + tempDom.html().trim() + '</div></li>');
        }
      }

      $('#selectUl').html(liHtmlArr.join(''));
      //console.log($('#selectUl').html());
      $('#selectUl').off('click', 'li');

      $('#selectUl').on('click', 'li', function() {
        $('.SelectContainer').hide();
        $('.selects').hide();
        $($(this).siblings()).removeClass('checked');
        $(this).addClass('checked');
        //console.log($(this).html());
        optionsArray.removeAttr('checked');
        $(theSelectDom).val($(this).html().replace('</div>', '').replace('<div>', ''));
        //$('#selectUl').html('');



        for (var i = 0; i < optionsArray.length; i++) {
          if ($(this).html() === $(optionsArray[i]).html()) {
            $(optionsArray[i]).attr('checked', 'checked');
          }
        }
        $(theSelectDom).change();
      });

      $('.selects').on('click', '#hideSelects', function() {
        $('.SelectContainer').hide();
        $('.selects').hide();
      });
    }
  };

  //提供ajax接口
  var services = {
    //baseUrl: 'https://github.com/', //配置基础的url hostdomain
    //  baseUrl: 'http://100.66.155.105:8080/payfront', //配置基础的url hostdomain
    baseUrl: '', //配置基础的url hostdomain

    commonPostAjax: function(opt) {
      var postUrl = opt.url || '';
      var postData = opt.data || {};
      postData.requestId = utls.getReqId(postData.token);
      var sucessFun = opt.sucessFun || function() {};
      var errorFun = opt.errorFun || function(e) {};
      $.ajax({
        url: postUrl,
        data: postData,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (typeof(data) === 'string') {
            data = JSON.parse(data);
          }
          sucessFun(data);
        },
        errorFun: function(e) {
          errorFun(e);
        }
      });
    },
    getBankFromBanNo: function(opt) {

      opt.url = opt.url || (services.baseUrl + '{{creditCardBinApi}}');
      services.commonPostAjax(opt);
    },
    addCreditCard: function(opt) {

      opt.url = opt.url || (services.baseUrl + '{{addCreditCardApi}}');
      services.commonPostAjax(opt);
    },
    delteCredit: function(opt) {
      opt.url = opt.url || services.baseUrl + '{{deleteCreditCardApi}}';
      services.commonPostAjax(opt);
    },
    getCreditDetail: function(opt) {
      opt.url = opt.url || (services.baseUrl + '{{getCreditDetailApi}}');
      services.commonPostAjax(opt);
    },
    creditPay: function(opt) {
      opt.url = opt.url || services.baseUrl + '{{creditCardRepayApi}}';
      services.commonPostAjax(opt);
    },
    updateCreditCard: function(opt) {
      opt.url = opt.url || services.baseUrl + '{{updateCreditCardApi}}';
      services.commonPostAjax(opt);
    }
  };
  var creditPayData = {
    //各个页面公用全局变量
    urls: {},
    money: '',
    theResData: '',
    cardDetail: {
      "id": '',
      "memberId": '',
      "account": '',
      "name": '',
      "bankName": '',
      "bankNo": '',
      "remindDate": '',
      "paymethod": '',
      "cardType": '',
      "status": '',
      "cardStatus": '',
      "comment": '',
      "createAt": '',
      "amount": ''
    },
    pageMap: {
      'creditPay': creditPayFun,
      'addCreditCard': addCreditCard,
      'manageCreditCard': manageCreditCard,
      'addCreditCardSuccess': addCreditCardSuccess,
      '/': creditPayFun
    },
    banks: [{
      bankNo: 'CCB',
      cardLogo: '../../img/creditCard/jianshe.png',
      cssClass: 'jianshe',
      bankName: '中国建设银行'
    }, {
      bankNo: 'CEB',
      cardLogo: '../../img/creditCard/guangda.png',
      cssClass: 'guangda',
      bankName: '中国光大银行'
    }, {
      bankNo: 'CIB',
      cardLogo: '../../img/creditCard/xingye.png',
      cssClass: 'xingye',
      bankName: '兴业银行'
    }, {
      bankNo: 'CMB',
      cardLogo: '../../img/creditCard/zhaoshang.png',
      cssClass: 'zhaoshang',
      bankName: '招商银行'
    }, {
      bankNo: 'CMBC',
      cardLogo: '../../img/creditCard/mingsheng.png',
      cssClass: 'minsheng',
      bankName: '中国民生银行'
    }, {
      bankNo: 'CITIC',
      cardLogo: '../../img/creditCard/zhongxin.png',
      cssClass: 'zhongxin',
      bankName: '中信银行'
    }, {
      bankNo: 'BOB',
      cardLogo: '../../img/creditCard/beijing.png',
      cssClass: 'beijing',
      bankName: '北京银行'
    }, {
      bankNo: 'GDB',
      cardLogo: '../../img/creditCard/guangfa.png',
      cssClass: 'guangfa',
      bankName: '广东发展银行'
    }, {
      bankNo: 'SPDB',
      cardLogo: '../../img/creditCard/pufa.png',
      cssClass: 'pufa',
      bankName: '浦发银行'
    }, {
      bankNo: 'HXB',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'huaxia',
      bankName: '华夏银行'
    }, {
      bankNo: 'PABC',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'pingan',
      bankName: '平安银行'
    }, {
      bankNo: 'ICBC',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'gongshang',
      bankName: '工商银行'
    }, {
      bankNo: 'BSB',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'baoshang',
      bankName: '包商银行'
    }, {
      bankNo: 'ABC',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'nongye',
      bankName: '农业银行'
    }, {
      bankNo: 'BOC',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'zhongguo',
      bankName: '中国银行'
    }, {
      bankNo: 'BCOM',
      cardLogo: '../../img/creditCard/huaxia.png',
      cssClass: 'jiaotong',
      bankName: '交通银行'
    }],
    postData: {},
    dataFromUrl: utls.getMyObjFromUrl({
      token: '',
      id: ''
    })
  };


  //初始化
  var init = {
    baseEvent: function() {


      window.selectInit = function() {
        var htmlStr = require('creditCard/select.string');
        var $doc = $(document);
        var $body = $doc.find('body');
        $body.append(htmlStr);
      }

      selectInit();
      window.onhashchange = function() {
        //监听hash变化，渲染不同页面
        var hashStr = location.hash.replace('#', '');
        hashProxyModule(hashStr);
      };
      window.onhashchange();
    }
  };
  //utls.getReqId('abc')

  //根据不同的hash，渲染不同页面
  function hashProxyModule(str) {
    if (creditPayData.pageMap[str]) {
      var currentPage = (function(fun) {
        return fun();
      })(creditPayData.pageMap[str]);
      currentPage.init();

    } else {
      //location.hash = '#addCreditCard';
      addCreditCard().init();

      return true;
    }
  }


  function main() {
    init.baseEvent();
  }
  $(main());


;
