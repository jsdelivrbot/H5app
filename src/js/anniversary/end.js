/**
 * Created by zlei on 2016/8/3.
 */
var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') >= 0;

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
});
var myH = $(window).height(),
    myInterval, time = 0;

var page_back, page_btn, page_downBtn;

var page_1, page_1_txt1, page_1_txt2, page_1_txt3, page_1_back;
var page_2, page_2_txt1, page_2_txt2, page_2_txt3, page_2_back;
var page_3, page_3_txt1, page_3_txt2, page_3_txt3, page_3_txt4, page_3_back1, page_3_back2, page_3_back3, page_3_back4, page_3_back5, page_3_back6;
var endPage = document.getElementById("end");
var now = 1,
    tempPage, deltaNum;
window.onload = function() {
    myInterval = setInterval(function() {
        time += 1;
        if (time > 3) {
            clearInterval(myInterval);
            loadImg();
        }
        $('#load-bar span').html(time + "%");
    }, 150 + 250 * Math.random());
};


var imgNum = 0;

function loadImg() {
    $.imgpreload(assets, {
        each: function() {
            var status = $(this).data('loaded') ? 'success' : 'error';
            if (status == "success") {
                var v = (parseFloat(++imgNum) / assets.length).toFixed(2);
                $('#load-bar span').html(Math.round(v * 100) + "%");
            }
        },
        all: function() {
            loadEnd();
        }
    });
}

function loadEnd() {
    $('#load-bar span').html("100%");
    $(".loading").fadeOut();
    setStage();
    showEndPage();
}





function setStage() {

    page_back = new lImg("../../img/anniversary/back.gif", endPage, 0, 0, 640);

    page_1 = new lDiv(endPage, 0, 0, 640, 1138, "", true);
    page_1_back = new lImg("../../img/anniversary/img_1.png", page_1, 315, myH - 828, 325);
    page_1_back.hide();

    page_1_txt1 = new lImg("../../img/anniversary/page_1Txt_1.png", page_1, 42, 66, 399);
    page_1_txt1.hide();
    page_1_txt2 = new lImg("../../img/anniversary/page_1Txt_2.png", page_1, 42, 413, 265);
    page_1_txt2.hide();
    page_1_txt3 = new lImg("../../img/anniversary/page_1Txt_3.png", page_1, 42, 645, 266);
    page_1_txt3.hide();

    //-------------------------------------------------------------
    page_2 = new lDiv(endPage, 0, 0, 640, 1138, "", true);

    page_2_txt1 = new lImg("../../img/anniversary/page_2Txt_1.png", page_2, 38, 61, 563);
    page_2_txt1.hide();
    page_2_txt2 = new lImg("../../img/anniversary/page_2Txt_2.png", page_2, 355, 370, 247);
    page_2_txt2.hide();
    page_2_txt3 = new lImg("../../img/anniversary/page_2Txt_3.png", page_2, 355, 610, 248);
    page_2_txt3.hide()
    page_2_back = new lImg("../../img/anniversary/img_2.png", page_2, 0, myH - 725, 343);
    page_2_back.hide();
    //-------------------------------------------------------------


    page_3 = new lDiv(endPage, 0, 0, 640, 1138, "", true);

    page_3_txt1 = new lImg("../../img/anniversary/page_3Txt_1.png", page_3, 30, 57, 581);
    page_3_txt1.hide();
    page_3_txt2 = new lImg("../../img/anniversary/page_3Txt_2.png", page_3, 37, 237, 573);
    page_3_txt2.hide();
    page_3_txt3 = new lImg("../../img/anniversary/page_3Txt_3.png", page_3, 37, 350, 572);
    page_3_txt3.hide();
    page_3_txt4 = new lImg("../../img/anniversary/page_3Txt_4.png", page_3, 37, 431, 472);
    page_3_txt4.hide();


    page_3_back3 = new lImg("../../img/anniversary/img_5.png", page_3, 100, myH - 382, 104);
    page_3_back3.hide();
    page_3_back4 = new lImg("../../img/anniversary/img_5.png", page_3, 120, myH - 322, 60);
    page_3_back4.hide();
    page_3_back5 = new lImg("../../img/anniversary/img_5.png", page_3, 120, myH - 412, 50);
    page_3_back5.hide();
    page_3_back6 = new lImg("../../img/anniversary/img_5.png", page_3, 120, myH - 360, 70);
    page_3_back6.hide();



    page_3_back1 = new lImg("../../img/anniversary/img_3.png", page_3, 35, myH - 456, 210);
    page_3_back1.hide();
    page_3_back2 = new lImg("../../img/anniversary/img_4.png", page_3, 400, myH - 470, 213);
    page_3_back2.hide();


    TweenMax.to(page_3_back3, 2, { x: 350, repeat: -1 });
    TweenMax.to(page_3_back4, 2, { x: 350, repeat: -1, delay: .5 });
    TweenMax.to(page_3_back5, 2, { x: 400, repeat: -1, delay: 1.2 });
    TweenMax.to(page_3_back6, 2, { x: 380, repeat: -1, delay: 1.5 });



    page_btn = new lImg("../../img/anniversary/btn_1.png", page_3, 174, myH - 147, 326);
    page_btn.hide();



    var pageVisibility = (function() {
        var prefixSupport, keyWithPrefix = function(prefix, key) {
            if (prefix !== "") {
                // 首字母大写
                return prefix + key.slice(0, 1).toUpperCase() + key.slice(1);
            }
            return key;
        };
        var isPageVisibilitySupport = (function() {
            var support = false;
            if (typeof window.screenX === "number") {
                ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
                    if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
                        prefixSupport = prefix;
                        support = true;
                    }
                });
            }
            return support;
        })();

        var isHidden = function() {
            if (isPageVisibilitySupport) {
                return document[keyWithPrefix(prefixSupport, "hidden")];
            }
            return undefined;
        };

        var visibilityState = function() {
            if (isPageVisibilitySupport) {
                return document[keyWithPrefix(prefixSupport, "visibilityState")];
            }
            return undefined;
        };

        return {
            hidden: isHidden(),
            visibilityState: visibilityState(),
            visibilitychange: function(fn, usecapture) {
                usecapture = undefined || false;
                if (isPageVisibilitySupport && typeof fn === "function") {
                    return document.addEventListener(prefixSupport + "visibilitychange", function(evt) {
                        this.hidden = isHidden();
                        this.visibilityState = visibilityState();
                        fn.call(this, evt);
                    }.bind(this), usecapture);
                }
                return undefined;
            }
        };
    })(undefined);

    lBtn(page_btn, function() {
        _hmt.push(['_trackEvent', '周年微信下载页', '点击下载按钮']);

        //获取source的value值
        var _getParamsObjFromUrl = function(type) {
            var search = window.location.search;
            var strParams = search.substr(1);
            var arrParasm = strParams.split('&');
            var paramsObj = {};
            if (type === 'string') {
                return strParams;
            } else if (type === 'object') {
                arrParasm.forEach(function(value) {
                    var tmpArr = value && value.split('=') || [];
                    tmpArr[0] && (paramsObj[tmpArr[0]] = tmpArr[1]);
                });
                return paramsObj;
            }
        };

        var _params = _getParamsObjFromUrl('object');
        var sourceValue = _params && _params['adsource'] || 'no_from';
        var toValue = _params && _params['toClient'] || 'jdbclient://tab/tradeInstance/index';

        // IOS9.0以上，支持deeplink
        if (isIphone && !navigator.userAgent.match(/OS [0-8]_[1-9](_[0-9])* /i)) {
            window.location = "https://app.jiedaibao.com.cn/h5app/partials/download/download_jdbdpl.html?from=zhitouH5ClickDownloadBtn&dplto=" + toValue + "&adsource=" + sourceValue;
        } else {
            //下载借贷宝
            var timeout = setTimeout(function() {
                lNavToUrlWithFillout("http://jdb.jiudingcapital.com/download.html?from=zhitouH5ClickDownloadBtn");
            }, 3000);

            pageVisibility.visibilitychange(
                function() {
                    if (this.hidden) {
                        clearTimeout(timeout);
                    }
                }
            )

            lNavToUrlWithFillout("jdbclient://native.jiedaibao.com?adsource=" + sourceValue);
        }
    })

    //-------------------------------------------------------------
    page_downBtn = new lImg("../../img/anniversary/btn_2.png", endPage, 282, myH - 60, 90, 57);
    TweenMax.to(page_downBtn, 0.4, { y: -20, yoyo: true, repeat: -1 });
    page_downBtn.hide();
    page_back.hide();
    page_1.hide();
    page_2.hide();
    page_3.hide();
}

var pageN;

function gotopage(txt) {
    if (txt == "UP") {
        now--
    } else {
        now++
    }
    if (now <= 0) {
        now = 1;
    } else if (now >= 4) {
        now = 3
    } else {
        gotoPageNnm(now);
    }
}

function showEndPage() {

    pageN = new TimelineMax({ repeat: -0, paused: true });
    pageN.to(page_1_txt1, 0, { scaleX: "+=2.3", scaleY: "+=2.3", autoAlpha: 0 });
    pageN.to(page_1_txt2, 0, { y: "+=100", autoAlpha: 0 });
    pageN.to(page_1_txt3, 0, { y: "+=100", autoAlpha: 0 });
    pageN.to(page_1_back, 0, { y: "+=100", autoAlpha: 0 });

    pageN.to(page_1, 1, { autoAlpha: 1 }, "-=0.3");
    pageN.to(page_1_txt1, 1, { scaleX: 1, scaleY: 1, autoAlpha: 1, ease: Power4.easeInOut }, "-=0.7");
    pageN.to(page_1_back, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.2");

    pageN.to(page_1_txt2, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.3");
    pageN.to(page_1_txt3, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
    pageN.to(page_downBtn, 1, { autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
    tempPage = page_1;
    pageN.play();
    page_back.show();

    endPage.addEventListener('touchstart', function(event) {
        if (touchOff) {
            touchOff = false;
            deltaNum = event.targetTouches[0].clientY;
            endPage.addEventListener('touchmove', touchMove);
            TweenMax.delayedCall(1, function() {
                touchOff = true;
            })
        }
    }, false);

    function touchMove(event) {
        var tempNum = event.targetTouches[0].clientY;
        if (Math.abs(tempNum - deltaNum) > 30) {
            if (tempNum < deltaNum) {
                gotopage("DOWN");
            } else {
                gotopage("UP");
            }
            endPage.removeEventListener('touchmove', touchMove)
        }
    }

}
var touchOff = true;

function gotoPageNnm(num) {
    TweenMax.to(tempPage, 0.4, { autoAlpha: 0 });
    switch (num) {
        case 1:

            pageN = new TimelineMax({ repeat: -0, paused: true });
            pageN.to(page_1_txt1, 0, { scaleX: "+=2.3", scaleY: "+=2.3", autoAlpha: 0 });
            pageN.to(page_1_txt2, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_1_txt3, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_1_back, 0, { y: "+=100", autoAlpha: 0 });

            pageN.to(page_1, 1, { autoAlpha: 1 }, "-=0.3");
            pageN.to(page_1_txt1, 1, { scaleX: 1, scaleY: 1, autoAlpha: 1, ease: Power4.easeInOut }, "-=0.7");
            pageN.to(page_1_back, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.2");

            pageN.to(page_1_txt2, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.3");
            pageN.to(page_1_txt3, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            tempPage = page_1;
            pageN.play();
            break;
        case 2:
            TweenMax.to(page_downBtn, 1, { autoAlpha: 1 });
            pageN = new TimelineMax({ repeat: -0, paused: true });
            pageN.to(page_2_txt1, 0, { scaleX: "+=2.3", scaleY: "+=2.3", autoAlpha: 0 });

            pageN.to(page_2_txt2, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_2_txt3, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_2_back, 0, { y: "+=100", autoAlpha: 0 });

            pageN.to(page_2, 1, { autoAlpha: 1 }, "-=0.3");
            pageN.to(page_2_txt1, 1, { scaleX: 1, scaleY: 1, autoAlpha: 1, ease: Power4.easeInOut }, "-=0.7");
            pageN.to(page_2_back, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.2");
            pageN.to(page_2_txt2, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.3");
            pageN.to(page_2_txt3, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            tempPage = page_2;
            pageN.play();
            break;
        case 3:
            TweenMax.to(page_downBtn, 1, { autoAlpha: 0 });
            pageN = new TimelineMax({ repeat: -0, paused: true });
            pageN.to(page_3_txt1, 0, { scaleX: "+=2.3", scaleY: "+=2.3", autoAlpha: 0 });
            pageN.to(page_3_txt2, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_3_txt3, 0, { y: "+=100", autoAlpha: 0 });
            pageN.to(page_3_txt4, 0, { y: "+=100", autoAlpha: 0 });


            pageN.to(page_3_back1, 0, { x: "-=130", autoAlpha: 0 });
            pageN.to(page_3_back2, 0, { x: "+=130", autoAlpha: 0 });
            pageN.to(page_3_back3, 0, { autoAlpha: 0 });
            pageN.to(page_3_back4, 0, { autoAlpha: 0 });
            pageN.to(page_3_back5, 0, { autoAlpha: 0 });
            pageN.to(page_3_back6, 0, { autoAlpha: 0 });

            pageN.to(page_btn, 0, { y: "+=100", autoAlpha: 0 });

            pageN.to(page_3, 1, { autoAlpha: 1 }, "-=0.3");
            pageN.to(page_3_txt1, 1, { scaleX: 1, scaleY: 1, autoAlpha: 1, ease: Power4.easeInOut }, "-=0.7");

            pageN.to(page_3_txt2, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.1");
            pageN.to(page_3_txt3, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_txt4, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back1, 1, { x: "+=130", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back2, 1, { x: "-=130", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back3, .5, { autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back4, .5, { autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back5, .5, { autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            pageN.to(page_3_back6, .5, { autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");

            pageN.to(page_btn, 1, { y: "-=100", autoAlpha: 1, ease: Power4.easeOut }, "-=0.7");
            tempPage = page_3;
            pageN.play();
            break;
    }

}
