;(function() {
	document.body.addEventListener('touchstart', function () { });

	var $doc = $( document ),
		$body = $doc.find( 'body' ),
		$background, $dialog, $header,
		className;

	function init(){
		var dialogTpl = 
			'<div class="dialog-wrap">'+
				'<div class="dialog-background"></div>'+
				'<div class="dialog-base">'+
					'<div class="dialog-header"></div>'+
					'<div class="dialog-content"></div>'+
					'<div class="dialog-footer"></div>'+
				'</div>'+
			'</div>';

		$body.append( dialogTpl );
		$dialog = $( '.dialog-base' );
		$header = $( '.dialog-header' );
		$content = $( '.dialog-content' );
		$footer = $( '.dialog-footer' );
		$dialogWrap = $( '.dialog-wrap' );
		// $background = $( '.dialog-background' );

		// $background.on( 'touchstart', function( e ) {
		// 	return false;
		// } );
	}

    /**
      * text: 提示语句
      * type: ‘alert’ - 提示框 ‘confirm’ － 确认框 ‘dialog’ － 自定义
      * callback: 回调函数
      */
	function show( opt ){

		var typeClass,
			btnStr = '',
			buttonList = [],
			option = {
				type: 'alert',
				title: '',
				content: '',
				callback: undefined
			};

		option = $.extend( option, opt );

		if( !$dialog || $dialog.length == 0 ) {
			init();
		}

		//处理buttons
		buttonList = option.button;

		switch( option.type ) {
			case 'alert': {
				buttonList = [
					{ style: 'blue', type: 'ok', text: '确定' }
				];

				break;
			}
			case 'confirm': {
				buttonList = [
					{ style: 'default', type: 'cancel', text: '取消' },
					{ style: 'blue', type: 'ok', text: '确定' }
				];
				break;
			}
			case 'dialog': {
				buttonList = option.button || [
					{ style: 'blue', type: 'ok', text: '确定' }
				];
				break;
			}
		}

		//处理header
		if( option.title != '' ) {
			$header.html( option.title ).show();
		} else {
			$header.hide();
		}

		//处理content
		if( option.content != '' ) {
			$header.removeClass( 'dialog-htitle' );
			$content.html( option.content ).show();
		} else {
			$header.addClass( 'dialog-htitle' );
			$content.hide();
		}

		$.each( buttonList, function( index, button ) {
			btnStr += '<a class="dialog-btn dialog-btn-' + button.style + '" data-type="' + button.type + '">' + button.text + '</a>'
		} );
		
		$footer.html( btnStr );

		$footer.find( '.dialog-btn' ).on( 'click', function() {
			var $this = $( this );

			$dialogWrap.hide();

			option.callback && option.callback( {
				closeType : $this.attr( 'data-type' ),
				data: {}
			} );
		} );

		$dialogWrap.css( 'visibility', 'hidden' ).show();
		$dialog.css( 'margin', '-' + $dialog.height() / 2 + 'px 0 0 -' + $dialog.width() / 2 + 'px' );
		$dialogWrap.css( 'visibility', 'visible' );
	}

	window.dialog = {
		dialog : show,
		alert: function( input, callback ) {
			var opt;
			if( typeof input == 'string' ) {
				opt = {
					title: input
				}
			} else {
				opt = input;
			}

			opt.type = 'alert';
			opt.callback = callback;
			show( opt );
		},
		confirm: function( input, callback ) {
			var opt;
			if( typeof input == 'string' ) {
				opt = {
					title: input
				}
			} else {
				opt = input;
			}

			opt.type = 'confirm';
			opt.callback = callback;
			show( opt );
		}
	};

})();