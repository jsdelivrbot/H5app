(function() {
    var cW = document.documentElement.clientWidth;
    var ua = window.navigator.userAgent;
    var oJump = document.getElementById('jump');
    var href = window.location.href;
    if (cW > 420) {
        cW = 420;
    }
    document.documentElement.style.fontSize = cW / 320 * 20 + 'px';
    window.onresize = function() {
        document.documentElement.style.fontSize = cW / 320 * 20 + 'px';
    };
    var getRequest = function() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            if (str.indexOf("&") != -1) {
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    // theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            } else {
                theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
            }
        }
        return theRequest;
    };
    if (getRequest().outlinePage) {
        oJump.href = getRequest().outlinePage;
        oJump.click();
    }

})();