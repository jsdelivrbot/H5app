;
/**
 * 目前添加两简单方法
 * jdb.showLoading();
 * jdb.hideLoading();
 */
(function () {
	window.jdb = window.jdb || {};
	var typeMap = {
		cover: 'cover_loading',
		center: 'center_loading'
	};
	var loadingTpl = '' +
			'<div class="jdb_loading">' +
				'<div class="jdb_loading_cover"></div>' +
				'<div class="jdb_loading_content">' +
					'<div class="loading_div">' +
					/*	'<img src="//samherbert.net/svg-loaders/svg-loaders/tail-spin.svg" alt="">' + */
					'</div>' +
				'</div>' +
			'</div>';

	/**
	 * 目前支持两种type的 loading
	 * type1 : cover_loading
	 * type2 : center_loading
	 */
	function loading(type) {
		var className = typeMap[type] || 'center_loading';
		var $loadingPart = $('.jdb_loading.' + className);
		var $body = $('body');
		if ($loadingPart.length > 0 && $loadingPart.hasClass(className)) {
			$loadingPart.show();
		} else {
			$(loadingTpl).appendTo($body).addClass(className);
		}
	}

	jdb.showCoverLoading = function () {
		loading('cover');
	};
	jdb.showLoading = function () {
		loading('center');
	};
	jdb.hideLoading = function () {
		var $loadingPart = $('.jdb_loading');
		if ($loadingPart.length > 0) {
			$loadingPart.hide().removeClass();
		}
	};
})();
