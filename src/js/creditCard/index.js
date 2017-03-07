;
(function() {
    var params = utls.getMyObjFromUrl({
        'token': ''
    });

    //alert('init');
    /*window.onBackPressed = function(){
    	//window.location.reload();
    	//alert('regage');
    	reInitPage();
    }*/

    var colorMap = {
        'CMB': 'zs',
        'CITIC': 'zx',
        'HXB': 'hx',
        'GDB': 'gf',
        'BOB': 'bj',
        'CCB': 'js',
        'SPDB': 'pf',
        'CIB': 'xy',
        'CEB': 'gd',
        'PABC': 'pa',
        'ICBC': 'gs',
        'BSB': 'bs',
        'ABC': 'ny',
        'BOC': 'zg',
        'BCOM': 'jt',
        'CMBC': 'ms'
    }

    var htmlStr = require('creditCard/index.string');

    //alert('before post');
    $.post('{{getcreditCardListApi}}', {
            token: params.token,
            timeStamp: (new Date()).getTime()
        },
        function(result) {
            if (typeof result == 'string') {
                result = JSON.parse(result);
            }
            JSON.stringify(result);
            if (result.error.returnCode != 0) {
                console.log(result.error.returnMessage);
                return;
            }

            var resultData = result.data;
            resultData.token = params.token;

            // if( resultData.list.length == 0 ) {
            // 	location.replace ('creditPayments.html?token=' + params.token + '#addCreditCard');
            //
            // 	return;
            // }

            $.each(resultData.list, function(i, item) {
                item.code = colorMap[item.bankNo];
                item.bankNum = item.account;
            });

            $('.container').html(microtemplate(htmlStr, resultData));
        }
    );

    function reInitPage() {
        //alert('before post reinit');
        $.post('{{getcreditCardListApi}}', {
                token: params.token,
                timeStamp: (new Date()).getTime()
            },
            function(result) {
                if (typeof result == 'string') {
                    result = JSON.parse(result);
                }

                if (result.error.returnCode != 0) {
                    console.log(result.error.returnMessage);
                    return;
                }

                var resultData = result.data;
                resultData.token = params.token;

                if (resultData.list.length == 0) {
                    location.replace('creditPayments.html?token=' + params.token + '#addCreditCard');

                    return;
                }

                $.each(resultData.list, function(i, item) {
                    item.code = colorMap[item.bankNo];
                    item.bankNum = item.account;
                });

                $('.container').html(microtemplate(htmlStr, resultData));
            }
        );
    }

})();
