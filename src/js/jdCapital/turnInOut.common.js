;(function() {
	document.body.addEventListener('touchstart', function () { });
	
	var $btn = $( '.check-block button' ),
		$input = $( '#input-money' ),
		allowProtocal = true;
		
	var inputText = '';
	$input.on( 'input', function( e ) {

		var isBad = $input[0].validity.badInput,
			val = $input.val(),
			regex = /^\d+(\.|\.\d{1,2})?$/;

		if( val == '' ) {
			if( isBad ) {//无效输入
				$input.val( inputText );
			} else {
				inputText = val;
				$btn.removeClass( 'alive-button' );
			}
			return;
		}

		if( !regex.test( val ) ) {
			$input.val( inputText );
			return;
		}

		inputText = val;
		if( allowProtocal ) {
			$btn.addClass( 'alive-button' );
		}
	} );
	$input.trigger( 'input' );

	$( '#allow-protocal' ).on( 'change', function( e ) {
		allowProtocal = $( this ).prop( 'checked' );
		if( !allowProtocal ) {
			$btn.removeClass( 'alive-button' );
		} else {
			$input.trigger( 'input' );
		}
	} );

	window.parseParam = function(param, key) {
		var paramStr = '';
		if (param instanceof String || param instanceof Number || param instanceof Boolean) {
			paramStr += '&' + key + '=' + encodeURIComponent(param);
		} else {
			$.each(param, function (i) {
				var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
				paramStr += '&' + parseParam(this, k);
			});
		}
		return paramStr.substr(1);
	}
})();