/*guofei write*/
;(function () {
    /*data 数据初始*/
    var chooseToken = url('?token');
    var choosePayKind = url('?payKind');
    var chooseProvId = null;
    var chooseCityId = null;
    var chooseCominstCd = null;
    var chooseCominstNm = null;
    var userNumber = null;
    var chooseCominstRmk1 = null;
    var companyStr = null;
    var cityStr = null;
    var cpData = null;
    var cityData = null;
    var cityInitAjax = null;
    var jsNum = [];
    //获取数据源
    cityAjax();
    //地区
    function cityAjax() {
        var requestObj = {
            token: chooseToken,
            payKind: choosePayKind  //缴费类型  04 水费，05电费 06煤气费
        };
		jdb.showLoading();
        $.ajax({
            url: '{{getHydropowerCoalCityApi}}',
            type: 'post',
            dataType: 'json',
            data: {
                reqData: JSON.stringify(requestObj)
            },
            success: function (jsonData) {
				jdb.hideLoading();
                cityData = jsonData;
                var jsonFlag = false;
                if(jsonData.error && jsonData.error.returnCode * 1 === 1) {
                    jsonFlag = true;
                }
                if(jsonData.data && jsonData.data.compList && jsonData.data.compList.length === 0) {
                    jsonFlag = true;
                }
                if(jsonFlag) {
                    toastError('响应数据失败，请稍后重试！');
                }else {
                    afterGetCity(jsonData);
                }
            },
            error: function () {
				jdb.hideLoading();
                toastError('请求接口出现错误，请稍后再试！');
            }
        });
    }

    function afterGetCity(jsonData) {
        var suData = jsonData.data.cityList;
        companyAjax(suData[0].provId, suData[0].cityId);
        //页面加载绑定
        //绑定地区
        var cityListLi = '';
        if (cityData.error.returnCode * 1 === 0) {
            cityStr = suData;
            utils.domCityBind($('#cityList'), cityStr);
            utils.clickCityDom(suData);
        }
        //初始化绑定地区
        if (suData.length > 0) {
            $('.hasCity').html(suData[0].cityNm);
            chooseCityId = suData[0].cityId;
        }
        cityInitAjax = suData[0].cityId;
        //选择地区
        //if(suData.length !== 1) {
            $('#city').on('touchstart', function (e) {
                e.preventDefault();
                $(this).css('backgroundColor', '#f0f2f5');
                $('#cityList li').each(function () {
                    if ($(this).attr('CityId') == chooseCityId) {
                        $(this).addClass('searchLink');
                    }
                });
            });
            $('#city').on('touchend', function (e) {
                e.preventDefault();
                location.href = '#city';
                utils.initHash();
                $(this).css('backgroundColor', '#fff');
            });
        //}else {
            //$('.hasCity').removeClass('hasCity').addClass('hasCity_c');
        //}
    }

    //缴费单位
    function companyAjax(provinceId, cityId) {
        var companyReData = {
            token: chooseToken,  //借贷宝ID
            provinceId: provinceId,  //省编号
            cityId: cityId,  //市编号
            payKind: choosePayKind  //缴费类型  04 水费，05电费 06煤气费
		};
		jdb.showLoading();
        $.ajax({
            url: '{{getHpydropowerCoalCompanyApi}}',
            type: 'post',
            dataType: 'json',
            data: {
                reqData: JSON.stringify(companyReData)
            },
            success: function (jsonData) {
				jdb.hideLoading();
                var jsonFlag = false;
                if(jsonData.error && jsonData.error.returnCode * 1 === 1) {
                    jsonFlag = true;
                }
                if(jsonData.data && jsonData.data.compList && jsonData.data.compList.length === 0) {
                    jsonFlag = true;
                }
                if(jsonFlag) {
                    toastError('响应数据失败，请稍后重试！');
                }else {
                    getCompanySuccess(jsonData);
                }
            },
            error: function () {
				jdb.hideLoading();
                toastError('请求接口出现错误，请稍后再试！');
            }
        });
    }

    function getCompanySuccess(jsonData) {
        cpData = jsonData.data.compList;
        //初始化绑定缴费单位
        var companyListLi = '';
        if (jsonData.error.returnCode * 1 === 0) {
            companyStr = cpData;
            utils.domComBind($('#companyList'), cpData, true);
            utils.clickComDom();
        }
        //页面初始化绑定默认缴费单位

        var comBlen = true;//目的绑定第一个
        for (var i = 0; i < cpData.length; i++) {
            if (cpData[i].cityId == chooseCityId) {
                if(comBlen) {
                    $('.hasCompany').html(cpData[i].instNm);
                    chooseCominstNm = cpData[i].instNm;
                    chooseCominstCd = cpData[i].instCd;
                    chooseCominstRmk1 = cpData[i].instRmk1;
                    chooseProvId = cpData[i].provId;
                    comBlen = false;
                    if(jsNum.length == 1){
                        $('.has_com').removeClass('has_com').addClass('hasCity_c');
                    }else {
                        $('.hasCity_c').removeClass('hasCity_c').addClass('has_com');
                    }
                }
            }
        }
        //选择缴费单位
        $('#company').on('touchstart', function (e) {
            e.preventDefault();
            $(this).css('backgroundColor', '#f0f2f5');
            $('#companyList li').each(function () {
                if ($(this).attr('instCd') == chooseCominstCd) {
                    $(this).addClass('searchLink');
                }
            });
        });
        $('#company').on('touchend', function (e) {
            e.preventDefault();
            if (jsNum.length > 1) {
                location.href = '#company';
                utils.initHash();
            }else {
                $('.has_com').removeClass('has_com').addClass('hasCity_c');
            }
            $(this).css('backgroundColor', '#fff');
        });
    }

    //结束
    var utils = {
        /*获取当前时间时间*/
        applyTimeData: function () {
            var nowTime = new Date();
            var nowYear = nowTime.getFullYear();
            var nowMonth = nowTime.getMonth() + 1;
            var nowDay = nowTime.getDate();
            var nowHours = nowTime.getHours();
            var nowMinutes = nowTime.getMinutes();
            var nowSeconds = nowTime.getSeconds();
            return nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
        },
        //地区dom li渲染
        domCityBind: function (domList, Str, defaultLi) {
            var listStr = '';
            for (var i = 0; i < Str.length; i++) {
                listStr += '<li cityId="' + Str[i].cityId + '" provId="' + Str[i].provId + '"><span>' + Str[i].cityNm + '</span></li>';
            }
            domList.html(listStr);
            if (defaultLi == true) {
                domList.children().eq(0).addClass('searchLink');
            }
        },
        //单位dom li渲染
        domComBind: function (domList, Str, defaultLi) {
            var listStr = '';
            for (var i = 0; i < Str.length; i++) {
                if (chooseCityId == Str[i].cityId) {
                    jsNum.push(Str[i].cityId);
                    listStr += '<li instCd="' + Str[i].instCd + '" instNm="' + Str[i].instNm + '" instRmk1="' + Str[i].instRmk1 + '" >' + '<span>' + Str[i].instNm + '</span></li>';
                }
            }
            domList.html(listStr);
            if (defaultLi == true) {
                domList.children().eq(0).addClass('searchLink');
            }
        },
        //地区li列表点击事件
        clickCityDom: function (suData) {
            $('.powerList li').on('touchstart', function (e) {
                e.preventDefault();
                jsNum = [];
                $('#cityList').children().removeClass('searchLink');
                $(this).addClass('searchLink');
                $(this).css('backgroundColor', '#f0f2f5');
                chooseCityId = $(".searchLink").attr("cityId");
                for (var j = 0; j < suData.length; j++) {
                    if ($(".searchLink").attr("cityId") == suData[j].cityId) {
                        $('#cityList li').eq(j).addClass('searchLink');
                    }
                }
                if(cityInitAjax != $(this).attr('cityId')) {
                    cityInitAjax = $(this).attr('cityId');
                    companyAjax($(this).attr('provId'), $(this).attr('cityId'));
                }
            });
            $('.powerList li').on('touchend', function (e) {
                e.preventDefault();
                utils.initHash();
                $('#cityList').children().removeClass('searchLink');
                $('.hasCity').html($(this).text());
                $(this).css('backgroundColor', '#fff');
                history.back();
            });
        },
        //单位li列表点击事件
        clickComDom: function () {
            $('#companyList li').on('touchstart', function (e) {
                e.preventDefault();
                $('#companyList').children().removeClass('searchLink');
                $(this).addClass('searchLink');
                $(this).css('backgroundColor', '#f0f2f5');
            });
            $('#companyList li').on('touchend', function (e) {
                e.preventDefault();
                utils.initHash();
                $('.hasCompany').html($(this).text());
                chooseCominstCd = $(this).attr('instCd');
                chooseCominstNm = $(this).attr('instNm');
                chooseCominstRmk1 = $(this).attr('instRmk1');
                $(this).css('backgroundColor', '#fff');
                history.back();
            });
        },
        //搜索框绑定模糊查询
        bindFuzzy: function() {
            $('#citySearch').on('input', function () {
                var cityStrValue = $(this).val();
                var cityStrPlist = '';
                utils.citySearchQuery(cityStrValue, cityStrPlist);
            });
            $('#searchText').on('input', function () {
                var strValue = $(this).val();
                var strPlist = '';
                utils.comSearchQuery(strValue, strPlist);
            });
        },
        //地区搜索模糊查询
        citySearchQuery: function (strValue, strPlist) {
            for (var i = 0; i < cityStr.length; i++) {
                if (cityStr[i].cityNm.indexOf(strValue) > -1) {
                    strPlist += '<li ' + (cityStr[i].cityId == chooseCityId ? (' class="searchLink" ') : '') + ' cityId="' + cityStr[i].cityId + '" provId="' + cityStr[i].provId + '" >' + '<span>' + cityStr[i].cityNm + '</span></li>';
                }
            }
            $('#cityList').html(strPlist);
            $('#cityList li').on('touchstart', function (e) {
                e.preventDefault();
                $('#cityList').children().removeClass('searchLink');
                $(this).addClass('searchLink');
                $(this).css('backgroundColor', '#f0f2f5');
                chooseCityId = $(".searchLink").attr("cityId");
                companyAjax($(this).attr('provId'), $(this).attr('cityId'));
            });
            $('#cityList li').on('touchend', function (e) {
                e.preventDefault();
                utils.initHash();
                chooseProvId = $(this).attr('provId');
                $('.hasCity').html($(this).text());
                $('#citySearch').val('');
                $(this).css('backgroundColor', 'none');
                utils.domCityBind($('#cityList'), cityStr);
                utils.clickCityDom(cityStr);
                history.back();
            });
        },
        //单位搜索模糊查询
        comSearchQuery: function (strValue, strPlist) {
            for (var i = 0; i < companyStr.length; i++) {
                if (companyStr[i].instNm.indexOf(strValue) > -1 && companyStr[i].cityId == chooseCityId) {
                    strPlist += '<li ' + (companyStr[i].instCd == chooseCominstCd ? (' class="searchLink" ') : '') + ' instCd="' + companyStr[i].instCd + '" instNm="' + companyStr[i].instNm + '" instRmk1="' + companyStr[i].instRmk1 + '" >' + '<span>' + companyStr[i].instNm + '</span></li>';
                }
            }
            $('#companyList').html(strPlist);
            $('#companyList li').on('touchstart', function (e) {
                e.preventDefault();
                $('#companyList').children().removeClass('searchLink');
                $(this).addClass('searchLink');
                $(this).css('backgroundColor', '#f0f2f5');
            });
            $('#companyList li').on('touchend', function (e) {
                e.preventDefault();
                utils.initHash();
                $('.hasCompany').html($(this).text());
                chooseCominstCd = $(this).attr('instCd');
                chooseCominstNm = $(this).attr('instNm');
                chooseCominstRmk1 = $(this).attr('instRmk1');
                $('#searchText').val('');
                $(this).css('backgroundColor', 'none');
                utils.domComBind($('#companyList'), companyStr);
                utils.clickComDom();
                history.back();
            });
        },
        //页面跳转，回退
        initHash: function () {
            window.onhashchange = function () {
                var hashStr = location.hash.replace('#', '');
                utils.renderPage(hashStr);
            };
            window.onhashchange();
        },
        renderPage: function (hashStr) {
            if (hashStr && hashStr === 'city') {
                $('.SecondPage').removeClass('hidden');
                $('body').addClass('disBg');
                $('.thirdPage').addClass('hidden');
                $('.fristPage').addClass('hidden');
            } else if (hashStr && hashStr === 'company') {
                $('.thirdPage').removeClass('hidden');
                $('body').removeClass('disBg');
                $('.SecondPage').addClass('hidden');
                $('.fristPage').addClass('hidden');
            } else {
                $('body').removeClass('disBg');
                $('.fristPage').removeClass('hidden');
                $('.thirdPage').addClass('hidden');
                $('.SecondPage').addClass('hidden');
            }
        },
        //搜索框聚焦失焦状态
        searchStates: function() {
            var searchText = $('.searchText');
            searchText.on('focus', function () {
                $(this).val('');
                $(this).addClass('searchfocus');
            });
            searchText.on('blur', function () {
                var strVal = $(this).val();
                if (strVal == '搜索' || strVal == '') {
                    $(this).val('搜索');
                    $(this).removeClass('searchfocus');
                }
            });
        },
        //文本框value状态
        textValue: function() {
            $('#seeBill').on('focus', function () {
                $(this).val('');
                if ($(this).val() == '') {
                    $('.button').addClass('disabled');
                }
            });
            $('#seeBill').on('input', function () {
                userNumber = $(this).val();
                if (userNumber == '') {
                    $('.button').addClass('disabled');
                } else {
                    $(this).css('color', '#333');
                    $('.button').removeClass('disabled');
                }
            });
        },
        //给按钮绑定事件
        buttonClick: function() {
            $('#nextButton').on('touchstart',function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                $(this).addClass('btnCol');
            });
            $('#nextButton').on('touchend', function () {
                $(this).removeClass('btnCol');
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var paramObj = {
                    token: chooseToken,
                    provinceId: chooseProvId,
                    cityId: chooseCityId,
                    payKind: choosePayKind,
                    institutionNo: chooseCominstCd,
                    institutionName: chooseCominstNm,
                    billKey: userNumber,
                    instRmk1: chooseCominstRmk1
                };
                if($(this).hasClass('disabled') == false) {
                    utils.checkBillStatus(paramObj);
                }
                return false;
            });
        },
        /**
         *@params object paramObj 传递的参数
         */
        checkBillStatus: function(paramObj) {
            $('#nextButton').addClass('disabled');
			jdb.showLoading();
            $.ajax({
                url: '{{rechargeListApi}}',
                dataType: 'json',
                data: {
                    reqData: JSON.stringify(paramObj)
                },
                type: 'post',
                success: function(res) {
					jdb.hideLoading();
                    var jumpFlag = false;
                    //后台提示不存在时，跳转到错误页面
                    if (res.error && res.error.returnCode * 1 === 1 && res.error.returnMessage === 'R20001') {
                        jumpFlag = true;
                    }
                    // 账号虽然存在，但是账单为空的时候,也挑战到错误页面
					if (res.data) {
						if (res.data.billList && res.data.billList == null) {
							jumpFlag = true;
						}
						if (res.data.billList && res.data.billList.length == 0) {
							jumpFlag = true;
						}
					}
				if (res.error && res.error.returnCode * 1 !== 0 && jumpFlag === false) {
					toastError(res.error.returnUserMessage);
					return false;
				}
                    if (jumpFlag) {
                        $('#seeBill').val('');
                        location.href = './rechargeResFail.html?billKey=' + paramObj.billKey+ '&institutionName=' + paramObj.institutionName + '#numberFail';
                    } else {
                        $('#seeBill').val('');
                        location.href = './rechargeList.html' + '?token=' + chooseToken + '&provinceId=' + chooseProvId + '&cityId=' + chooseCityId + '&payKind=' + choosePayKind + '&institutionNo=' + chooseCominstCd + '&institutionName=' + chooseCominstNm + '&billKey=' + userNumber + '&instRmk1=' + chooseCominstRmk1;
                    }
                },
                error: function () {
                    toastError('请求接口出现错误，请稍后再试！');
                    $('#nextButton').removeClass('disabled');
                    $('#seeBill').val(userNumber);
					jdb.hideLoading();
                }
            });
        },
        init: function () {
            utils.initHash();
            utils.bindFuzzy();
            utils.searchStates();
            utils.textValue();
            utils.buttonClick();
        }
    };
    utils.init();
})();
