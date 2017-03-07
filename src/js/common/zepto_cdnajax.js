/**
 * 通过cdn切换的方式选择合适的域名
 *
 * 1、从cookie里面尝试读取现在的域名状态
 * 2、将cookie读取的信息翻译到domainConf里面
 * 3、根据cookie状态来获取数据
 * 4、返回错误的时候，error里面去处理修改下次尝试的domain
 * 4.1 如果status都是1,状态全部清零后选择domain
 * 4.2 如果status不都是1, 按照状态和权重选择下次尝试的domain
 */
;(function($) {
	$.cdnAjax = function (options) {
		// 存放在cookie里面的名字
		var cookieCdnSwitchName = 'cdnswitch';
		var nowIndex = -1;
		var nowDomain = '';
		var domainConf = [
			{
				domain: '//app.jiedaibao.com',
				weight: 10,
				status: 0
			},
			{
				domain: '//hddev.jiedaibao.com',
				weight: 10,
				status: 0
			},
			{
				domain: '//huodong.jiedaibao.com',
				weight: 30,
				status: 0
			}
		];

		var coValue = getCookie(cookieCdnSwitchName);
		if (coValue && jiexiCookieToConf(coValue)) {
			nowDomain = domainConf[nowIndex].domain;
		} else {
			nowDomain = changeDomainByWeightAndStatus();
		}

		// url 拼接处理
		if (options && options.url) {
			options.url =  nowDomain + options.url;
		}
		// 出现错误的切换策略
		var tmpErr = options.error;
		if (options && options.error && typeof options.error === 'function') {
			options.error = function (xhr, errorType, error) {
				tmpErr(xhr, errorType, error);
				changeDomainByWeightAndStatus();
			};
		}else {
			options.error = function (xhr, errorType, error) {
				changeDomainByWeightAndStatus();
			};
		}
		$.ajax(options);

		// cookie 存储的信息,包括已经尝试过的结果& 当前
		// 2-1110 表示目前获取接口的是2号domain, 1110 表示各个domain是否被尝试过的状态
		function jiexiCookieToConf(cookieStr) {
			var cooReg = /^\d-\d+$/;
			var selectedIndex = -1;
			var statusStr = '';
			var i;

			if (cooReg.test(cookieStr)) {
				selectedIndex = cookieStr.split('-')[0];
				statusStr = cookieStr.split('-')[1];
				nowIndex = selectedIndex;
				for (i = 0; i < domainConf.length; i++) {
					domainConf[i].status = statusStr[i] * 1;
				}
				return true;
			}

			return false;
		}

		function getCookie(name) {
			var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
			var arr = document.cookie.match(reg);
			if (arr) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		}

		function setCookie(name, value, expDay) {
			var exp  = new Date();
			// 设置默认失效时间为60天
			var expDay = expDay || 60;
			exp.setTime(exp.getTime() + expDay * 24 * 60 * 60 * 1000);
			document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
		}

		/**
		 * 将配置信息写入到cookie
		 */
		function writeConfigToCookie() {
			var length = domainConf.length;
			var i;
			var statusArr = [];
			if (nowIndex === -1) {
				return false;
			}
			for (i = 0; i < length; i++) {
				statusArr.push(domainConf[i].status);
			}
			setCookie(cookieCdnSwitchName, nowIndex + '-' +  statusArr.join(''));
			return true;
		}

		/**
		 * 根据权值获取域名
		 */
		function changeDomainByWeightAndStatus() {
			var length = domainConf.length;
			var i;
			var totalSum = 0;
			var nowSum = 0;
			var tempSum = 0;
			var returnStr;
			// 第一次循环获取总和
			for (i = 0; i < length; i++) {
				if (domainConf[i].status === 0)	{
					totalSum += domainConf[i].weight;
				}
			}
			console.log(totalSum);
			// [0, totalSum) 取随机数
			var randomData = Math.random() * totalSum;
			console.log(randomData);
			//第二次循环，看落在哪点
			for (i = 0; i < length; i++) {
				if (domainConf[i].status !== 0)	{
					continue;
				}
				tempSum = nowSum;
				nowSum += domainConf[i].weight;
				if (randomData >= tempSum && randomData < nowSum) {
					// 将状态变为被选择过&& 更新入cookie
					domainConf[i].status = 1;
					nowIndex = i;
					writeConfigToCookie();
					returnStr = domainConf[i].domain;
					break;
				}
			}

			// 如果不存在returnStr 说明所有状态已经全部走过一遍，状态全部置0
			if (!returnStr) {
				for (i = 0; i < length; i++) {
					domainConf[i].status = 0;
				}
				returnStr = changeDomainByWeightAndStatus();
			}

			return returnStr;
		}
	};
})(Zepto);
