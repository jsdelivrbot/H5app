;(function(){
	document.body.addEventListener('touchstart', function () { });
	var cover = $( '.cover' ),
		occList = $( '.occ-list' ),
		params = utls.getMyObjFromUrl( { 'token': '','txJurNo': '','applyTime': '','accessToken': '','memberID': '','udid': '','appKey': '','clientVersion': '' } ),
		submitBtn = $( '#btn-submit' ),
		$input = $( '#home_address' ),
		regex = /^[\u4e00-\u9fa5]+[\u4e00-\u9fa5\w-\#]{0,}$/,
		regei = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-])(10|12|0?[13578])([-])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(11|0?[469])([-])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(0?2)([-])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-])(0?2)([-])(29)$)|(^([3579][26]00)([-])(0?2)([-])(29)$)|(^([1][89][0][48])([-])(0?2)([-])(29)$)|(^([2-9][0-9][0][48])([-])(0?2)([-])(29)$)|(^([1][89][2468][048])([-])(0?2)([-])(29)$)|(^([2-9][0-9][2468][048])([-])(0?2)([-])(29)$)|(^([1][89][13579][26])([-])(0?2)([-])(29)$)|(^([2-9][0-9][13579][26])([-])(0?2)([-])(29)$))/,
		nowSelectVal = '0';

		// changeInput(submitBtn,$input);

		// function changeInput($btn,$input){
			
		// 	allowProtocal = true;
		// 	var inputText = '';
			
		// 	$input.on( 'input', function( e ) {
		// 		console.log($input);
		// 		var isBad = $input[0].validity.badInput,
		// 			val = $input.val(),
		// 			regex = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
			
		// 		if( val == '' ) {
		// 			if( isBad ) {//无效输入
		// 				$input.val( '' );
		// 			} else {
		// 				inputText = val;
		// 				$btn.removeClass( 'alive-button' );
		// 			}
		// 			return;
		// 		}

		// 		if( !regex.test( val ) ) {
		// 			$input.val( inputText );
		// 			return;
		// 		}

		// 		inputText = val;
		// 		if( allowProtocal ) {
		// 			$btn.addClass( 'alive-button' );
		// 		}
		// 	} );
		// 	$input.trigger( 'input' );

		// 	$( '#allow-protocal' ).on( 'change', function( e ) {
		// 		allowProtocal = $( this ).prop( 'checked' );
		// 		if( !allowProtocal ) {
		// 			$btn.removeClass( 'alive-button' );
		// 			$('.hide_text').hide();
		// 		} else {
		// 			$input.trigger( 'input' );
		// 		}
		// 	} );
		// } 

	submitBtn.on( 'click', function() {
		var job = $( '#jobCode' ).val(),
			address = $( '#home_address' ).val(),
			idCard = $( '#idcard-text' ).val();
		var cur = idCard.replace(/-/g, '') - utls.formatData().substr(0,10).replace(/-/g, '');
		if( job == '' || address == '' || idCard == '' ){
			toastError( '请完成表单后，再次提交' );
			return;
		}


		if( !regex.test( address ) ) {
			toastError( '请不要输入除汉字、数字、字母、"-"和"#"以外的字符' );
			return;
		}

		if( idCard == '长期' ){
			idCard = '2099-01-01';
		}
		
		if( !regei.test( idCard ) || (cur<0) ) {
			toastError( '您输入的日期有误' );
			return;
		}
			
		
		submitBtn.addClass( 'disabled' );

		var reqData = {
			reqId: utls.getReqId( params.token ),
			token: params.token,
			job: job,
			fnyAddr: address,
			docVdyDt: idCard
		};

		$.post( '{{setInformationApi}}', 
			{
				reqData: JSON.stringify( reqData )
			},
			function( result ) {
				submitBtn.removeClass( 'disabled' );
				if( result.error.returnCode != 0 ) {
					toastError( result.error.returnUserMessage );
					return;
				}
				
				window.location.href = './turnOut.html?token=' + params.token + '&accessToken=' + params.accessToken + '&memberID='+ params.memberID + '&udid=' + params.udid + '&appKey=' + params.appKey + '&clientVersion=' + params.clientVersion;
			} 
		);
	} );

	// var inputText = '';
	// $input.on( 'input', function( e ) {

	// 	var isBad = $input[0].validity.badInput,
	// 		val = $input.val();

	// 	if( val == '' ) {
	// 		if( isBad ) {//无效输入
	// 			$input.val( inputText );
	// 		} else {
	// 			inputText = val;
	// 		}
	// 		return;
	// 	}

	// 	if( !regex.test( val ) ) {
	// 		$input.val( inputText );
	// 		return;
	// 	}

	// 	inputText = val;
	// } );
	// $input.trigger( 'input' );

	var allLabels = $( '.item-radio label' );
	$( '#job' ).on( 'click', function( e ) {
		$( this ).blur();
		
		allLabels.filter( '.view-check' ).removeClass( 'view-check' );
		occList.find( 'input[value="' + nowSelectVal + '"]' ).prop( 'checked', 'checked' )
			.closest( 'label' ).addClass( 'view-check' );

		cover.show();
	} );

	cover.find( '.background' ).on( 'click', function( e ) {
		cover.hide();
	} );

	allLabels.on( 'click', function() {
		allLabels.filter( '.view-check' ).removeClass( 'view-check' );
		$( this ).addClass( 'view-check' );
	} );

	var viewInput = $( 'input[name="job"]' ),
		hiddenInput = $( 'input[name="jobCode"]' );
	$( '.btn-back' ).on( 'click', function( e ) {
		e.preventDefault();
		var selectEl = occList.find( 'input[name=group]:checked' );

		nowSelectVal = selectEl.val();
		viewInput.val( selectEl.closest( 'label' ).find( 'span' ).text() );
		hiddenInput.val( nowSelectVal );

		cover.hide();
	} );

	var idCareText = $( '#idcard-text' ),
		idCareDate = $( '#idcard-date' );

	// idCareText.on( 'focus', function() {
	// 	idCareText.hide();
	// 	idCareDate.show().focus();
	// } );

	// idCareDate.on( 'blur', function() {
	// 	idCareText.val( idCareDate.val() );

	// 	idCareText.show();
	// 	idCareDate.hide();
	// } );

})();
