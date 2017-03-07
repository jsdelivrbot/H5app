;(function(){
	$('#tip').on('click', function(){
		$('#mask').css('display', 'block');
	});
	$('#close').on('click', function(){
		$('#mask').css('display', 'none');
	});
	$('#choose').on('click', function(){
		if($('#choose>span').css('visibility') == 'hidden'){
			$('#choose>span').css('visibility', 'visible');
		}else{
			$('#choose>span').css('visibility', 'hidden');
		}
	});
	$('#sub').on('click', function(){
		if($('#choose>span').css('visibility') == 'visible'){
			console.log('成功了');
		}else{
			console.log('失败了')
		}
	});
	function getMessage(obj,alltime){
		this.obj = obj;
		this.alltime = alltime;
		var timer = null;
		$(this.obj).on('click',function(e){
			e.preventDefault();
			$(this.obj).attr("disabled", "true");
			timer = setTimeout(getTime,1000);
		});
		function getTime(){
			if(this.alltime == 0){
				this.alltime = alltime;
				window.clearTimeout(timer);//停止计时器
		        $(this.obj).removeAttr("disabled");//启用按钮
		        $(this.obj).html("重新发送验证码");

			}else {
				this.alltime--;
		        $(this.obj).html(this.alltime + "秒内输入验证码");
			}
		}
	};
	setInterval(getMessage($('#send'),10),1000);
	// var alltime = 10;
	// var timer = null;
	// $('#send').on('click',function(e){
	// 	e.preventDefault();
	// 	$("#send").attr("disabled", "true");
	// 	timer = setInterval(getTime,1000);
	// });
	// function getTime(){
	// 	if(alltime == 0){
	// 		alltime = 10;
	// 		window.clearInterval(timer);//停止计时器
	//         $('#send').removeAttr("disabled");//启用按钮
	//         $('#send').html("重新发送验证码");

	// 	}else {
	// 		alltime--;
	//         $('#send').html(alltime + "秒内输入验证码");
	// 	}
	// }
})()