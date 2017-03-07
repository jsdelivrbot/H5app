;
(function() {

    function getSearch(name) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(name).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    function renderOtherContent() {
        // 如何白赚钱渲染
        var makeMoneyTipsTemplate = require('profitRank/makeMoneyTips.string');
        $('.makeMoneyTipsContainer').html(makeMoneyTipsTemplate);

        // 底部footer渲染
        var footerTemplate = require('profitRank/footer.string');
        $('body').append(footerTemplate);
    }

    $.post('{{getBaizhuanListApi}}', {
        id: getSearch('id')
    }, function(data) {
        if (data && data.error && data.error.returnCode == 0 && data.data) {
            var myRank = data.data.myRank;
            var rankList = data.data.rankList;
            myRank.memberInfo.memberID=getSearch('id');
            personalInfoVm = new Vue({
                el: '#personalInfo',
                data: myRank,
                ready: function() {
                    $('#personalInfo').show();
                }
            });
            profitRankListVm = new Vue({
                el: '#profitRankList',
                data: {
                    list: rankList
                },
                ready: function() {
                    $('#profitRankList').show();
                    renderOtherContent()
                }
            });
        } else {
            renderOtherContent();
        }
    }, 'json');

    // 统计
    $('body').on('mousedown touchstart', '.j-how-intro', function () {
        _hmt.push(['_trackEvent', '榜单页「如何白赚钱」', 'click']);
    });

    $('body').on('mousedown touchstart', '.j-download-link', function () {
        _hmt.push(['_trackEvent', '榜单页「下载借贷宝 一起来赚钱」', 'click']);
    });

    $('body').on('click', '.j-download-link', function (e) {
        e.preventDefault();
        var ua = navigator.userAgent;
        if (ua.match(/ipad|ios|iphone/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/MicroMessenger/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else if (ua.match(/android/i)) {
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
        } else {
            location.href = 'http://www.jiedaibao.com/pcIndex.html';
        }
    });

    $('body').on('click', '.j-how-intro', function (e) {
        e.preventDefault();
        var pos = $('#makeMoneyTips').offset();
        $('body').scrollTop(pos && pos.top);
    });

})();
