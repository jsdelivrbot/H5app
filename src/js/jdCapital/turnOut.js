;(function(){
	var $btn,$input,$type,bankName,cardNo,cardType,showType;

	var params = utls.getMyObjFromUrl( { 'token': '','accessToken': '','memberID': '','udid': '','appKey': '','clientVersion': '' } ),
		isHide = true,
		amount, totAmt;

		params.cardID = '';
		params.bankName = '';
		params.cardNo = '';
		params.cardType = '';
	var reg = /^2.[1-9]{1}.[0-9]{1}$/;
	var rex = /^2.[2-9]{1}.[0-9]{1}$/;
	var first = $( '.first-part' ),
		second = $( '.second-part' ),
		turnOutBtn = $( '.turnOut-btn' ),
		clear = $('.clear'),
		bank = $( '.bank' );
	/**
	 * 总方法，获取页面url参数
	 */
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
	/**
	 * 输入框更改逻辑
	 */
	function changeInput($btn,$input){

		allowProtocal = true;
		var inputText = '';

		$input.on( 'input', function( e ) {

			var isBad = $input[0].validity.badInput,
				val = $input.val(),
				regex = /^\d+(\.|\.\d{1,2})?$/;

			clear.hide();

			if( val == '' ) {
				if( isBad ) {//无效输入
					$input.val( '' );
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
				params.val = inputText*100;
				clear.show();
			}
		} );
		$input.trigger( 'input' );

		$( '#allow-protocal' ).on( 'change', function( e ) {
			allowProtocal = $( this ).prop( 'checked' );
			if( !allowProtocal ) {
				$btn.removeClass( 'alive-button' );
				$('.hide_text').hide();
			} else {
				$input.trigger( 'input' );
			}
		} );
	}
	/**
	 * 获取银行卡信息
	 */
	$.post( '{{getCapitalBankApi}}',
		{ memberID: params.memberID, accessToken: params.accessToken, udid:  params.udid, appKey:  params.appKey, businessType: 3,ext:'eydtZXJjaGFudElkJzonJywndHlwZSc6JzE1J30='},
		function( result ) {
			var resultData;
			if( typeof result == 'string' ) {
				result = JSON.parse( result );
			}

			if( result.error.returnCode != 0 ){
				toastError('银行卡信息获取失败');
				return;
			}

			if( (result.data.availableCardList.length == 0)&&(result.data.unavailableCardList.length == 0) ){
				$(".second-part").html('');
				showType = 0;
				return;
			}

			if( result.data.availableCardList.length == 0 ){
				resultData = result.data.unavailableCardList[0];
			}else{
				resultData = result.data.availableCardList[0];
			}

			params.cardID = resultData.cardID;
			params.url = resultData.logoUrl;
			params.bankName = resultData.bankName;
			params.cardNo = resultData.cardNo;
			params.cardType = resultData.cardTypeName;

			addBankLink(params.cardID,params.val);

			$(".bank>img").prop( 'src',params.url );
			$(".bank-content").html( "<p>" + params.bankName + "</p><p><span>" + params.cardType + "</span><span>尾号" + params.cardNo + "</span></p>" );
		}
	);

	//绑定银行卡点击事件
	var addBankLink = function(cardID,amount){
		var selectedBankCard;
		if( !amount ){
			amount = 0;
		}
		if( !rex.test(params.clientVersion) ){
			selectedBankCard = JSON.stringify({cardID:cardID,payType:2,businessType:3,amount:amount});
		}else{
			selectedBankCard = JSON.stringify({cardID:cardID,payType:2,businessType:3,amount:amount,ext:'eydtZXJjaGFudElkJzonJywndHlwZSc6JzE1J30='});
		}
		bank.on('click',function(){
			window.location.href = 'https://native.jiedaibao.com/web2Native/bankCardList?selectedBankCard=' + selectedBankCard;
		});
	}

	//选择银行卡后的回调
	window.selectBankCard = function(ret) {
		var result;

		if (typeof ret == 'object') {
			result = ret;
		} else {
			result = JSON.parse(ret);
		}
		params.cardID = result.cardID;
		params.url = result.logoUrl;
		params.bankName = result.bankName;
		params.cardNo = result.cardNo;
		params.cardType = result.cardTypeName;
		$(".bank>img").prop( 'src',params.url );
		$(".bank-content").html( "<p>" + params.bankName + "</p><p><span>" + params.cardType + "</span><span>尾号" + params.cardNo + "</span></p>" );
		addBankLink(params.cardID);
	}
	/**
	 * 提交调起收银台逻辑
	 */
	var subtn = function(btn,input,type){

		if( !btn.hasClass( 'alive-button' ) ) {
			return;
		}

		var input = $.trim( input.val() );
		if( !input || input == '' ) {
			toastError( '请输入金额' );
			return;
		}

		if( input <= 0 ) {
			toastError( '操作金额不得为0' );
			return;
		}

		if( input > totAmt ) {
			toastError( '转出金额不能超出余额');
			return;
		}

		if($type != 1){
			if( input < 10 ) {
				toastError( '转出金额每笔不能少于10元' );
				return;
			}
		}

		btn.addClass( 'disabled' );
		var reqData = {
			token: params.token,
			txAmt: Math.round( parseFloat( input ) * 100 ),
			reqId: utls.getReqId( params.token ),
			perFlg: $type,
			agrNo: params.cardID
		};
		$.post( '{{getCapitalTurnOutApi}}',
			{
				reqData: JSON.stringify( reqData )
			},
			function( result ) {

				if( typeof result == 'string' ) {
					result = JSON.parse( result );
				}

				if( result.error.returnCode != 0 ) {
					toastError( result.error.returnUserMessage );
					btn.removeClass( 'disabled' );
					return;
				}

				var resultData = result.data;

				amount = resultData.txAmt / 100;
				params.txJurNo = resultData.orderId;
				//获取支付订单id 唤起收银台
				window.location.href = 'https://native.jiedaibao.com/web2Native/pay?' +
					'tradeID=' + resultData.orderId + '&amount=' + resultData.txAmt + '&ext=' + resultData.txnType;
			}
		);
	}

	// 支付完成之后的回调
	window.JDBPayCallback = function(ret) {
		var result;
		if (typeof ret == 'object') {
			result = ret;
		} else {
			result = JSON.parse(ret);
		}

		$btn.removeClass( 'disabled' );

		if( result.status != 0 ) {


			if( result.status == 1 ) {
				$btn.addClass( 'alive-button' );
			}
			return;
		}

		var str = parseParam( {
			txJurNo: params.txJurNo,
			token: params.token,
			accessToken: params.accessToken,
			memberID: params.memberID,
			udid: params.udid,
			appKey: params.appKey,
			clientVersion: params.clientVersion
		} );

		window.location.href = './turnOutResult.html?' + str;
	}


	/**
	 * 页面逻辑
	 */

	clear.on('tap',function(event){
		event.stopPropagation();
		$(this).prev().val('');
		$( '.check-block .button' ).removeClass( 'alive-button' );
		$(this).hide();
	})

	//消灭底部文案
	$(window).resize(function() {
		if(isHide){
			$('.bottom-desc').css('display','none');
			isHide = false;
		}else{
			$('.bottom-desc').css('display','block');
			isHide = true;
		}
	});

	$( '.tab-item:first-child' ).on( 'click',function(){
		window.location.href = 'https://native.jiedaibao.com/web2Native/setTitle?title=' + '转出到余额';

		$btn = $( '.check-block #turnOut-btn' );
		$input = $( '#input-money' );
		$type = 1;
		$input.val('');

		changeInput($btn,$input);

		/**
		 * 请求支付获取余额接口方法
		 */
		 $.post( '{{getCapitalTurnInDetailApi}}',
			{ reqData: JSON.stringify( { token: params.token } ) },
			function( result ) {
				if( typeof result == 'string' ) {
					result = JSON.parse( result );
				}

				if( result.error.returnCode != 0 ) {
					toastError( result.error.returnUserMessage );
					return;
				}

				var resultData = result.data;

				totAmt = resultData.accTotAmt / 100;

				$input.attr( 'placeholder', '本次最多转出' + totAmt + '元' );

			}
		);


		for(var i=0;i<$( '.tab-item' ).length;i++){
			$($( '.tab-item' )[i]).removeClass('active');
		}
		$(this).addClass('active');
		second.hide();
		first.show();
		$btn.unbind("click").click(function(event){
			event.stopPropagation()
			subtn($btn,$input,$type);
		});

	} );

	$( '.tab-item:first-child' ).trigger( 'click' );

	$( '.tab-item:last-child' ).on( 'click',function(){

		if( !reg.test(params.clientVersion) ){

			toast({
				text: "请升级到最新版本，体验当前功能",
				type: "error",
				ms: 2000,
				callback: function(){
					$( '.tab-item:first-child' ).trigger( 'click' );
				}
			})
		}else if(showType == 0){

			toast({
				text: "您还未绑定银行卡",
				type: "error",
				ms: 2000,
				callback: function(){
					$( '.tab-item:first-child' ).trigger( 'click' );
				}
			})

		}else{

			window.location.href = 'https://native.jiedaibao.com/web2Native/setTitle?title=' + '转出到银行卡';

			$btn = $( '.check-block #turnOut-bank' );
			$input = $( '#input-bank' );
			$type = 0;
			$input.val('');

			changeInput($btn,$input);
			for(var i=0;i<$( '.tab-item' ).length;i++){
				$($( '.tab-item' )[i]).removeClass('active');
			}
			$(this).addClass('active');
			first.hide();
			second.show();

			$btn.unbind("click").click(function(event){
			 	event.stopPropagation()
				subtn($btn,$input,$type);
			});

			/**
			 * 请求支付获取余额接口方法
			 */
			 $.post( '{{getCapitalTurnInDetailApi}}',
				{ reqData: JSON.stringify( { token: params.token } ) },
				function( result ) {
					if( typeof result == 'string' ) {
						result = JSON.parse( result );
					}

					if( result.error.returnCode != 0 ) {
						toastError( result.error.returnUserMessage );
						return;
					}

					var resultData = result.data;

					totAmt = resultData.accTotAmt / 100;

					$input.attr( 'placeholder', '本次最多转出' + totAmt + '元' );

				}
			);

		}

	} );



})();
