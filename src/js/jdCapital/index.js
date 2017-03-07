;
(function() {
    $.fn.cookie('key', 'true');
    window.onload = function() {
        var viewTips = [];
        //var params = utls.getMyObjFromUrl( { 'token': '','txJurNo': '','applyTime': '','accessToken': '','memberID': '','udid': '','appKey': '' } );
        //alert($.fn.cookie('memberID')+ ',' +$.fn.cookie('accessToken')+ ',' +$.fn.cookie('udid')+ ',' + $.fn.cookie('appKey'));
        //覆盖Chart初始化以及tooltips触发方法
        Chart.types.Line.extend({

            name: "LineTooltip",

            initialize: function(data) {

                var helpers = Chart.helpers;

                this.PointClass = Chart.Point.extend({
                    strokeWidth: this.options.pointDotStrokeWidth,
                    radius: this.options.pointDotRadius,
                    display: this.options.pointDot,
                    hitDetectionRadius: this.options.pointHitDetectionRadius,
                    ctx: this.chart.ctx,
                    inRange: function(mouseX) {
                        return (Math.pow(mouseX - this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius, 2));
                    }
                });

                this.datasets = [];

                if (this.options.showTooltips) {
                    helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                        var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
                        this.eachPoints(function(point) {
                            point.restore(['fillColor', 'strokeColor']);
                        });
                        helpers.each(activePoints, function(activePoint) {
                            activePoint.fillColor = activePoint.highlightFill;
                            activePoint.strokeColor = activePoint.highlightStroke;
                        });
                        this.showTooltip(activePoints);
                    });
                }

                helpers.each(data.datasets, function(dataset) {
                    var datasetObject = {
                        label: dataset.label || null,
                        fillColor: dataset.fillColor,
                        strokeColor: dataset.strokeColor,
                        pointColor: dataset.pointColor,
                        pointStrokeColor: dataset.pointStrokeColor,
                        showTooltip: dataset.showTooltip,
                        points: []
                    };

                    this.datasets.push(datasetObject);

                    helpers.each(dataset.data, function(dataPoint, index) {

                        datasetObject.points.push(new this.PointClass({
                            showTooltip: dataset.showTooltip === undefined ? true : dataset.showTooltip,
                            value: dataPoint,
                            label: data.labels[index],
                            datasetLabel: dataset.label,
                            strokeColor: dataset.pointStrokeColor,
                            fillColor: dataset.pointColor,
                            highlightFill: dataset.pointHighlightFill || dataset.pointColor,
                            highlightStroke: dataset.pointHighlightStroke || dataset.pointStrokeColor
                        }));
                    }, this);

                    viewTips.push(datasetObject.points[datasetObject.points.length - 1 || 0]);

                    this.buildScale(data.labels);

                    this.eachPoints(function(point, index) {
                        helpers.extend(point, {
                            x: this.scale.calculateX(index),
                            y: this.scale.endPoint
                        });
                        point.save();
                    }, this);

                }, this);

                this.render();
            },

            getPointsAtEvent: function(e) {
                var helpers = Chart.helpers;
                var pointsArray = [],
                    eventPosition = helpers.getRelativePosition(e);
                helpers.each(this.datasets, function(dataset) {
                    helpers.each(dataset.points, function(point) {
                        if (point.inRange(eventPosition.x, eventPosition.y) && point.showTooltip) pointsArray.push(point);
                    });
                }, this);
                return pointsArray;
            },

            showTooltip: function(ChartElements, forceRedraw) {
                var helpers = Chart.helpers;
                var each = helpers.each;
                var indexOf = helpers.indexOf;
                var min = helpers.min;
                var max = helpers.min;

                if (typeof this.activeElements === 'undefined') this.activeElements = [];

                var isChanged = (function(Elements) {
                    var changed = false;

                    if (Elements.length !== this.activeElements.length) {
                        changed = true;
                        return changed;
                    }

                    each(Elements, function(element, index) {
                        if (element !== this.activeElements[index]) {
                            changed = true;
                        }
                    }, this);
                    return changed;
                }).call(this, ChartElements);

                this.activeElements = ChartElements;

                this.draw();
                if (ChartElements.length > 0) {
                    if (this.datasets && this.datasets.length > 1) {
                        var dataArray,
                            dataIndex;

                        for (var i = this.datasets.length - 1; i >= 0; i--) {
                            dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
                            dataIndex = indexOf(dataArray, ChartElements[0]);
                            if (dataIndex !== -1) {
                                break;
                            }
                        }
                        var tooltipLabels = [],
                            tooltipColors = [],
                            medianPosition = (function(index) {

                                var Elements = [],
                                    dataCollection,
                                    xPositions = [],
                                    yPositions = [],
                                    xMax,
                                    yMax,
                                    xMin,
                                    yMin;
                                helpers.each(this.datasets, function(dataset) {
                                    dataCollection = dataset.points || dataset.bars || dataset.segments;

                                    if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue() && (dataCollection[dataIndex].showTooltip === undefined || dataCollection[dataIndex].showTooltip)) {
                                        Elements.push(dataCollection[dataIndex]);
                                    }
                                });

                                helpers.each(Elements, function(element) {
                                    xPositions.push(element.x);
                                    yPositions.push(element.y);

                                    tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
                                    tooltipColors.push({
                                        fill: element._saved.fillColor || element.fillColor,
                                        stroke: element._saved.strokeColor || element.strokeColor
                                    });

                                }, this);

                                yMin = min(yPositions);
                                yMax = max(yPositions);

                                xMin = min(xPositions);
                                xMax = max(xPositions);

                                return {
                                    x: (xMin > this.chart.width / 2) ? xMin : xMax,
                                    y: (yMin + yMax) / 2
                                };
                            }).call(this, dataIndex);

                        new Chart.MultiTooltip({
                            x: medianPosition.x,
                            y: medianPosition.y,
                            xPadding: this.options.tooltipXPadding,
                            yPadding: this.options.tooltipYPadding,
                            xOffset: this.options.tooltipXOffset,
                            fillColor: this.options.tooltipFillColor,
                            textColor: this.options.tooltipFontColor,
                            fontFamily: this.options.tooltipFontFamily,
                            fontStyle: this.options.tooltipFontStyle,
                            fontSize: this.options.tooltipFontSize,
                            titleTextColor: this.options.tooltipTitleFontColor,
                            titleFontFamily: this.options.tooltipTitleFontFamily,
                            titleFontStyle: this.options.tooltipTitleFontStyle,
                            titleFontSize: this.options.tooltipTitleFontSize,
                            cornerRadius: this.options.tooltipCornerRadius,
                            labels: tooltipLabels,
                            legendColors: tooltipColors,
                            legendColorBackground: this.options.multiTooltipKeyBackground,
                            title: ChartElements[0].label,
                            chart: this.chart,
                            ctx: this.chart.ctx
                        }).draw();

                    } else {
                        each(ChartElements, function(Element) {
                            var tooltipPosition = Element.tooltipPosition();
                            new Chart.Tooltip({
                                x: Math.round(tooltipPosition.x),
                                y: Math.round(tooltipPosition.y),
                                xPadding: this.options.tooltipXPadding,
                                yPadding: this.options.tooltipYPadding,
                                fillColor: this.options.tooltipFillColor,
                                textColor: this.options.tooltipFontColor,
                                fontFamily: this.options.tooltipFontFamily,
                                fontStyle: this.options.tooltipFontStyle,
                                fontSize: this.options.tooltipFontSize,
                                caretHeight: this.options.tooltipCaretSize,
                                cornerRadius: this.options.tooltipCornerRadius,
                                text: helpers.template(this.options.tooltipTemplate, Element),
                                chart: this.chart
                            }).draw();
                        }, this);
                    }
                }
                return this;
            },
        });

        //页面逻辑
        var htmlStr = require('jdCapital/index.string'),
            params = utls.getMyObjFromUrl({
                'token': '',
                'txJurNo': '',
                'applyTime': '',
                'accessToken': '',
                'memberID': '',
                'udid': '',
                'appKey': '',
                'clientVersion': ''
            }),
            JWin = $(window),
            bar;

        $('[data]').addClass('loading');

        $.post('{{getCapitalApi}}', {
                reqData: JSON.stringify({
                    token: params.token
                })
            },
            function(result) {
                if (typeof result == 'string') {
                    result = JSON.parse(result);
                }

                if (result.error.returnCode != 0) {
                    toastError(result.error.returnUserMessage);
                    return;
                }

                var resultData = result.data,
                    totAmtBak = resultData.totAmt + '',
                    chartData = {
                        labels: [],
                        datas: []
                    };

                resultData.totAmt = utls.formatMoney(resultData.totAmt || 0, 2, 'percent');
                resultData.totRevAmt = utls.formatMoney(resultData.totRevAmt || 0, 2, 'percent');
                resultData.revAmt = utls.formatMoney(resultData.revAmt || 0, 2, 'percent');
                resultData.cnPrdIn = (resultData.cnPrdIn * 0.01).toFixed(4);

                params.totRevAmt = resultData.totRevAmt;

                $.each(resultData.compList, function(i, item) {
                    chartData.labels.push(item.navDt || '');
                    chartData.datas.push(item.prdSevenRor || 0);
                });

                if (!resultData.revAmt || resultData.revAmt == 0) {
                    resultData.revAmt = '暂无收益';
                }

                putValue(resultData);

                putHref(params);
                /**
                 * 现在产品要求点击不可用，置灰,6.8又要改回去
                 */
                // $('.btn-turnin').on('click', function(event) {
                //     event.preventDefault();
                //     var text = "升级维护中，请耐心等待";
                //     toastError({
                //         text: text,
                //         ms: 3000
                //     });
                //     return false;
                // });

                //转入按钮添加链接
                $('.btn-turnin').attr('href', $('.btn-turnin').attr('href') + '&totAmt=' + totAmtBak + '&accessToken=' + params.accessToken + '&memberID=' + params.memberID + '&udid=' + params.udid + '&appKey=' + params.appKey + '&clientVersion=' + params.clientVersion);
                bar = $('.bottom-bar');

                if (!resultData.totAmt || resultData.totAmt == 0) {
                    $('.btn-turnout').addClass('disabled').unbind("click");
                }

                //调用重写的chartjs方法进行初始化
                var chartObj = new Chart($(".chart-view canvas")[0].getContext("2d")).LineTooltip({
                    labels: chartData.labels,
                    datasets: [{
                        label: "My First dataset",
                        fillColor: "rgba(256,180,100,0.2)",
                        strokeColor: "#ff6400",
                        pointColor: "rgba(255,240,207,1)",
                        pointStrokeColor: "#ff6400",
                        pointHighlightFill: "#ff6400",
                        pointHighlightStroke: "#ff6400",
                        data: chartData.datas
                    }]
                }, {
                    tooltipFillColor: "rgba(212,50,50,1)",

                    tooltipTitleFontStyle: "normal",

                    tooltipCornerRadius: 0,

                    tooltipXPadding: 10,

                    tooltipEvents: ["click"],

                    tooltipTemplate: "<%= value %>",

                    scaleLabel: "<%= Number(value).toFixed(2) %>",

                    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                    scaleFontSize: 10,

                    scaleFontStyle: "normal",

                    scaleFontColor: "#b8c0cc",

                    scaleGridLineColor: "rgba(0,0,0,.05)",

                    scaleGridLineWidth: 1,

                    scaleShowHorizontalLines: false,

                    scaleOverride: true,

                    //** Required if scaleOverride is true **
                    // y轴刻度的个数
                    scaleSteps: 4,
                    // y轴每个刻度的宽度
                    scaleStepWidth: (function() {
                        //chartData.datas
                        // var theMax = Math.max( chartData.datas );
                        var theMax = 0;

                        for (var i = 0; i < chartData.datas.length; i++) {
                            if (theMax < chartData.datas[i]) {
                                theMax = chartData.datas[i];
                            }
                        }

                        return Math.ceil(theMax) / 4;
                    })(),
                    // y轴的起始值
                    scaleStartValue: 0,

                    bezierCurve: false,

                    pointDot: true,

                    pointDotRadius: 3,

                    pointDotStrokeWidth: 1,

                    pointHitDetectionRadius: 10,

                    datasetStroke: true,

                    datasetStrokeWidth: 2,

                    datasetFill: true,

                    animation: false,

                    scaleBeginAtZero: true,

                    onAnimationComplete: function() {
                        //手动触发最后一个tooltips
                        if (viewTips[0]) {
                            this.activeElements = viewTips;
                            this.showTooltip(viewTips);
                        }
                    }
                });
            }
        );


        $('#turnOutCheck').on('click', function() {
            // toastError('升级维护中，请耐心等待');
            // return;
            $.post('{{getCapitalTurnInDetailApi}}', {
                    reqData: JSON.stringify({
                        token: params.token
                    })
                },
                function(result) {
                    if (typeof result == 'string') {
                        result = JSON.parse(result);
                    }

                    if (result.error.returnCode != 0) {
                        toastError(result.error.returnUserMessage);
                        return;
                    }

                    var resultData = result.data;

                    //var params = utls.getMyObjFromUrl( { 'token': '','txJurNo': '','applyTime': '','accessToken': '','memberID': '','udid': '','appKey': '' } )
                    window.location.href = (resultData.popFlg == 'Y' ? './information.html?token=' : './turnOut.html?token=') +
                        params.token + '&accessToken=' + params.accessToken + '&memberID=' + params.memberID + '&udid=' + params.udid + '&appKey=' + params.appKey + '&clientVersion=' + params.clientVersion;
                }
            );
        });

        $('.linkIncome').on('click', function() {
            window.location.href = './income.html?token=' + params.token + '&amt=' + params.totRevAmt;
        });

        function putValue(resultData) {
            var valueList = $('[data]'),
                tmpEle;

            for (var i = 0; i < valueList.length; i++) {
                tmpEle = valueList.eq(i);

                tmpEle.removeClass('loading').html(resultData[tmpEle.attr('data')]);
            }
        }

        function putHref(params) {
            var hrefList = $('a[data-href]'),
                tmpEle;

            for (var i = 0; i < hrefList.length; i++) {
                tmpEle = hrefList.eq(i);

                tmpEle.attr('href', tmpEle.attr('data-href') + params.token)
                    .removeAttr('data-href');
            }
        }
    }
})();
