/*
@author : chenke@jiedaibao.com

*/


;
(function() {
	var global = {};
	var utls = utls || {};
	var init = {};
	init.eventInit = function() {
		$(document).on('click', '.confirm', function(e) {
			location.replace('https://native.jiedaibao.com/web2Native/AllowAuthorization/15');
		});

		$(document).on('click', '.checkbox', function(e) {
			var thisDom = $(this);
			//console.log(thisDom.data('ifchecked'));
			if (thisDom.attr('data-ifchecked') === 'true') {
				thisDom.attr('src', '../../img/getRight/off1.png').attr('data-ifchecked', 'false');
			} else {
				thisDom.attr('src', '../../img/getRight/on1.png').attr('data-ifchecked', 'true');
			};
		});

	}
	init.status = function() {
		$.ajax({
			url: '../../img/getRight/off1.png',
			type: 'get'
		});
	}
	init.main = function() {
		//console.log('main');
		init.eventInit();
		init.status();
	}
	$(init.main);
})();