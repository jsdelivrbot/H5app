;(function() {
	// 白名单，未被封的域名
	var whiteList = [
		'app.jiudingcapital.com',
		'app.jiudingcapital.cn'
	];
	// 黑名单，已被封的域名或者不建议使用的域名
	var blackList = [
		'app.jiedaibao.com',
		// app.jiedaibao.com.cn域名为正式备用域名，不建议做为分享域名
		'app.jiedaibao.com.cn'
	];
	// 分享组件模版
	var shareTemplate = {
		header: '<div id="shareModal" class="share-modal"><div class="invite-title">分享</div><div class="invite-content clearfix">',
		content: '',
		footer: '</div><div class="invite-bottom clearfix"><button id="cancel">取消</button></div></div>'
	};
	// 分享渠道与样式class对应map
	var type2class = {
		sms: 's1',
		wxfeed: 's2',
		wxmsg: 's3',
		qq: 's4',
		qqzone: 's5',
		weibo: 's6'
	};
	// 分享渠道与渠道名称对应map
	var type2name = {
		sms: '短信',
		wxfeed: '朋友圈',
		wxmsg: '微信',
		qq: 'QQ',
		qqzone: 'QQ空间',
		weibo: '微博'
	};

	/**
	 *	json转成url参数
	 *	@param {Object} json json对象 
	 *	@return {String} url参数
	 */
	var parseJsonToUrl = function (json) {
		if (!json || $.isEmptyObject(json)) {
			return '';
		}
		var arr = [];
		var str = '';
		for (var i in json) {
			str = i + '=' + json[i];
			arr.push(str);
		}
		return '?' + arr.join('&');
	};

	/**
	 *	获取分享图片url
	 *	@param {Object} opts 配置参数 
	 *	@return {String} 分享图片url
	 */
	var getShareImageUrl = function(opts) {
		var imgurl = opts.shareImg || 'img/notMin/jdb_icon.jpg';
		if (!imgurl) {
			return;
		}
		if (/\s*http/.test(imgurl)) {
			return imgurl;
		}
		var origin = location.origin;
		var pathName = location.pathname;
		var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
		projectName = projectName == '/partials' ? '' : projectName;
		return origin + projectName + '/' + imgurl;
	};

	/**
	 *	获取分享url链接
	 *	@param {Object} opts 配置参数 
	 *	@return {String} 分享url链接
	 */
	var getShareUrl = function(opts) {
		var shareUrl = opts.shareUrl;
		if (!shareUrl)	{
			return;
		}
		var paramsStr = parseJsonToUrl(opts.shareUrlParams);
		if (/\s*http/.test(shareUrl)) {
			return shareUrl + paramsStr;
		}
		var host = location.host;
		var origin = location.origin;
		var pathName = location.pathname;
		var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
		if (blackList.indexOf(host) > -1) {
			var enabledHost = whiteList[Math.floor(whiteList.length * Math.random())];
			origin = origin
				.replace(host, enabledHost)
				// 目前whiteList中的域名不支持https
				.replace('https://', 'http://');
		}
		projectName = projectName == '/partials' ? '' : projectName;
		return origin + projectName + '/' + shareUrl + paramsStr;
	};

	var shareData = {};
	var ShareFriends = ShareFriends || {};

	/**
	 *  初始化分享组件配置
	 *	@param {Object} opts 配置参数 
	 */
	ShareFriends.init = function(opts) {
		opts = opts || {};
		var contentArr = [];
		var shareImageUrl = getShareImageUrl(opts);
		var sharePageUrl = getShareUrl(opts);
		for (var key in type2name) {
			var type = key;
			var name = type2name[type];
			var shareContent = opts.shareContent;
			if (shareContent[type]) {
				shareData[type] = {
					type: type,
					shareTitle: shareContent[type].shareTitle,
					// {{shareUrl}}替换成处理后的分享链接
					shareText: shareContent[type].shareText.replace('{{shareUrl}}', sharePageUrl),
					shareImageUrl: shareImageUrl,
					sharePageUrl: sharePageUrl,
					recipients: '',
					subject: type,
					name: name
				};
				contentArr.push([
					'<div class="invite-item" data-type="' + type + '">',
						'<i class="share-icon ' + type2class[type] + '"></i>',
					'<div class="share-method">' + name + '</div></div>'
				].join(''));
			}
		}
		shareTemplate.content = contentArr.join('');
	};

	/**
	 *  调用Native的Schema执行分享操作
	 *	@param {String} type 分享渠道 
	 */
	ShareFriends.doShare = function(type) {
		var source = 'h5app';
		var shareStr = JSON.stringify(shareData[type]);
		var shareContentB64 = window.encodeURIComponent(shareStr);
		var shareUrl = ['http://native.jiedaibao.com/web2Native/share?source=',
				source,
				'&shareTo=',
				type,
				'&content=',
				shareContentB64
			].join('');
		window.location.replace(shareUrl);
	};

	/**
	 *  绑定分享事件 
	 */
	ShareFriends.bind = function() {
		$('#shareModal .invite-item').click(function() {
			var type = $(this).data('type');
			ShareFriends.doShare(type);
		});

		$('#shareModal #cancel').click(function() {
			$('#shareModal').hide();
		});
	};

	/**
	 *  显示分享窗口 
	 */
	ShareFriends.open = function() {
		if (!$('#shareModal').length) {
			var html = [shareTemplate.header,
				shareTemplate.content,
				shareTemplate.footer].join('');
			$('body').append(html);
			ShareFriends.bind();
		} else {
			$('#shareModal').show();
		}
	};

	window.ShareFriends = ShareFriends;

})();

