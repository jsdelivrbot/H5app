;
(function() {

    var resourcePromises = [];
    // 图表初始数据
    var chartData = {
        'invite': {
            'figure': 0,
            'color': '#3db6fb',
            'label': '../../img/profitRank/icon_Invitationwhite@2x.png'
        },
        'licha': {
            'figure': 0,
            'color': '#53d9c1',
            'label': '../../img/profitRank/icon_spreadwhite@2x.png'
        },
        'hlicha': {
            'figure': 0,
            'color': '#32c5cc',
            'label': '../../img/profitRank/icon_loanwhite@2x.png'
        },
        'reward': {
            'figure': 0,
            'color': '#ffb400',
            'label': '../../img/profitRank/icon_rewardwhite@2x.png'
        },
        'luckyMoney': {
            'figure': 0,
            'color': '#ff9227',
            'label': '../../img/profitRank/icon_redenvelopeswhite@2x.png'
        }
    };

    function getSearch(name) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(name).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    // 预处理图表数据，预加载图标label图片
    function initChartConfig () {
        for (var key in chartData) {
            if (chartData.hasOwnProperty(key) && chartData[key]) {
                var p = new Promise(function (resolve) {
                    var img = new Image();
                    img.src = chartData[key].label;
                    img.onload = function (key) {
                        return function () {
                            chartData[key].img = this;
                            resolve(this);
                        }
                    }(key);
                });
                resourcePromises.push(p);
            }
        }
    }

    // 请求百赚接口数据
    function initData () {
        var p = new Promise(function (resolve, reject) {
            $.post('{{getBaizhuanDetailApi}}', {
                id: getSearch('id')
            }, function(data) {
                if (data && data.error && data.error.returnCode == 0 && data.data) {
                    var vData = data.data;
                    vData.list = [
                        'invite',
                        'licha',
                        'hlicha',
                        'reward',
                        'luckyMoney'
                    ];
                    vData.imageNameMap = {
                        'invite': 'invite',
                        'licha': 'interest',
                        'hlicha': 'borrow',
                        'reward': 'reward',
                        'luckyMoney': 'redPacket'
                    };
                    vData.nameMap = {
                        'invite': '邀请好友',
                        'licha': '赚利差',
                        'hlicha': '低借高贷',
                        'reward': '悬赏揭榜',
                        'luckyMoney': '活动红包'
                    };

                    personalInfoVm = new Vue({
                        el: 'body',
                        data: vData,
                        ready: function() {
                            $('#memberInfo').show();
                            $('#detailList').show();
                            resolve(vData);
                        }
                    });
                } else {
                    reject();
                }
            }, 'json');
        });
        resourcePromises.push(p);
    }

    // 绘制图表
    function renderChart(data) {
        for (var key in data.baizhuanInfo) {
            if (data.baizhuanInfo.hasOwnProperty(key) && chartData[key]) {
                var num = data.baizhuanInfo[key].num;
                var total = data.baizhuanInfo.total;
                if (num / total < 0.08) {
                    num = total * 0.08;
                }
                chartData[key]['figure'] = num;
            }
        }
        var opt2 = {
            data: chartData,
            wrapper: document.getElementById('infoChart'),
            r: 150,
            lineWidth: 80,
            type: 'ringchart'
        };
        new RChart(opt2);
    }

    // 渲染白赚tips和footer
    function renderOtherContent() {
        // 如何白赚钱渲染
        var makeMoneyTipsTemplate = require('profitRank/makeMoneyTips.string');
        $('.makeMoneyTipsContainer').html(makeMoneyTipsTemplate);

        // 底部footer渲染
        var footerTemplate = require('profitRank/footer.string');
        $('body').append(footerTemplate);
    }

    // 统计
    function initStats () {
        $('body').on('mousedown touchstart', '.j-how-intro', function () {
            _hmt.push(['_trackEvent', '详情页「如何白赚钱」', 'click']);
        });

        $('body').on('mousedown touchstart', '.j-download-link', function () {
            _hmt.push(['_trackEvent', '详情页「下载借贷宝 一起来赚钱」', 'click']);
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
    }

    initStats();
    initData();
    initChartConfig();
    Promise.all(resourcePromises).then(function (data) {
        renderOtherContent();
        renderChart(data[0]);
    }, function () {
        // 数据加载失败
        renderOtherContent();
    });

})();
