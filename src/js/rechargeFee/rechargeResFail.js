/*
@author:chenke@jiedaibao.com
@date: 2015.11.22

@desec :充值缴费失败页面对应js文件
				判断hash渲染不同页面，参数截取location.search
*/

(function() {

	//一些常用方法
	var utls = {
		getMyObjFromUrl: function(obj) {

			var tempObj = {};
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				tempObj[sParameterName[0]] = sParameterName[1];
			}
			for (var i in obj) {
				obj[i] = tempObj[i] ? decodeURIComponent(tempObj[i]) : obj[i];
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
		getUrlParameter: function(sParam) {

			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');

			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return decodeURI(sParameterName[1]);
				}
			}

		},
		render: function(opt) {
			var template = opt.template || '';
			var goal = opt.goal || $('.container');
			var templateData = opt.templateData || {};
			goal.html(microtemplate(template, templateData));

		},
		addProterty: function(toObj, fromObj) {
			//将fromObj的属性添加覆盖到toObj，暂时只考虑简单数据
			for (var i in fromObj) {
				toObj[i] = fromObj[i];
			}
			console.log(toObj);
			return toObj;
		},
		xssHtml: function(str) {
			//依赖于https://github.com/leizongmin/js-xss
			var html = filterXSS(str);
			return html
		}
	};

	//本页面全局变量
	var creditPayData = {
		urls: {},
		money: '',
		theResData: '',
		pageMap: {
			'timeFail': timeFail,
			'numberFail': numberFail,
			'/': timeFail
		},
		postData: {}
	};

	var init = {
		baseEvent: function() {
			window.onhashchange = function() {
				//监听hash变化，渲染不同页面
				var hashStr = location.hash.replace('#', '');
				hashProxyModule(hashStr);
			};
			window.onhashchange();
		}
	};

	function timeFail() {

		function renderPage() {
			var htmlStr = require('rechargeFee/timeFail.string');
			//console.log(htmlStr);
			utls.render({
				template: htmlStr,
				templateData: pageData.dataFromUrl
			});
		}

		function initEvent() {

		}
		var pageData = {
			dataFromUrl: utls.getMyObjFromUrl({
				fromTime: '8:00',
				institutionName: decodeURIComponent('北京自来水有限公司'),
				endTime: '20:00'
			})
		}
		return {
			init: function() {
				console.log('addCreditCardSuccess');
				renderPage();
				initEvent();
			}
		}
	}

	function numberFail() {
		function renderPage() {
			var htmlStr = require('rechargeFee/numberFail.string');
			//console.log(htmlStr);
			utls.render({
				template: htmlStr,
				templateData: pageData.dataFromUrl
			});
		}

		function initEvent() {

		}
		var pageData = {
			dataFromUrl: utls.getMyObjFromUrl({
				institutionName: decodeURIComponent('北京自来水有限公司'),
				billKey: '10032849867234'
			})
		}
		console.log(pageData.dataFromUrl.billKey);
		return {
			init: function() {
				console.log('addCreditCardSuccess');
				renderPage();
				initEvent();
			}
		}

	}

	function hashProxyModule(str) {
		//console.log('hashProxyModule');
		console.log(creditPayData.pageMap);
		if (creditPayData.pageMap[str]) {
			var currentPage = (function(fun) {
				return fun();
			})(creditPayData.pageMap[str]);
			currentPage.init();

		} else {
			window.location.href = '#/';
			return true;
		}
	}

	function main() {
		init.baseEvent();
	}
	console.log('1');
	$(main());

})();