;
(function() {
    function getUrlParams(key) {
        var params = location.search.split('?');
        var paramArr;
        var json = {};
        if (params[1]) {
            paramArr = params[1].split('&');
            for (var i = 0; i < paramArr.length; i++) {
                var temp = paramArr[i].split('=');
                json[temp[0]] = temp[1];
            }
            if (json[key]) {
                return json[key]
            }
        }
    }

    var authStatus = getUrlParams('authStatus');
    var successDOM = $('.success');
    var failDOM = $('.fail');
    if (authStatus == 1) { //脉脉认证成功
        var realName = getUrlParams('realName') || '';
        $('.success.subTitle').html('您的宝粉将更加信任您的借款信息');
        successDOM.show();
    } else { //脉脉认证失败
        var reason = getUrlParams('reason') || '';
        $('.fail.subTitle').html(decodeURIComponent(reason));
        $('.button.again').show();
        failDOM.show();
    }

    $('div.button.again').click(function() {
        window.location.href="jdbclient://user/certificateAuthority?subpage=freeCertification&type=14";
    });

})();