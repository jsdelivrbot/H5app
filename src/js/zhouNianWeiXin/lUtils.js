//lDisplay display相关=======================================================================================================================================

/**
 * 修正目标中心点
 * @param {Object} target	目标对象
 * @param {Object} transformOrigin	中心点
 */
function lChangeTransformOrigin (target,transformOrigin,scaleX,scaleY) {
	var tTo=target.style.transformOrigin
	var ctoArr=toToP(tTo)
	var ttoArr=toToP(transformOrigin)
	var tScX//目标scaleX
	var tScY//目标scaleY
	if(scaleX==undefined)
	{
		if(target._gsTransform==undefined || target._gsTransform.scaleX==undefined)
		{
			tScX=1
		}else {
			tScX= target._gsTransform.scaleX
		}
	}
	
	if(scaleY==undefined)
	{
		if(target._gsTransform==undefined || target._gsTransform.scaleY==undefined)
		{
			tScY=1
		}else {
			tScY= target._gsTransform.scaleY
		}
	}

	//console.log(target._gsTransform.scaleX);
	TweenMax.set(target,{
		transformOrigin:transformOrigin,
		left:"+="+target.offsetWidth*(ttoArr[0]-ctoArr[0])*(tScX-1),
		top:"+="+target.offsetHeight*(ttoArr[1]-ctoArr[1])*(tScY-1)})
	
	//console.log(ctoArr,ttoArr);
	
	function toToP (to) {
		console.log("toToP",to);
		//console.log(to=="");
		var toX
		var toY
		var toArr
		if(to=="")
		{
			toX=toY=0.5
		}else{
			toArr=to.split(" ")
			//console.log(toArr,"--");
			if(toArr[0].indexOf("%")!=-1)
			{
				
				toX=parseFloat(toArr[0].split("%")[0])/100
				
			}else if(toArr[0].indexOf("px")!=-1){
				toX=parseFloat(toArr[0].split("px")[0])/target.offsetWidth
			}else if(toArr[0]=="left")
			{
				toX=0
			}else if(toArr[0]=="right")
			{
				toX=1
			}else if(toArr[0]=="center")
			{
				toX=0.5
			}else{
				console.log("非法的transformOrigin字符串",to);
			}
			
			//console.log(toArr);
			if(toArr[1].indexOf("%")!=-1)
			{
				
				toY=parseFloat(toArr[1].split("%")[0])/100
				
			}else if(toArr[1].indexOf("px")!=-1){
				toY=parseFloat(toArr[1].split("px")[0])/target.offsetHeight
			}else if(toArr[1]=="top")
			{
				toY=0
			}else if(toArr[1]=="bottom")
			{
				toY=1
			}else if(toArr[1]=="center")
			{
				toY=0.5
			}else{
				console.log("非法的transformOrigin字符串",to);
			}
			
			//console.log(toX,toY);
		}
		return [toX,toY]
	}
}
/**
 * 队列排序
 * @param {Object} tArray	对象数组
 * @param {Object} aw	area宽
 * @param {Object} ah	area高
 * @param {Object} tw	对象宽
 * @param {Object} th	对象高
 * @param {Object} iw	间隔宽
 * @param {Object} ih	间隔高
 * @param {Object} horizontal 横向	
 */
function lFlow (tArray,aw,ah,tw,th,iw,ih,horizontal) {
	
	if(horizontal==undefined) horizontal=true
	
	var areaW = aw
	var areaH = ah
	var maxN
	var curX=0
	
	var rect
	if(horizontal)
	{
		maxN = parseInt((areaH-th)/(th+ih))
		maxN+=1
		
		for (var i = 0; i <tArray.length ; i++) 
		{
			tArray[i].style.top = (th + ih) * (i % maxN)+"px"
			
			if (i % maxN == 0 && i!=0)
			{
				curX+=tw+iw
			}
			tArray[i].style.left = curX+"px"
			
		}
		rect={width:curX+iw+tw,height:(maxN-1)*(th+ih)+th}
	}else{
		maxN = parseInt((areaW-tw)/(tw+iw))
		maxN+=1
		
		for (var i = 0; i <tArray.length ; i++) 
		{
			tArray[i].style.left = (tw + iw) * (i % maxN)+"px"
			
			if (i % maxN == 0 && i!=0)
			{
				curX+=th+ih
			}
			tArray[i].style.top = curX+"px"
			
		}
		rect={width:(maxN-1)*(tw+iw)+tw,height:curX+ih+th}
	}
	
	return rect
}

/**
 * 全局坐标
 * @param {Object} target
 */
function lGetGlbPoint (target) 
{
	var t=target
	var tx=0
	var ty=0
	for (var i = 0; i < 1; i++) {
		//console.log(t);
		if(t.style.left!="") tx+=parseInt(t.style.left)
		if(t.style.top!="") ty+=parseInt(t.style.top)
		
		//console.log(t.style.left,t.style.top,"----------");
		if(t.parentNode!=undefined&&t!=document.body)
		{
			t=t.parentNode
			i--
		}
	}
	
	return {x:tx,y:ty}
}

/**
 * mask,在安卓中content不能有任何transform变化，貌似bigDiv里也不能包含任何有transform变化的对象
 * 
 * 用法：
 
 	//移动内容
	var lls = lMask(p1,0,0,280,129,imgPath+"ass118.png",imgPath+"baiduEf_01.png")
	
	var lls_tl = new TimelineMax({repeat:-1,paused:true})
	lls_tl.to(lls.content,0,{left:-500})
	lls_tl.to(lls.content,1,{left:500})
	lls_tl.render(0)
	lls_tl.play()
	
	//移动mask
	var lls = lMask(indexP,120,122,519,266,imgPath+"baiduEf_01.png",imgPath+"ass008_o.png")
	
	var lls_tl = new TimelineMax({repeat:-1,paused:true})
	lls_tl.to(lls.mask,0,{webkitMaskPositionX:-500})
	lls_tl.to(lls.mask,1,{webkitMaskPositionX:500})
	lls_tl.play()
	
属性：
light	光
 * 
 * 
 * @param {Object} p	父级
 * @param {Number} x	x
 * @param {Number} y	y
 * @param {Number} maskW	mask宽
 * @param {Number} maskH	mask高
 * @param {String} maskPic	mask(png图，有像素的地方是可见区域)
 * @param {String} content	内容
 */
function lMask(p,x,y,maskW,maskH,maskPic,content) {
	var bigDiv = lDiv(p,x,y)
	
	//遮罩
	var maskDiv = lDiv(bigDiv,0,0,0,0)
	
	//光
	var contentImg = lImg(content,maskDiv,0,0)
	
	maskDiv.style.webkitMaskImage = "url("+maskPic+")"
	
	maskDiv.style.webkitMaskPositionX=0+"px"
	maskDiv.style.webkitMaskPositionY=0+"px"
	maskDiv.style.webkitMaskRepeat="no-repeat"
	
	maskDiv.style.width = maskW+"px"
	maskDiv.style.height = maskH+"px"
	
	bigDiv.content = contentImg
	bigDiv.mask = maskDiv
	
	return bigDiv
}

/**
 * 
用法：
	var lfa = lFrameAni([ass27,ass28,ass29,ass30])
	lfa.play()
	
属性：
frameLength	帧长度
curFrame	当前帧
lastFrame	上一帧
tArr	对象数组

方法：
curTarget()	当前对象
nextFrame()	下一帧
prevFrame()	上一帧
play()	播放
stop()	停止
gotoAndStop()	跳转并停止
gotoAndPlay()	跳转并播放

事件：
onChange(当前帧)	当帧变化时触发

 * 
 * @param {Object} parent
 * @param {Number} left
 * @param {Number} top
 * @param {Array} fArr	帧数组
 * @param {Number} time	帧间隔时间，默认1/10秒
 */
function lFrameAni (parent,left,top,fArr,time) {
	var fAniObj=lCreateElm("div",parent,left,top)
	
	if(time==undefined) time=1/10
	
	var parent = fAniObj
	
	for (var i = 0; i < fArr.length; i++) {
		lRemoveChild(fArr[i])
		//fAniObj.appendChild(fArr[i])
		/*
		if(parent!=fArr[i].parentNode)
		{
			console.log("lFrameAni:","请将对象都放置在同一容器中");
		}
		parent.removeChild(fArr[i])
		*/
		TweenMax.to(fArr[i],0,{autoAlpha:0,display:"block"})
	}
	
	
	TweenMax.to(fArr[0],0,{autoAlpha:1})
	parent.appendChild(fArr[0])
	
	fAniObj.frameLength=fArr.length
	
	fAniObj.lastFrame=fAniObj.frameLength
	fAniObj.tmF=0
	fAniObj.curFrame=0
	fAniObj.tl = TweenMax.to(fAniObj,time*fAniObj.frameLength,{tmF:fAniObj.frameLength,onUpdate:onUpdate,repeat:-1,ease:Power0.easeNone})
	
	fAniObj.tl.pause()
	fAniObj.tArr = fArr
	
	var tempF
	var lastF
	var curF
	function onUpdate () {
		tempF = Math.round(fAniObj.tmF)
		//console.log(tempF);
		
		tempF = lNumRange(tempF,0,fAniObj.frameLength-1)
		
		if(tempF!=fAniObj.curFrame)
		{
			fAniObj.lastFrame = fAniObj.curFrame
			fAniObj.curFrame = tempF
			
			lastF = fArr[fAniObj.lastFrame]
			curF = fArr[fAniObj.curFrame]
			
			//console.log(lastF,lastF,fAniObj.lastFrame,fAniObj.curFrame);
			
			//处理上一帧

			TweenMax.to(lastF,0,{autoAlpha:0,display:"block"})
			parent.removeChild(lastF)
			
			//处理当前帧
			TweenMax.to(curF,0,{autoAlpha:1})
			parent.appendChild(curF)
			
			if(fAniObj.onChange!=undefined)
			{
				fAniObj.onChange(fAniObj.curFrame)
			}
			//console.log(fAniObj.curFrame,fAniObj.onChange);
		}
	}
	
	var tF
	fAniObj.nextFrame=function () {
		tF = fAniObj.curFrame+1
		if(tF >= fAniObj.frameLength)
		{
			tF=0
		}
		fAniObj.gotoAndStop(tF)
	}
	fAniObj.prevFrame=function () {
		tF = fAniObj.curFrame-1
		if(tF < 0)
		{
			tF=fAniObj.frameLength-1
		}
		fAniObj.gotoAndStop(tF)
	}
	fAniObj.gotoAndStop=function (num) {
		fAniObj.tl.seek(time*num)
		onUpdate()
		fAniObj.stop()
	}
	fAniObj.gotoAndPlay=function (num) {
		fAniObj.tl.seek(time*num)
		onUpdate()
		fAniObj.play()
	}
	fAniObj.play=function () {
		fAniObj.tl.play()
	}
	
	fAniObj.stop=function () {
		fAniObj.tl.pause()
	}
	
	fAniObj.curTarget=function () {
		return fAniObj.tArr[fAniObj.curFrame]
	}
	
	//fAniObj.gotoAndStop(0)
	
	return fAniObj
}

/**

属性：
curId	当前页id

方法：
next()	下一页
prev()	上一页
gotoPage()	跳转到指定页


 * @param {Array} tArr
 */
function lFrameSimple (tArr) {
	var lfs = {}
	var count = lCountNum(tArr.length,false,change)
	lfs.tArr=tArr
	lfs.curId=0
	
	TweenMax.to(tArr,0,{autoAlpha:0})
	TweenMax.to(tArr[0],0,{autoAlpha:1})
	
	lfs.next=function () {
		count.next()
	}
	lfs.prev=function () {
		count.prev()
	}
	lfs.gotoPage=function (n) {
		if(n==-1)
		{
			TweenMax.to(tArr[lfs.curId],0,{autoAlpha:0})
		}else{
			TweenMax.to(tArr[lfs.curId],0,{autoAlpha:1})
			count.setCurId(n)
		}
		
	}
	
	function change (tn) 
	{
		//console.log(tn);
		lfs.curId=tn
		//console.log(tn,count.lastId);
		TweenMax.to(tArr[count.lastId],0,{autoAlpha:0})
		TweenMax.to(tArr[tn],0,{autoAlpha:1})
	}
	
	return lfs
}

/*
用法：
var p1Rtp1 = lRandomTimePlay(function () {
	//开始
	TweenMax.to(ass48,0,{scale:0,rotation:0})
	
	//动画
	TweenMax.to(ass48,0.3,{scale:1,yoyo:true,repeat:1})
	TweenMax.to(ass48,0.6,{rotation:180})
},1,2)
p1Rtp1.play()

方法：
stop()	停止
play()	播放
*/

/**
 * 随机时间触发
 * 
 * @param {Function} onR	当发动时
 * @param {Number} rTimeMin	最小时间
 * @param {Number} rTimeMax	最大时间
 */
function lRandomTimePlay (onR,rTimeMin,rTimeMax) {
	if(rTimeMin==undefined) rTimeMin=0
	if(rTimeMax==undefined) rTimeMax=1
	var lRTPObj={}
	
	
	lRTPObj.tween = function () {
		lRTPObj.curTween = TweenMax.to(lRTPObj,lRandomRange(rTimeMin,rTimeMax),{onComplete:function () {
			
			if(onR!=undefined)
			{
				onR()
			}
			
			lRTPObj.tween()
		}})
	}
	
	//lRTPObj.tween()
	
	lRTPObj.stop=function () {
		if(lRTPObj.curTween!=undefined)
		{
			lRTPObj.curTween.pause()
		}
	}
	
	lRTPObj.play=function () {
		lRTPObj.stop()
		lRTPObj.tween()
	}
	
	return lRTPObj
	//lRTPObj.tween()
}

/**
 * 箭头动画。扩展至lPsEf，属性方法参考原方法。
 * 
用法:
var arrowAni = lArrowAni(imgPath+"ass81.png",mainDiv,640/2-97/2,841,3,30,0.8,true)
arrowAni.play()

 * 
 * @param {String} imgSrc	箭头图片src
 * @param {Object} p	父级
 * @param {Number} x	x
 * @param {Number} y	y
 * @param {Number} arrowNum	箭头数量
 * @param {Number} d	箭头间隔,传入一个负值即可翻转运动方向
 * @param {Number} time	动画时间
 * @param {Boolean} v	垂直
 */
function lArrowAni (imgSrc,p,x,y,arrowNum,d,time,v) {
	
	if(v==undefined) v=true
	
	var movD = d*arrowNum
	var movTime = time*arrowNum
	
	var arrowDiv = lPsEf(p,x,y,arrowNum,[imgSrc],onTl,false)
	
	function onTl (t) {
		//console.log(t)
		var tl = new TimelineMax()
		
		if(v)
		{
			//console.log(movD,movTime)
			tl.to(t,0,{y:movD,autoAlpha:0,ease:Power0.easeNone})
			tl.to(t,movTime/2,{y:movD/2,autoAlpha:1,ease:Power0.easeNone})
			tl.to(t,movTime/2,{y:0,autoAlpha:0,ease:Power0.easeNone})
		}else{
			tl.to(t,0,{x:movD,autoAlpha:0,ease:Power0.easeNone})
			tl.to(t,movTime/2,{x:movD/2,autoAlpha:1,ease:Power0.easeNone})
			tl.to(t,movTime/2,{x:0,autoAlpha:0,ease:Power0.easeNone})
		}
		
		return tl
	}
	
	return arrowDiv
}

/**
 * 针对摆放在舞台上的对象做效果
 * 
 用法：
	var psef=lPsEfByLayout([ass054,ass055],function (tl,img,i) {
		
		tl.to(img,1,{y:20})
		tl.to(img,1,{y:0})
		
	},false)
	psef.play()
	
 * 
 * @param {Object} arr
 * @param {Object} onTl
 * @param {Object} random
 */
function lPsEfByLayout(arr,onTl,random) {
	var psObj = {}
	if(random==undefined) random=false
	psObj.psArr=arr
	psObj.psNum=arr.length
	psObj.timeLineArr=[]
	var psNum = psObj.psNum
	
	for (var i = 0; i < arr.length; i++) {
		
		var tl = new TimelineMax()
		onTl(tl,psObj.psArr[i],i)
		psObj.timeLineArr[i] = tl
		
		tl.repeat(-1)
		tl.paused(true)
		//console.log(tl)
		
		if(random==true)
		{
			tl.progress(Math.random())
		}else if(random==false){
			tl.progress(1/psNum*i)
		}
	}
	
	lTlArrCtrl(psObj)
	
	return psObj
}

/*

简单粒子动画，建立固定数量的timeline，并将时间线进程打乱

用法：
	//喷射
	var psEf1=lPsEf(p1,0,0,10,[div],function (tl,img,i) 
	{
		//开始
		tl.to(img,0,{autoAlpha:1,x:0,y:0,scale:1})
		
		//动画
		tl.to(img, 2, 
		{
			ease:Sine.easeIn,
			scale:0.1,
			x:lRandomRange(200,640),
			y:200
			
		},"");
		
		
	},false)
	psEf1.play()
	
	//扩散
	var psEf2=lPsEf(p1,320,0,3,[imgPath+"ass006.png"],function (tl,img,i) 
	{
		//开始
		tl.to(img,0,{autoAlpha:1,scale:0})
		
		//动画
		tl.to(img, 3, 
		{
			scale:2,
			autoAlpha:0,
		},"");
		
	},false)
	psEf2.play()

方法：
play()	开始动画
stop()	停止动画
delayPlay(最小时间,最大时间,是否随机分布)	延迟播放
killDelayPlay()	删除延迟播放
progress(最小进度,最大进度,是否随机分布)	设置进度
setOneShot()	设置一起同时播放，设置该属性后，每次调用play后只播一次

属性：
psArr	对象数组
psNum	粒子数量
*/

/**
 * @param {Object} p	父级
 * @param {Number} x	x
 * @param {Number} y	y
 * @param {Number} psNum	粒子数量
 * @param {Array} psElm	粒子图片或div，可传入数组。如果是数组则随机从该数组中选一个。
 * @param {Object} onTl	时间线方法，将传入当前对象和序号，必须返回创建好的时间线，并且必须是TimelineMax
 * @param {Object} random	将时间线进程随机分布，false则平均间隔分布,"none"则不处理
 * @param {Boolean} elmOrder	对象采取规则，true则随机取样，false则顺序取样。默认false
 */
function lPsEf(p,x,y,psNum,psElm,onTl,random,elmOrder) {
	//console.log(lTyepof(psElm[0]))
	if(random==undefined) random=false
	if(elmOrder==undefined) elmOrder=false
	var psObj = lDiv(p,x,y)
	
	psObj.psNum=psNum
	psObj.psArr=[]
	psObj.timeLineArr=[]
	
	//如果ps对象是div则将其
	if(lTyepof(psElm)=="Array")
	{
		for (var i = 0; i < psElm.length; i++) {
			
			if(lTyepof(psElm[i])!="String")
			{
				psElm[i].parentElement.removeChild(psElm[i])
				//console.log(111);
			}
		}
	}
	
	var tl
	
	//生成粒子
	lBinPs(psElm,psObj,psNum,elmOrder,function (ps,i) {
		
		
		psObj.psArr[i] = ps
		
		var tl = new TimelineMax()
		onTl(tl,ps,i)
		psObj.timeLineArr[i] = tl
		
		tl.repeat(-1)
		tl.paused(true)
		//console.log(tl)
		
		if(random==true)
		{
			tl.progress(Math.random())
		}else if(random==false){
			tl.progress(1/psNum*i)
		}
		
	})
	
	psObj.timeLineArr[0].progress(0.5)
	psObj.timeLineArr[0].progress(0)
	
	lTlArrCtrl(psObj)

	return psObj
}
/**
 * 波浪效果
 * 
用法：
	var lw=lWaveEf(imgPath+"ass027.png",p2,0,441,640,63,5,true,function (tl,img,i) {
		//console.log(i);
		
		tl.to(img,1.0,{x:0,y:40,ease:Power1.easeInOut})
		tl.to(img,1.0,{x:0,y:0,ease:Power1.easeInOut})
	})

其他方法属性同psef

 * 
 * @param {Object} imgSrc	路径
 * @param {Object} p	父级
 * @param {Object} x	x
 * @param {Object} y	y
 * @param {Object} imgW	图片宽
 * @param {Object} imgH	图片高
 * @param {Object} pNum	切片数量
 * @param {Object} horizontal	横向
 * @param {Object} onTl	当tl时
 */
function lWaveEf (imgSrc,p,x,y,imgW,imgH,pNum,horizontal,onTl) 
{
	if(horizontal==undefined) horizontal=true
	var tDiv=lDiv(p,x,y)
	var img = lImg(undefined,undefined,0,0)
	img.crossOrigin = '';
	img.src=imgSrc
	
	img.addEventListener("load",onCom)
	
	//计算每段的长度
	var yu=imgW%pNum
	var twArr=[]
	var cvsArr=[]
	for (var i = 0; i < pNum; i++) {
		if(horizontal==true)
		{
			twArr[i]=parseInt(imgW/pNum)
		}else{
			twArr[i]=parseInt(imgH/pNum)
		}
		
	}
	for (var i = 0; i < yu; i++) {
		twArr[i%pNum]+=1
	}
	
	//console.log(twArr);
	
	var curN=0
	function onCom (e) {
		img.removeEventListener("load",onCom)
		//console.log(e);
		//drawImage
		curN=0
		for (var i = 0; i < twArr.length; i++) {
			if(horizontal==true)
			{
				cvsArr[i].c2d.drawImage(img, -curN, 0, imgW, imgH)
			}else{
				cvsArr[i].c2d.drawImage(img, 0, -curN, imgW, imgH)
			}

			curN+=twArr[i]
		}
	}
	
	//生成cvs
	for (var i = 0; i < twArr.length; i++) {
		if(horizontal==true)
		{
			cvsArr[i]=lCreateElm("canvas",tDiv,curN,0)
			cvsArr[i].width=twArr[i]
			cvsArr[i].height=imgH
			cvsArr[i].c2d = cvsArr[i].getContext("2d")
			//cvsArr[i].c2d.drawImage(img, -curN, 0, imgW, imgH)
		}else{
			cvsArr[i]=lCreateElm("canvas",tDiv,0,curN)
			cvsArr[i].height=twArr[i]
			cvsArr[i].width=imgW
			cvsArr[i].c2d = cvsArr[i].getContext("2d")
			//cvsArr[i].c2d.drawImage(img, 0, -curN, imgW, imgH)
		}
		cvsArr[i].tid=i
		TweenMax.to(cvsArr[i],0,{force3D:true})
		
		curN+=twArr[i]
	}
	
	if(horizontal==true)
	{
		cvsArr.push(lDiv(tDiv,curN,0))
	}else{
		cvsArr.push(lDiv(tDiv,0,curN))
	}
	
	
	
	//复制控制方法
	var ctrlObj = lPsEfByLayout(cvsArr,onTl)
	//console.log(ctrlObj);
	for (var pName in ctrlObj) 
	{
		//console.log(pName);
		tDiv[pName] = ctrlObj[pName]
	}
	tDiv.ctrlObj = ctrlObj
	
	//监听updata，改变skewY
	var gsT1
	var gsT2
	var tR
	var tp1
	var tp2
	var tScale
	
	for (var i = 0; i < tDiv.timeLineArr.length; i++) {
		
		if(ctrlObj.timeLineArr[i+1]!=undefined)
		{
			ctrlObj.timeLineArr[i+1].tid=i
			//console.log(cvsArr[i],cvsArr[i+1],i);
			
			ctrlObj.timeLineArr[i+1].eventCallback("onUpdate",function () {
				var ti=this.tid
				//console.log("this",this.tid)
				
				gsT1=cvsArr[ti]._gsTransform
				gsT2=cvsArr[ti+1]._gsTransform
				
				tp1=lPoint(cvsArr[ti].offsetLeft+gsT1.x,cvsArr[ti].offsetTop+gsT1.y)
				tp2=lPoint(cvsArr[ti+1].offsetLeft+gsT2.x,cvsArr[ti+1].offsetTop+gsT2.y)
				
				//TweenMax.to(tdiv1,0,{left:tp1.x,top:tp1.y})
				//TweenMax.to(tdiv2,0,{left:tp2.x,top:tp2.y})
				
				//角度变化
				tR=lVectorToAngleByP(tp1,tp2)
				
				//pc修正宽度(在pc上宽度会差一像素)
				var fixScale=0
				if(lIsMobile()==false)
				{
					fixScale=0.8/twArr[ti]
				}
				
				
				if(horizontal==true)
				{
					tScale = Math.abs((tp2.x-tp1.x)/twArr[ti])
					
					TweenMax.set(cvsArr[ti],{scaleX:tScale+fixScale,skewY:tR,skewType:"simple",transformOrigin:"0% 0%"})
				}else{
					tScale = Math.abs((tp2.y-tp1.y)/twArr[ti])
					TweenMax.set(cvsArr[ti],{scaleY:tScale+fixScale,skewX:-tR+90,skewType:"simple",transformOrigin:"0% 0%"})

				}
				
			})
		}
		
	}
	
	tDiv.ctrlObj.progress(0,1,1)
	
	return tDiv
}

//增加tlArray方法
function lTlArrCtrl (psObj) {
	
	//psObj.timeLineArr=tlArr
	
	psObj.stop=function () {
		psObj.killDelayPlay()
		for (var i = 0; i < psObj.psNum; i++) {
			psObj.timeLineArr[i].stop()
		}
	}
	
	psObj.play=function () {
		psObj.killDelayPlay()
		for (var i = 0; i <  psObj.psNum; i++) {
			if(oneShot)
			{
				psObj.timeLineArr[i].restart()
			}else{
				
				psObj.timeLineArr[i].play()
			}
		}
	}
	
	/**
	 * 调节进度
	 * @param {Object} minTime	最小进度
	 * @param {Object} maxTime	最大进度
	 * @param {Object} distribute 分布,0升序，1降序，2随机
	 */
	psObj.progress=function (minP,maxP,distribute) {
		
		psObj.killDelayPlay()
		
		if(maxP==undefined) maxP=minP
		if(distribute==undefined) distribute=0
		var tCha = (maxP-minP)/ psObj.psNum
		for (var i = 0; i <  psObj.psNum; i++) {
			
			if(distribute==0)
			{
				//console.log(minP+1-tCha*i);
				psObj.timeLineArr[i].progress(minP+tCha*i)
				//console.log(lRandomRange(minTime,maxTime));
				//psObj.timeLineArr[i].progress(0)
			}else if(distribute==1){
				psObj.timeLineArr[i].progress(minP+1-tCha*i)
			}else if(distribute==2){
				psObj.timeLineArr[i].progress(lRandomRange(minP,maxP))
			}
		}
	}
	
	/**
	 * 延迟播放
	 * @param {Object} minTime	最小时间
	 * @param {Object} maxTime	最大时间
	 * @param {Object} randomDistribute	随机分布，默认true
	 */
	psObj.delayPlay=function (minTime,maxTime,randomDistribute) {
		if(randomDistribute==undefined) randomDistribute=true
		var tCha = (maxTime-minTime)/ psObj.psNum
		for (var i = 0; i <  psObj.psNum; i++) {
			if(randomDistribute)
			{
				//console.log(111);
				TweenMax.delayedCall(lRandomRange(minTime,maxTime),onPlay,[i])
			}else{
				//console.log(222);
				TweenMax.delayedCall(minTime+i*tCha,onPlay,[i])
			}
			
		}
	}
	
	var oneShot=false
	/**
	 * 一次同时播放
	 */
	psObj.setOneShot =function () {
		psObj.progress(0,0)//都从头播放
		oneShot=true
		
		for (var i = 0; i <  psObj.psNum; i++) {
			psObj.timeLineArr[i].repeat(0)//不重复播放
		}
	}
	
	function onPlay (n) {
		//console.log("ff",n);
		psObj.timeLineArr[n].play()
	}
	
	psObj.killDelayPlay=function () {
		TweenMax.killDelayedCallsTo(onPlay)//删除延迟播放
	}
	
	//psObj.progress(0,1,random)
	
	return psObj
}

/**
 * 生成粒子
 * 
用法：
	var psArr=lBinPs(imgPath+"ass17.png",p1,20,false,function (ps,i) {
		
	})
 * 
 * @param {Object} psElm	粒子图片或div，可传入数组。如果是数组则随机从该数组中选一个。
 * @param {Object} p	父级
 * @param {Number} psNum	粒子数
 * @param {Boolean} elmOrderRandom	对象采取规则，true则随机取样，false则顺序取样。默认false
 * @param {Function} onBinPs	当粒子生成时
 */
function lBinPs (psElm,p,psNum,elmOrderRandom,onBinPs) 
{
	var curPsElmNum=0
	var tl
	var ps
	
	var psArr=[]
	for (var i = 0; i < psNum; i++) {
		
		if(lTyepof(psElm)=="Array")
		{
			
			if(elmOrderRandom)
			{
				//随机取样
				ps = lRandomOne(psElm);
			}else{
				//顺序取样
				ps = psElm[curPsElmNum]
				curPsElmNum++
				if(curPsElmNum>=psElm.length)
				{
					curPsElmNum=0
				}
			}
			

		}else{
			ps =psElm;
		}
		//console.log(ps);
		
		if(lTyepof(ps)=="String")
		{
			//是图片地址
			ps = lImg(ps)
		}else{
			
			//console.log(ps);
			if(ps.tSrc!=undefined)
			{
				
				ps.src=ps.tSrc
				//console.log(ps.src);
			}
			
			//是对象
			lRemoveChild(ps)
			ps = ps.cloneNode(true)//深度复制limg的时候会有问题，limg在加载时并没有src属性
			
		}
		
		if(p!=undefined) p.appendChild(ps)
		psArr.push(ps)
		
		if(onBinPs!=undefined)
		{
			onBinPs(ps,i)
		}
		
	}
	
	return psArr
}

/**
 * 闪烁动画
用法：

	var tAni = lTwinkleAni(function (num,t) {
		if(num==0)
		{
			//效果1
			
		}else if(num==1){
			//效果2
		}
	},2,1,-1)
	
	tAni.play()
	
方法：
play()
stop()

 * 
 * @param {Function} f1	效果1
 * @param {Number} 帧数量
 * @param {Number} time	时间
 * @param {Number} repeat	重复次数，默认为-1
 */
function lTwinkleAni (f1,num,time,repeat) {
	
	if(num==undefined) num=1
	if(repeat==undefined) repeat=-1
	if(time==undefined) time=1/10
	
	var tObj={}
	var twinkleAniObj={}
	twinkleAniObj.curNum=0
	twinkleAniObj.repeatNum=0
	twinkleAniObj.Tween = TweenMax.to(tObj,time,{onRepeat:onStart,repeat:-1})
	twinkleAniObj.Tween.pause()
	
	function onStart () {
		//console.log(twinkleAniObj.repeatNum<repeat,twinkleAniObj.repeatNum,repeat);
		if(twinkleAniObj.repeatNum<repeat || repeat==-1)
		{
			f1(twinkleAniObj.curNum,twinkleAniObj.repeatNum)
			twinkleAniObj.repeatNum++
			twinkleAniObj.curNum++
			if(twinkleAniObj.curNum>=num)
			{
				twinkleAniObj.curNum=0
			}
		}else{
			twinkleAniObj.stop()
		}
	}
	
	twinkleAniObj.play = function () {
		twinkleAniObj.stop()
		twinkleAniObj.Tween.play()
		onStart()
	}
	twinkleAniObj.stop = function () {
		twinkleAniObj.curNum=0
		twinkleAniObj.repeatNum=0
		twinkleAniObj.Tween.pause()
	}
	
	return twinkleAniObj
}

/**
 * 给对象加边框以增加点击范围
 * @param {Object} target
 * @param {Number} num	外围区域大小,默认为50px
 */
function lAddClickArea(target,num)
{
	target.style.pointerEvents=""
	if(num==undefined)	num=50;
	lAddBorder (target,num,"rgba(255,0,0,0)","solid")
}

/**
 * 在不改变对象位置，并添加边框
 * @param {Object} target	对象
 * @param {Number} num	粗细
 * @param {String} color	颜色
 * @param {String} style	类型
 */
function lAddBorder (target,num,color,style) {
	if(style==undefined) style = "solid"
	if(color==undefined) color = "#ff0000"
	
	//if(target.oLeft==undefined) lSaveOPoint(target)
	target.style.left = target.oLeft-num+"px"
	target.style.top = target.oTop-num+"px"
	TweenMax.to(target,0,{left:"-="+num,top:"-="+num})
	
	target.style.border=num+"px"+" "+style+" "+color;
	
}

/**
 * 将对象发送到底层
 * @param {Object} target
 */
function lSendToBottom (target) {
	//document.body.insertBefore(shareImg,document.body.childNodes[0])
	try{
		target.parentNode.insertBefore(target,target.parentNode.childNodes[0])
	}catch(e){
	}
	
}

/**
 * 将对象发送到顶层
 * @param {Object} target
 */
function lSendToTop (target) {
	//document.body.insertBefore(shareImg,document.body.childNodes[0])
	try{
		target.parentNode.appendChild(target)
	}catch(e){
	}
}

/**
 * 插入到对象后
 * @param {Object} target	要插入的对象
 * @param {Object} t2	目标对象
 */
function lInsertBefore (target,t2) {
	try{
		t2.parentNode.appendChild(target)
		t2.parentNode.insertBefore(target,t2)
	}catch(e){
	}
}

/**
 * 插入到对象前
 * @param {Object} target	要插入的对象
 * @param {Object} t2	目标对象
 */
function lInsertAfter (target,t2) 
{
	$(target).insertAfter(t2)
}

/**
 * 循环背景
用法：
	var loopObj=lLoopObj(imgPath+"ass01.png",p1,0,0,640,100)
	
	var loopObjEf = lTweenMaxEf(function () {
		loopObj.setPoint(loopObj.curX+1,0)
	})
	loopObjEf.start()

属性：
setPoint(x,y)	设置位置

方法：
curX	当前x
curY	当前y
modX	当前x（经过模计算）
modY	当前y（经过模计算）

 * 
 * @param {String} loopImgUrl	循环图片地址
 * @param {Object} parent	父级
 * @param {Number} left
 * @param {Number} top
 * @param {Number} width
 * @param {Number} height
 */
function lLoopObj (loopImgUrl,parent,left,top,width,height) 
{
	var bImg = lImg(loopImgUrl)
	var imgW
	var imgH
	var loopNw
	var loopNh

	bImg.addEventListener("load",function() {
		
		imgW=bImg.width;
		imgH=bImg.height;
		loopNw = Math.ceil(width/imgW)+1
		loopNh = Math.ceil(height/imgH)+1
		
		loopImg.style.width=lCheckUnit(imgW*loopNw)
		loopImg.style.height=lCheckUnit(imgH*loopNh)
		
		if(loopDiv.curX!=undefined)
		{
			loopDiv.setPoint(loopDiv.curX,loopDiv.curY)
		}
	})
	
	var loopDiv = lDiv(parent,left,top,width,height)
	loopDiv.style.overflow="hidden"
	
	var loopImg = lDiv(loopDiv,0,0,100,100)
	loopImg.style.background="url("+loopImgUrl+")"
	
	loopDiv.setSrc=function (src) {
		bImg.src = src
		loopImg.style.background="url("+src+")"
	}
	
	loopDiv.curX=0
	loopDiv.curY=0
	loopDiv.modX=0
	loopDiv.modY=0
	
	//设置循环点
	loopDiv.setPoint = function (x,y) {
		
		loopDiv.curX = x
		loopDiv.curY = y
		
		if(imgW!=undefined)
		{
			if(x>=0)
			{
				x=x%imgW-imgW
			}else{
				x=x%imgW
			}
			
			if(y>=0)
			{
				y=y%imgH-imgH
			}else{
				y=y%imgH
			}
			
			TweenMax.to(loopImg,0,{x:x,y:y,rotationZ:0.001})
		}
		loopDiv.modX = x
		loopDiv.modY = y
		//console.log(loopDiv.curX,loopDiv.curY);
	}
	
	return loopDiv
}

/**
 * 删除对象内所有的子集，并停止TweenMax动画
 * @param {Object} target
 */
function lEmpty (target) {
	if(target!=undefined)
	{
		TweenMax.killChildTweensOf(target)
		
		var tLength = target.childNodes.length
		for (var i = 0; i < tLength; i++) {
			$(target.childNodes[0]).remove()
		}
		
		$(target).empty()
	}
}

/**
 * 删除对象内所有的子集
 * @param {Object} target
 */
function lRemoveAllChild (target) {
	var tLength = target.childNodes.length
	for (var i = 0; i < tLength; i++) {
		target.removeChild(target.childNodes[0])
	}
}

/**
 * 删除对象内所有的子集
 * @param {Object} target
 */
function lRemoveChild (target) {
	if(target.parentNode!=undefined)
	{
		target.parentNode.removeChild(target)
	}
	
}

/**
 * 轮播图小圆点//需要修改，不应以pWidth宽定义间距
用法：
var lp = lCarouselPoint(gameHelpDiv,0,0,20,2,10,"#ff0000","#ffffff")

属性
curId	当前id

方法：
setCurId()	设置当前id

 * 
 * @param {Object} parent	父级
 * @param {Number} left	x
 * @param {Number} top	y
 * @param {Number} d	间隔
 * @param {Number} pNum	圆点数量
 * @param {Number} pR	圆点半径
 * @param {String} activateColor	激活状态颜色
 * @param {String} deactivateColor	非激活状态颜色
 */
function lCarouselPoint (parent,left,top,d,pNum,pR,activateColor,deactivateColor) 
{
	d+=pR
	if(activateColor==undefined)
	{
		activateColor="#979797"
	}
	if(deactivateColor==undefined)
	{
		deactivateColor="#ffffff"
	}
	
	var lcpObj=lDiv(parent,left,top,0,pR,"rgba(255,0,0,0.5)")
	
	lcpObj.carouselNum = lCountNum(pNum,true,onchange)
	
	lcpObj.pNum = pNum
	lcpObj.pArr=[]
	for (var i = 0; i < pNum; i++) 
	{
		lcpObj.pArr[i] = lDiv(lcpObj,d*i - pNum*d/2+pR/2,0,pR,pR,deactivateColor)
		lcpObj.pArr[i].style.borderRadius="100%"
	}
	
	
	lcpObj.curId=lcpObj.carouselNum.curId
	
	lcpObj.setCurId = lcpObj.carouselNum.setCurId
	
	onchange (0)
	
	function onchange (num) {
		//console.log(111111,num);
		for (var i = 0; i < lcpObj.pNum; i++) 
		{
			if(i==num)
			{
				lcpObj.pArr[i].style.background = activateColor
			}else{
				lcpObj.pArr[i].style.background = deactivateColor
			}
			
		}
	}
	
	return lcpObj
}

/**
 * 淡入淡出效果的轮播图
 * 
 * var ctrlObj = lFadeInOutCarousel(arr1,arr2,0.3,1)
 * 
 * //控制翻页用 ctrlObj.nextPic() 或 ctrlObj.prevPic() 
 * 
 * @param {object} picArr	图片数组
 * @param {object} btnArr	切换圆点按钮数组（需与图片数量相等）
 * @param {number} tweenTime	图片自动变换时间
 * @param {number} autoPlayTime	图片自动播放时间 -1为不自动轮播
 */
function lFadeInOutCarousel (picArr,btnArr,tweenTime,autoPlayTime) 
{
	if(tweenTime==undefined) tweenTime=1
	if(autoPlayTime==undefined) autoPlayTime=3

	var ctrlObj={}
	ctrlObj.curId=0
	ctrlObj.totalNum=picArr.length;
	var i
	
	//点鼠标效果
	ctrlObj.btnOver = function (e,time) 
	{
		if(time==undefined) time=0
		var target = e.target
		var id = btnArr.indexOf(target)
		if(target!=undefined)
		{
			TweenMax.to(target,time,{autoAlpha:1})
		}
	}
	ctrlObj.btnOut = function (e,time) 
	{
		if(time==undefined) time=0
		var target = e.target
		var id = btnArr.indexOf(target)
		//当前项不能变灰
		if(ctrlObj.curId!=id)
		{
			if(target!=undefined)
			{
				TweenMax.to(target,time,{autoAlpha:0.7})
			}
			
		}
	}
	ctrlObj.btnClick = function (e) 
	{
		
		var target = e.target
		var id = btnArr.indexOf(target)
		ctrlObj.shwoPic(id,tweenTime/2)
		
		clearInterval(ctrlObj.intervalNum)
		ctrlObj.intervalNum = setInterval(ctrlObj.nextPic,autoPlayTime*1000)
	}
	
	for (i = 0; i < picArr.length; i++) 
	{
		if(i==ctrlObj.curId)
		{
			TweenMax.set(picArr[i],{autoAlpha:1})
		}else{
			TweenMax.set(picArr[i],{autoAlpha:0})
		}
		
		if(btnArr !=undefined && btnArr[i]!=undefined)
		{
			btnArr[i].style.cursor="pointer";
			
			$(btnArr[i]).mouseover(ctrlObj.btnOver)
			$(btnArr[i]).mouseout(ctrlObj.btnOut)
			$(btnArr[i]).click(ctrlObj.btnClick)
			
			ctrlObj.btnOut({target:btnArr[i]})
		}

	}
	
	
	//下一张图片
	ctrlObj.nextPic = function () 
	{
		ctrlObj.curId+=1;
		if(ctrlObj.curId>=ctrlObj.totalNum)
		{
			ctrlObj.curId=0
		}
		
		ctrlObj.shwoPic(ctrlObj.curId);
		
	}
	
	//上一张图片
	ctrlObj.prevPic = function () 
	{
		ctrlObj.curId-=1;
		if(ctrlObj.curId<0)
		{
			ctrlObj.curId=ctrlObj.totalNum
		}
		
		ctrlObj.shwoPic(ctrlObj.curId);
		
	}
	
	//显示图片
	ctrlObj.shwoPic = function (id,time) 
	{
		if(time==undefined) time = tweenTime;
		id = Math.min(picArr.length-1,id)
		id = Math.max(0,id)
		
		for (i = 0; i < picArr.length; i++) 
		{
			if(i==id)
			{
				TweenMax.to(picArr[i],time,{overwrite:true,autoAlpha:1})
			}else{
				TweenMax.to(picArr[i],time,{overwrite:true,autoAlpha:0})
			}
			
		}
		
		ctrlObj.curId=id;
		
		//更新点效果
		
		for (i = 0; i < picArr.length; i++) {
			if(btnArr !=undefined && btnArr[i]!=undefined)
			{
				ctrlObj.btnOut({target:btnArr[i]})
			}
			
		}
		
		if(btnArr !=undefined && btnArr[id]!=undefined)
		{
			ctrlObj.btnOver({target:btnArr[id]})
		}
		
	}
	
	//TweenMax.delayedCall(3,ctrlObj.nextPic)
	if(autoPlayTime!=-1)
	{
		ctrlObj.intervalNum = setInterval(ctrlObj.nextPic,autoPlayTime*1000)
	}
	
	
	return ctrlObj
}

/**
 * 根据对象的z轴排序
 * @param {object} targetArr	对象数组
 * @param {number} startZIndex	起始zIndex
 */
function lZindex(targetArr,startZIndex) 
{
	var newArr = targetArr.slice(0)
	if(startZIndex==undefined) startZIndex=1
	
	newArr.sort(onSortFun)
	
	//从小到大排序
	function onSortFun(a, b) 
	{
		var v1 = lReadZ(a)
		var v2 = lReadZ(b)
	
		if (v1 > v2) {
			return 1
		} else if (v1 < v2) {
			return -1
		} else {
			return 0
		}
	}
	for (i = 0; i < newArr.length; i++) 
	{
		newArr[i].style.zIndex=startZIndex+i;
	}
}

/**
 * 创建按钮
 * @param {string} text		文本
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {number} width	width值
 * @param {number} height	height值
 */
function lSysBtn (text,parent,left,top,width,height) {
	var btn = lCreateElm("button",parent,left,top,width,height)
	btn.innerHTML=text
	return btn
}

/**
 * 全屏对象，用户弹窗浮层等。对象会根据屏幕大小和contentDiv的宽高自动居中
 * 
属性：
bgDiv	背景div
contentDiv	内容div

方法：
resize	对齐

用法：
var lFs = lFullscreenObj()
lFs.bgDiv//背景div
//内容div
lFs.contentDiv.style.width=400+"px"
lFs.contentDiv.style.height=200+"px"
lFs.contentDiv.style.background="rgba(255,0,0,0.3)"
lFs.resize()
 * 
 * @param {number} scale	缩放方式,scale小于100时直接按照scale缩放，大于100时按照屏幕宽度计算比例
 * @param {string} bgColor	背景色
 * @param {number} opacity	背景透明度
 * @param {boolean} offset	将内容div位置稍稍偏上，符合视觉习惯
 */
function lFullscreenObj (scale,bgColor,opacity,offset) {
	
	//主div
	var mainDiv = lDiv(document.body,0,0,0,0)
	mainDiv.style.width="100%"
	mainDiv.style.height="100%"
	mainDiv.style.position="fixed";
	
	if(bgColor==undefined)
	{
		bgColor="#000000"
	}
	if(opacity==undefined)
	{
		opacity=0.46
	}
	
	//背景
	var bgDiv = lDiv(mainDiv,0,0,0,0,bgColor)
	bgDiv.style.width=lWindowRect().width+"px"
	bgDiv.style.height=lWindowRect().height+"px"
	$(bgDiv).css("opacity",opacity)
	
	mainDiv.bgDiv=bgDiv
	
	//内容框
	var contentDiv = lDiv(mainDiv)
	mainDiv.contentDiv=contentDiv
	
	//对齐居中
	mainDiv.resize=function () 
	{
		
		if(scale==undefined)
		{
			scale=640
		}
		
		if(scale>100)
		{
			mainDiv.tScale=lWindowRect().width/scale
		}else{
			mainDiv.tScale=scale
		}
		
		//缩放
		TweenMax.set(mainDiv.contentDiv,{scale:mainDiv.tScale})
		
		//对齐
		lAlign(mainDiv.contentDiv,mainDiv.contentDiv.offsetWidth,mainDiv.contentDiv.offsetHeight,lWindowRect(),5,5)
		
		if(offset==undefined || offset==true)
		{
			mainDiv.contentDiv.style.top = (mainDiv.contentDiv.offsetTop*0.833)+"px"
		}
		
		//背景
		bgDiv.style.width=lWindowRect().width+"px"
		bgDiv.style.height=lWindowRect().height+"px"
		
	}
	mainDiv.resize()
	$(window).resize(mainDiv.resize)
	
	return mainDiv
}

/**
 * 创建下拉
 * @param {object} opArr	选项
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {number} width	width值
 * @param {number} height	height值
 * @param {number} fontSize	字号
 * @param {color} color	颜色
 * @param {string} fontFamily	字体默认为"Microsoft YaHei,宋体"
 */
function lSelect(opArr,parent,left,top,width,height,fontSize,color,fontFamily)
{
	var select = lCreateElm("select",parent,left,top,width,height)
	
	select.setOption=function (opArr) {
		select.options.length=0
		
		for (var i = 0; i < opArr.length; i++) {
			select.options.add(new Option(opArr[i],i))
		}
	}
	if(opArr!=undefined)
	{
		select.setOption(opArr)
	}
	
	
	
	if(fontSize!=undefined)
	{
		//lLog(fontSize)
		select.style.fontSize = fontSize+"px";
	}else{
		select.style.fontSize = 12+"px";
	}
	if(color!=undefined)
	{
		select.style.color = color;
	}else{
		select.style.color = "#000000";
	}
	
	if(fontFamily!=undefined)
	{
		select.style.fontFamily = fontFamily;
	}else{
		select.style.fontFamily = "Microsoft YaHei,宋体";
	}
	
	//读取本地存储
	select.loadLS = function (localStName) 
	{
		if(window.localStorage)
		{
			if(window.localStorage[localStName]!=undefined)
			{
				select.selectedIndex = window.localStorage[localStName]
			}
		}
	}
	
	//保存并更改本地存储
	select.saveLS = function (localStName) 
	{
		if(window.localStorage)
		{
			window.localStorage[localStName] = select.selectedIndex
		}
	}
	
	return select
}
/**
 * 创建输入文本
 * @param {string} text		文本
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {string} type	类型 类型参考：http://www.w3school.com.cn/html5/att_input_type.asp
 * @param {number} fontSize	字号
 * @param {color} color	颜色
 * @param {string} fontFamily	字体默认为"Microsoft YaHei,宋体"
 */
function lTextarea (text,parent,left,top,type,fontSize,color,fontFamily) 
{
	
	var input = lCreateElm("textarea",parent,left,top)
	
	if(type!=undefined)
	{
		input.type = type
	}
	
	input.value=text;
	
	//读取本地存储
	input.loadLS = function (localStName) 
	{
		if(window.localStorage)
		{
			if(window.localStorage[localStName]!=undefined)
			{
				input.value = window.localStorage[localStName]
			}
		}
	}
	
	//保存并更改本地存储
	input.saveLS = function (localStName) 
	{
		if(window.localStorage)
		{
			window.localStorage[localStName] = input.value
		}
	}
	
	if(fontSize!=undefined)
	{
		//lLog(fontSize)
		input.style.fontSize = fontSize+"px";
	}else{
		input.style.fontSize = 12+"px";
	}
	if(color!=undefined)
	{
		input.style.color = color;
	}else{
		input.style.color = "#000000";
	}
	
	if(fontFamily!=undefined)
	{
		input.style.fontFamily = fontFamily;
	}else{
		input.style.fontFamily = "Microsoft YaHei,宋体";
	}
	
	
	return input
}

/**
 * 创建输入文本
 * @param {string} text		文本
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {string} type	类型 类型参考：http://www.w3school.com.cn/html5/att_input_type.asp
 * @param {number} fontSize	字号
 * @param {color} color	颜色
 * @param {string} fontFamily	字体默认为"Microsoft YaHei,宋体"
 */
function lInput (text,parent,left,top,type,fontSize,color,fontFamily) {
	var input = lCreateElm("input",parent,left,top)
	
	if(type!=undefined)
	{
		input.type = type
	}
	
	input.value=text;
	
	input.style.border="none"
	input.style.background="none"
	TweenMax.to(input,0,{force3D:true})
	
	//读取本地存储
	input.loadLS = function (localStName) 
	{
		if(window.localStorage)
		{
			if(window.localStorage[localStName]!=undefined)
			{
				input.value = window.localStorage[localStName]
			}
		}
	}
	
	//保存并更改本地存储
	input.saveLS = function (localStName) 
	{
		if(window.localStorage)
		{
			window.localStorage[localStName] = input.value
		}
	}
	
	if(fontSize!=undefined)
	{
		//lLog(fontSize)
		input.style.fontSize = fontSize+"px";
	}else{
		input.style.fontSize = 12+"px";
	}
	if(color!=undefined)
	{
		input.style.color = color;
	}else{
		input.style.color = "#000000";
	}
	
	if(fontFamily!=undefined)
	{
		input.style.fontFamily = fontFamily;
	}else{
		input.style.fontFamily = "Microsoft YaHei,宋体";
	}
	
	input.iosPFix=function (left,top) {
		if(left==undefined) left=15
		if(top==undefined) top=5
		
		if(lIsIos())
		{
			TweenMax.to(input,0,{top:"-="+top,left:"-="+left})
		}
	}
	
	return input
}

/**
 *
方法：
setWidthAndAlign()	设置款并居中

 * 创建文本
 * @param {string} text		文本
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {number} fontSize	字号
 * @param {color} color	颜色
 * @param {string} fontFamily	字体默认为"Microsoft YaHei,宋体"

 */
function lSpan (text,parent,left,top,fontSize,color,fontFamily)
{
	var span = lCreateElm("span",parent,left,top)
	
	span.innerHTML=text;
	
	if(fontSize!=undefined)
	{
		//lLog(fontSize)
		span.style.fontSize = fontSize+"px";
	}else{
		span.style.fontSize = 12+"px";
	}
	if(color!=undefined)
	{
		span.style.color = color;
	}else{
		span.style.color = "#000000";
	}
	
	if(fontFamily!=undefined)
	{
		span.style.fontFamily = fontFamily;
	}else{
		span.style.fontFamily = "Microsoft YaHei,Arial";
	}
	
	span.style.webkitUserSelect="none"
	TweenMax.to(span,0,{force3D:true})
	lSecObj(span)
	
	span.setWidthAndAlign = function (num) {
		if(num==undefined) num=640
		span.style.left = lCheckUnit(0);
		span.style.width = lCheckUnit(num)
		span.style.textAlign="center";
	}
	
	return span
}



/**
 * 限制输入对象的最大字符数，中文为2个字符计算
 * @param {object} parent	父级
 * @param {number} left	left值
 */
function lMaxInputLength (target,maxLength) 
{
	$(target).bind("focusout",function () {
		console.log("focusout")
		target.value = lMaxStrLength(target.value,maxLength)
	})
}

/**
 * 创建elm
 * @param {String} name	标签名
 * @param {Object} parent	父级
 * @param {Number} left
 * @param {Number} top
 * @param {Number} width
 * @param {Number} height
 */
function lCreateElm (name,parent,left,top,width,height) 
{
	if(name)
	{
		
		var elm = document.createElement(name)
		elm.style.position = "absolute";
		if(parent!=undefined) parent.appendChild(elm);
		if(top != undefined) elm.style.top = lCheckUnit(top)
		if(left != undefined) elm.style.left = lCheckUnit(left)
		if(width != undefined) elm.style.width = lCheckUnit(width)
		if(height != undefined) elm.style.height = lCheckUnit(height)
		
		return elm
	}
}


function lCanvas (parent,left,top,width,height) {
	var canvas = document.createElement("canvas")
	canvas.style.position = "absolute";
	if(parent!=undefined) parent.appendChild(canvas);
	if(top != undefined) canvas.style.top = lCheckUnit(top)
	if(left != undefined) canvas.style.left = lCheckUnit(left)
	if(width != undefined) canvas.width = width
	if(height != undefined) canvas.height = height
	
	TweenMax.to(canvas,0,{force3D:true})
	
	//context2d
	canvas.c2d = canvas.getContext("2d")
	return canvas
}

/**
 * 创建div
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {number} width	width值
 * @param {number} height	height值
 * @param {string} background 背景色
 * @param {opacity} opacity	height值
 * @return {HTMLDivElement}	返回Div
 */
function lDiv(parent,left,top,width,height,background,opacity)
{
	var div = lCreateElm("div",parent,left,top,width,height)
	
	if(background != undefined) div.style.background= background;
	if(opacity != undefined) $(div).css({opacity:opacity});
	
	//div.style.webkitUserSelect="none"

	div.style.webkitUserDrag="none"
	div.style.position="absolute"
	div.style.overflow="hidden"


	TweenMax.to(div,0,{force3D:true})
	lSecObj (div)
	
	return div;
}

var lImgLoaderInfo=new Object();
lImgLoaderInfo.asyn=true
lImgLoaderInfo.crossOrigin//当等于true时设置跨域
lImgLoaderInfo.lAllImgArr=[]//所有用lNewImage创建的img
lImgLoaderInfo.lAllImgSrcArr=[]//所有用lNewImage创建的img路径
lImgLoaderInfo.waitArr=[]//等待加载
lImgLoaderInfo.percentage//当前百分比
lImgLoaderInfo.totalNum=lImgLoaderInfo.lAllImgArr.length;//图片总数量
lImgLoaderInfo.curNum=0//加载完毕数
lImgLoaderInfo.onLoad//单个加载完成时触发
lImgLoaderInfo.onAllComplete//全部加载完成
lImgLoaderInfo.threading=3//线程。避免开始时卡死
lImgLoaderInfo.curThreading=lImgLoaderInfo.threading//剩余线程
lImgLoaderInfo.onEf=function () {
	var loadingNum=0
	for (var i = 0; i < lImgLoaderInfo.checkArr.length; i++) {
		if(lImgLoaderInfo.checkArr[i].complete==true&&lImgLoaderInfo.checkArr[i].src!="")
		{
			lImgLoaderInfo.checkArr.splice(i,1)
			i--
			loadingNum++
		}
	}
	
	lImgLoaderInfo.curNum+=loadingNum;
	lImgLoaderInfo.percentage = lImgLoaderInfo.curNum/lImgLoaderInfo.totalNum
	
	//console.log(lImgLoaderInfo.curNum,lImgLoaderInfo.totalNum,lImgLoaderInfo.percentage,loadingNum)
	if(loadingNum!=0)
	{
		
		if(lImgLoaderInfo.onLoad!=undefined)
		{
			lImgLoaderInfo.onLoad(lImgLoaderInfo.percentage,lImgLoaderInfo.curNum)
		}
	}
	
	if(lImgLoaderInfo.percentage==1 && lImgLoaderInfo.onAllComplete!=undefined)
	{
		lImgLoaderInfo.onAllComplete()
	}
	if(lImgLoaderInfo.percentage==1)
	{
		lImgLoaderInfo.loadingEf.stop()
	}
	
	lImgLoaderInfo.curThreading+=loadingNum
	
	//console.log("调用check")
	lImgLoaderInfo.checkWait()
}
lImgLoaderInfo.loadingEf=lTweenMaxEf(lImgLoaderInfo.onEf)
lImgLoaderInfo.checkArr=[]

//检查等待队列
lImgLoaderInfo.checkWait = function () {
	//console.log(lImgLoaderInfo.waitArr[0]);
	//检查等待的图片序列
	//console.log(lImgLoaderInfo.curThreading);
	var Tlength=lImgLoaderInfo.curThreading
	for (var i = 0; i < Tlength; i++) {
		//console.log(lImgLoaderInfo.curThreading);
		if(lImgLoaderInfo.curThreading>0)
		{
			if(lImgLoaderInfo.waitArr[0]!=undefined)
			{
				
				var tid = lImgLoaderInfo.waitArr[0]
				var tImg = lImgLoaderInfo.lAllImgArr[tid]
				if(tImg.src=="")
				{
					//如果该图片未被重新指定则开始加载
					//console.log("checkWait开始加载",tid,lImgLoaderInfo.lAllImgSrcArr[tid]);
					
					lImgLoaderInfo.waitArr.shift()
					tImg.src = lImgLoaderInfo.lAllImgSrcArr[tid]
					
					lImgLoaderInfo.checkArr.push(tImg)
					
					lImgLoaderInfo.curThreading--
					
					//if(tImg.complete==true) $(tImg).trigger("load");
					
				}else{
					//如果图片被重新指定了地址则从等待数组中删除
					//console.log("checkWait被重新指定了地址,跳过",tid,"原地址：",lImgLoaderInfo.lAllImgSrcArr[tid]);
					lImgLoaderInfo.waitArr.shift()
					lImgLoaderInfo.checkWait()
					lImgLoaderInfo.curNum++
				}
			}
		}
	}
}

/**
 * 创建图片
 * @param {string} src	图片路径
 * @param {object} parent	父级
 * @param {number} left	left值
 * @param {number} top	top值
 * @param {number} width	width值
 * @param {number} height	height值
 * @param {Boolean} crossOrigin	crossOrigin跨域
 * @return {object}	返回图片
 */
function lImg(src,parent,left,top,width,height,crossOrigin)
{
	//console.log("limg",src);
	//var img = document.createElement("img")
	var img = lCreateElm("img",parent,left,top,width,height)

	if(crossOrigin==true || lImgLoaderInfo.crossOrigin==true) img.crossOrigin = '';
	
	//解决iphone6和6plus图层错乱问题
	TweenMax.to(img,0,{force3D:true})
	
	img.style.webkitUserSelect="none"
	img.style.webkitUserDrag="none"
	img.style.pointerEvents="none"
	img.style.position="absolute"
	
	if(lIsFirefox()==false)
	{
		img.draggable=false//禁止拖动
	}
	
	img.style.MozUserSelect="none"
	
	
	if(src)
	{
		if(lImgLoaderInfo.asyn==true)
		{
			lImgLoaderInfo.loadingEf.start()
			
			lImgLoaderInfo.lAllImgArr.push(img)
			lImgLoaderInfo.lAllImgSrcArr.push(src)
			lImgLoaderInfo.totalNum = lImgLoaderInfo.lAllImgArr.length;
			
			
			img.tSrc=src
			//console.log(img.tSrc);
			
			//有空余线程立即加载
			if(lImgLoaderInfo.curThreading>0)
			{
				//console.log(lImgLoaderInfo.curThreading);
				//console.log("开始加载",src);
				//$(img).bind("load",lImgLoaderInfo.lOnOneComplete)
				//$(img).bind("error",lImgLoaderInfo.onError)
				img.src=src
				lImgLoaderInfo.checkArr.push(img)
				lImgLoaderInfo.curThreading--
				//console.log(img.complete);
				//if(img.complete==true) $(img).trigger("load");
				
			}else{
				//没有线程空余则加入等待队列
				lImgLoaderInfo.waitArr.push(lImgLoaderInfo.totalNum-1)
			}
		}else{
			img.src=src
		}
	}
		


	lSecObj (img)
	return img;
}

/**
 * 按百分比定位
 */
function lImgP (src,parent,left,top,width,height,opacity) 
{
	var target = lImg(src,parent,lpW(left),undefined,lpW(width),height,opacity)
	target.style.marginTop = lpW(top)
	return target
}

/**
 * 声音
 * @param {String} url	链接
 * @param {Boolean} autoPlay	自动播放
 * @param {Boolean} loop	循环
 * @param {Function} onPlay	当播放时
 * @param {Function} onPause	当暂停时
 * @param {Function} onEnded	当结束时
 * 
 * 
 */
function lAudio (url,autoPlay,loop,onPlay,onPause,onEnded) {
	var audio = document.createElement("audio")
	audio.src=url;
	audio.loop=false;
	
	audio.autoplay = autoPlay
	if(onPlay!=undefined) audio.addEventListener("play",onPlay)
	if(onPause!=undefined) audio.addEventListener("pause",onPause)
	audio.addEventListener("ended",function () {
		if(onEnded!=undefined) onEnded()
		
		if(loop)
		{
			audio.play()
		}
	})
	
	audio.restart=function () {
		audio.currentTime=0
		audio.play()
	}
	
	/*
	audio.originalPlay = audio.play
	
	audio.play =function  () 
	{
		$(audio).unbind("play",loadPlay)
		audio.originalPlay()
	}
	
	//调用play来实现加载
	audio.startLoad =function  () 
	{
		$(audio).bind("play",loadPlay)
		audio.originalPlay()
		
	}
	function loadPlay () 
	{
		audio.pause()
	}*/
	
	return audio
}

/**
 * video标签
 * 
 * @param {string} src	视频地址多个地址用“|”隔开
 * @param {object} parent	父级
 * @param {number} x	x
 * @param {number} y	y
 * @param {number} width	宽
 * @param {number} height	高
 * @param {boolean} controls	控件
 */
function lVideo (src,parent,x,y,width,height,controls)
{
	var videoDiv = lDiv(parent,x,y,width,height)
	
	var video = document.createElement("video")
	video.style.position="absolute"
	video.style.background="#ffffff";
	video.autoplay=false
	
	
	
	//ios禁止全屏
	video.setPlaysinline = function () {
		video.setAttribute("webkit-playsinline","true")
	}
	
	videoDiv.appendChild(video)
	
	if(controls==undefined || controls==true)
	{
		video.controls="controls"
	}
	
	if(x!=undefined)
	{
		video.style.left=0+"px";
	}
	if(y!=undefined)
	{
		video.style.top=0+"px";
	}
	if(width!=undefined)
	{
		video.width=width
	}
	if(height!=undefined)
	{
		video.height=height
	}

	/**
	 * 加载新的影片
	 */
	video.setVideoSrc=function (src,type) {
		var i
		if(type==undefined) type="video/mp4"
		
		//清除现有video
		lEmpty(video)
		video.load()
		
		//添加新vidoe
		var srcArr = src.split("|")
		for (i = 0; i < srcArr.length; i++) 
		{
			var videoS = document.createElement("source")
			videoS.src=srcArr[i]
			videoS.type=type
			video.appendChild(videoS)
		}
		
		//安卓机无需调用load()，iphone和pc则需要重新调用load()才能看到新影片
		if(lIsAndroid()==false)
		{
			video.load()
		}
		
	}
	video.div=videoDiv
	if(src!=undefined) video.setVideoSrc(src)
	
	videoDiv.video=video
	
	return videoDiv
}

/**
 * 选项卡
用法：
var secObj = lSec([ass081,ass082,ass083],[endSec1,endSec2,endSec3])
 * 
 * @param {Object} btnArr	按钮数组
 * @param {Object} secArr	对象数组
 * @param {Object} curPageId	初始项
 * @param {Object} openEf	打开ef
 * @param {Object} closeEf	关闭ef
 */
function lSec (btnArr,secArr,curPageId,openEf,closeEf) 
{
	if(curPageId==undefined) curPageId=-1
	var secObj={}
	secObj.curPageId=lNumRange(curPageId,-1,secArr.length-1)
	secObj.lastPageId=undefined
	
	secObj.open=function (num,time) 
	{
		if(time==undefined) time=0.3
		
		if(num!=secObj.curPageId)
		{
			secObj.close(secObj.curPageId)
			
			if(openEf!=undefined)
			{
				openEf(secArr[num],time,num)
			}else{
				TweenMax.to(secArr[num],time,{autoAlpha:1})
			}
			
			secObj.lastPageId = secObj.curPageId
			secObj.curPageId = num
		}
	}
	
	secObj.close=function (num,time) 
	{
		if(time==undefined) time=0.3
		//console.log("close",num);
		if(num!=undefined && num!=-1)
		{
			
			if(closeEf!=undefined)
			{
				closeEf(secArr[num],time,num)
			}else{
				TweenMax.to(secArr[num],time,{autoAlpha:0})
			}
			secObj.curPageId = -1
		}
	}
	
	for (var i = 0; i < secArr.length; i++) 
	{
		secObj.close(i,0)
		$(btnArr[i]).bind("onClick",onClick)
	}
	
	function onClick (e) {
		
		var tid = btnArr.indexOf(e.currentTarget)
		
		//console.log(tid);
		secObj.open(tid)
	}
	
	if(secObj.curPageId!=-1)
	{
		secObj.open(secObj.curPageId)
	}
	
	return secObj
}

var lSecTweenTime=0//默认变换时间
var lSecShowTweenObj={autoAlpha:1}//入场tweenObj
var lSecHideTweenObj={autoAlpha:0}//出场tweenObj
/**
 * 可控显示对象
 * @param {object} target	对象
 * @param {boolean} show	是否显示
 */
function lSecObj (target,show) {
	
	target.isShown=true//显示状态
	
	//显示对象
	target.show=function (time) {
		target.isShown=true
		if(time==undefined) time=lSecTweenTime
		TweenMax.to(target,time,lSecShowTweenObj)
		
		if(target.onShow!=undefined)
		{
			target.onShow()
		}
	}
	
	//隐藏对象
	target.hide=function (time) {
		target.isShown=false
		if(time==undefined) time=lSecTweenTime
		TweenMax.to(target,time,lSecHideTweenObj)
		
		if(target.onHide!=undefined)
		{
			target.onHide()
		}
	}
	
	if(show==false)
	{
		target.hide(0)
	}
	
	//删除lSecObj
	target.removelSecObj=function () 
	{
		delete target.isShown
		delete target.hide
		delete target.show
		delete target.removelSecObj
	}
}


/**
 * 取得屏幕区域,(不含滚动条)
 * @param {Boolean} scrollbar	false时返回浏览器的宽不计算滚动条的宽
 */
function lWindowRect(scrollbar)
{
	var w
	var h
	if(scrollbar==undefined || scrollbar==false )
	{
		//浏览器的宽
		w = window.innerWidth||document.documentElement.clientWidth
		h = window.innerHeight||document.documentElement.clientHeight
	}else{
		//页面的宽（减去滚动条的宽）
		w = document.documentElement.clientWidth
		h = document.documentElement.clientHeight
	}
	return lRect(0,0,w,h)
}

/**
 * 将对象缩放至区域
 * @param {object} target	对象
 * @param {number} tW	对象宽
 * @param {number} tH	对象高
 * @param {object} rectObj	区域对象用 lRect() 或 LUObjToRect() 来生成
 * @param {boolean} noBorder	无边模式
 * @param {string} align	对齐方式 用1-9表示即top：2,left：4,center：5 ,right：6,bottom：8
 */
function lScaleToRect (target,tW,tH,rectObj,noBorder,align)
{
	if(align==undefined) align=5
	
	//变换比例
	var sc = lScaleSc(tW,tH,rectObj.width,rectObj.height,noBorder)
	//变换后的宽高
	var sW = tW*sc
	var sH = tH*sc
	
	//位图
	if(target.constructor == HTMLImageElement)
	{
		target.style.width=(sW)+"px"
		target.style.height=(sH)+"px"
		
		lAlign(target,sW,sH,rectObj,align,align)
	}else{
		//div
		target.style.width=tW+"px"
		target.style.height=tH+"px"
		
		//TweenMax.set(target,{scaleX:sc,scaleY:sc})
		TweenMax.set(target,{scaleX:sc,scaleY:sc,transformOrigin:"top left"})
		
		lAlign(target,sW,sH,rectObj,align,align)
		//target.style.left =  (target.offsetLeft+(sW-tW)/2)+"px"
		//target.style.top =  (target.offsetTop+(sH-tH)/2)+"px"
	}
	
	return sc
}

/**
 * 按宽度缩放对象
 * @param {object} target	对象
 * @param {number} tW	对象宽
 * @param {number} tH	对象高
 * @param {object} rectObj	区域对象用 lRect() 或 LUObjToRect() 来生成
 * @param {string} align	对齐方式 用1-9表示即top：2,left：4,center：5 ,right：6,bottom：8
 */
function lScaleByWidth (target,tW,tH,rectObj,align) 
{
	if(align==undefined) align=5
	var sc = rectObj.width/tW
	var sW = tW*sc
	var sH = tH*sc
	
	//位图
	if(target.constructor == HTMLImageElement)
	{
		//target.style.width=(sW)+"px"
		//target.style.height=(sH)+"px"
		
		lAlign(target,sW,sH,rectObj,align,align)
	}else{
		//div
		//target.style.width=tW+"px"
		//target.style.height=tH+"px"
		
		TweenMax.set(target,{scaleX:sc,scaleY:sc,transformOrigin:"top left"})
		
		lAlign(target,sW,sH,rectObj,align,align)
	}
	return sc
}

/**
 * 按高度缩放对象
 * @param {object} target	对象
 * @param {number} tW	对象宽
 * @param {number} tH	对象高
 * @param {object} rectObj	区域对象用 lRect() 或 LUObjToRect() 来生成
 * @param {string} align	对齐方式 用1-9表示即top：2,left：4,center：5 ,right：6,bottom：8
 */
function lScaleByHeight (target,tW,tH,rectObj,align) 
{
	if(align==undefined) align=5
	var sc = rectObj.height/tH
	var sW = tW*sc
	var sH = tH*sc
	
	//位图
	if(target.constructor == HTMLImageElement)
	{
		target.style.width=(sW)+"px"
		target.style.height=(sH)+"px"
		lAlign(target,sW,sH,rectObj,align,align)
	}else{
		//div
		target.style.width=tW+"px"
		target.style.height=tH+"px"
		
		TweenMax.set(target,{scaleX:sc,scaleY:sc,transformOrigin:"top left"})
		
		lAlign(target,sW,sH,rectObj,align,align)
	}
	return sc
}

/**
 * 取得在对象上的9点位置
 * @param {object} rectObj	对象区域
 * @param {number} pointType	点位
 */
function lGet9Point (rectObj,pointType) 
{
	//矩形区域上的9个点
	//1  2  3
	//4  5  6
	//7  8  9
	var x
	var y
	
	if(pointType == 1 || pointType==4 || pointType==7) x = rectObj.x;
	if(pointType == 2 || pointType==5 || pointType==8) x = rectObj.x+rectObj.width/2;
	if(pointType == 3 || pointType==6 || pointType==9) x = rectObj.x+rectObj.width;

	if(pointType == 1 || pointType==2 || pointType==3) y = rectObj.y;
	if(pointType == 4 || pointType==5 || pointType==6) y = rectObj.y+rectObj.height/2;
	if(pointType == 7 || pointType==8 || pointType==9) y = rectObj.y+rectObj.height;
	
	return new lPoint(x,y);
}

/**
 * 将目标对齐至区域
 * @param {object} target	对象
 * @param {number} tW	对象宽
 * @param {number} tH	对象高
 * @param {object} rectObj	区域对象用 lRect() 或 LUObjToRect() 来生成
 * @param {number} p1	区域上的对齐位置
 * @param {number} p2	对象上的对齐位置
 */
function lAlign (target,tW,tH,rectObj,p1,p2) 
{
	if(p1==undefined) p1=1
	if(p2==undefined) p2=p1
	
	var rP1 = lGet9Point(rectObj,p1);
	var rP2 = lGet9Point(lRect(0,0,tW,tH),p2);
	
	target.style.left = (rP1.x-rP2.x)+"px";
	target.style.top = (rP1.y-rP2.y)+"px";
}

/**
 * 根据百分比对齐横向
 * @param {Object} target
 * @param {Object} p1	left百分比
 * @param {Object} p2	x百分比
 */
function lAlingByPerH (target,p1,p2) {
	if(p1==undefined) p1=50
	if(p2==undefined) p2=-50
	TweenMax.to(target,0,{left:p1+"%",x:p2+"%"})
	
}

/**
 * 根据百分比对齐纵向
 * @param {Object} target
 * @param {Object} p1	top百分比
 * @param {Object} p2	y百分比
 */
function lAlingByPerV (target,p1,p2) {
	if(p1==undefined) p1=50
	if(p2==undefined) p2=-50
	TweenMax.to(target,0,{top:p1+"%",y:p2+"%"})
}

/**
 * 以对象左上角为注册点，并根据alignW，alignH将对象居中
 * 
用法：
lAlignByNum(target,100,100)
方法：
lAlignSync() 应用对齐
 * 
 * 
 * @param {Object} target
 * @param {Number} alignW	对齐区域宽
 * @param {Number} alignH	对齐区域高
 */
function lAlignByNum (target,alignW,alignH) 
{
	if(target.oLeft==undefined)
	{
		lSaveOPoint(target)
	}
	target.lAlignW = alignW
	target.lAlignH = alignH
	
	target.lAlignSync =function() {
		
		
		if(target.lAlignW!=undefined)
		{
			target.style.left= (target.oLeft+target.lAlignW/2 - target.offsetWidth/2)+"px"
		}
		
		if(target.lAlignH!=undefined)
		{
			//console.log("lAlignSync",target.offsetHeight);
			target.style.top= (target.oTop+target.lAlignH/2 - target.offsetHeight/2)+"px"
		}
	}
	
	target.lAlignSync()
}

/**
 * 根据父级宽高做水平和垂直居中，如果对象未设置width和height则不会居中对齐(如果target有transform变化在安卓上会有问题，不居中)
 * @param {Object} target	目标
 * @param {Object} offX	偏移x
 * @param {Object} offY	偏移y
 */
function lAlignByMarginAuto (target,offX,offY) 
{
	lAlignByMarginAutoH(target,offX) 
	lAlignByMarginAutoV(target,offY)
}
/**
 * 根据父级宽高做水平居中，如果对象未设置width则不会居中对齐(如果target有transform变化在安卓上会有问题，不居中)
 * @param {Object} target	目标
 * @param {Object} offX	偏移x
 */
function lAlignByMarginAutoH (target,offX) 
{
	//如果对象未设置width和height则不会居中对齐
	//if(target.style.width=="") target.style.width=target.offsetWidth+"px"
	//if(target.style.height=="") target.style.height=target.offsetHeight+"px"
	try{
		if(target.style.width=="") console.log("lAlignByMarginAuto:target未定义宽")
	}catch(e){
	}
	
	target.style.margin="auto"
	target.style.position="absolute"
	if(offX==undefined)
	{
		target.style.left="0px"
	}else{
		target.style.left=lCheckUnit(offX)
	}
	
	target.style.right="0px"
	
}
/**
 * 根据父级宽高做垂直居中，如果对象未设置height则不会居中对齐(如果target有transform变化在安卓上会有问题，不居中)
 * @param {Object} target	目标
 * @param {Object} offY	偏移y
 */
function lAlignByMarginAutoV (target,offY) 
{
	//如果对象未设置width和height则不会居中对齐
	//if(target.style.width=="") target.style.width=target.offsetWidth+"px"
	//if(target.style.height=="") target.style.height=target.offsetHeight+"px"
	try{
		if(target.style.height=="") console.log("lAlignByMarginAuto:target未定义高")
	}catch(e){
	}
	
	target.style.margin="auto"
	target.style.position="absolute"
	
	if(offY==undefined)
	{
		target.style.top="0px"
	}else{
		target.style.top=lCheckUnit(offY)
	}
	
	target.style.bottom="0px"
}


/**
 * 按钮类默认样式，如修改请覆盖
 */
var lBtnObj={}
lBtnObj.defaultNormal = function(e){TweenMax.set(e.currentTarget,{autoAlpha:1})}//正常状态默认效果
lBtnObj.defaultOver = function(e){TweenMax.set(e.currentTarget,{autoAlpha:0.8})}//over状态默认效果
lBtnObj.defaultDeactive = function(e){TweenMax.set(e.currentTarget,{autoAlpha:0.3})}//失效状态默认效果

/**
 * 按钮类，自动判断移动设备.调用target.lDeactive()调整为不可用状态，调用target.lActive()恢复可用状态
 * 使用方法：
 * 图片： lBtn(btn,onClick,"images/1.jpg","images/2.jpg")
 * Tween： lBtn(btn,onClick,{autoAlpha:1},{autoAlpha:0.5})
 * 
 * @param {object} target	目标对象
 * @param {function} click	点击后触发
 * @param {object} normal	默认状态（mouseout），可定义TweenMax obj,或 图片路径
 * @param {object} over	over状态，可定义TweenMax obj,或 图片路径
 * @param {object} down	按下状态，可定义TweenMax obj,或 图片路径
 * @param {object} deactive	不可用状态，可定义TweenMax obj,或 图片路径
 */
function lBtn(target,click,normal,over,down,deactive)
{
	//效果Obj
	var efObj=new Object
	
	target.style.pointerEvents=""
	
	//--------------------------------------------参数判断
	
	//out状态(normal)
	if(normal==undefined)//未定义方法则用默认方法
	{ 	
		normal = lBtnObj.defaultNormal
	}else if(normal == "none")//是none，则没有效果
	{
		normal=undefined
		
	}else if(typeof normal == "object")//是obj，则使用Tweenmax，
	{
		efObj.normal=normal
		if(efObj.normal.time==undefined) efObj.normalTime=0
		normal = function (e) {
			TweenMax.to(e.currentTarget,efObj.normalTime,efObj.normal)
		}
	}else if(typeof normal == "string")//是字符串
	{
		efObj.normalSrc = normal
		normal = function (e) {
			e.currentTarget.src=efObj.normalSrc
		}
	}
	
	//over状态
	if(over==undefined) 
	{
		over = lBtnObj.defaultOver;
		
	}else if(over == "none")//是none，则没有效果
	{
		over=undefined
		
	}else if(typeof over == "object")
	{
		efObj.over=over
		if(efObj.over.time==undefined) efObj.overTime=0
		over = function (e) {
			TweenMax.to(e.currentTarget,efObj.overTime,efObj.over)
		}
	}else if(typeof over == "string")//是字符串
	{
		efObj.overSrc = over
		over = function (e) {
			e.currentTarget.src=efObj.overSrc
		}
	}
	
	//按下状态
	if(down == "none")//是none，则没有效果
	{
		down=undefined
		
	}else if(typeof down == "object")
	{
		efObj.down=down
		if(efObj.down.time==undefined) efObj.downTime=0
		down = function (e) {
			TweenMax.to(e.currentTarget,efObj.downTime,efObj.down)
		}
	}else if(typeof down == "string")//是字符串
	{
		efObj.downSrc = down
		down = function (e) {
			e.currentTarget.src=efObj.downSrc
		}
	}
	
	//失效状态
	if(deactive == "none")//是none，则没有效果
	{
		deactive=undefined
		
	}else if(deactive==undefined) 
	{
		deactive = lBtnObj.defaultDeactive;
		
	}else if(typeof deactive == "object")
	{
		efObj.deactive=deactive
		if(efObj.deactive.time==undefined) efObj.deactiveTime=0
		deactive = function (e) {
			TweenMax.to(e.currentTarget,efObj.deactiveTime,efObj.deactive)
		}
	}else if(typeof deactive == "string")//是字符串
	{
		efObj.deactiveSrc = deactive
		deactive = function (e) {
			e.currentTarget.src=efObj.deactiveSrc
		}
	}
	
	//--------------------------------------------定义失效和激活
	
	//激活状态
	target.lActive = function()
	{
		target.lIsActive=true;
		target.style.cursor="pointer"
		if(normal!=undefined)
		{
			normal({target:target,currentTarget:target})
		}else{
			TweenMax.to(target,0,{autoAlpha:1})
		}
		
	}
	
	//失效状态
	target.lDeactive = function()
	{
		target.lIsActive=false;
		target.style.cursor=""
		if(deactive!=undefined) deactive({target:target,currentTarget:target})
	}
	
	
	//删除
	target.removeLBtn=function () {
		lRemoveLBtn(target) 
		delete target.removeLBtn
	}
	
	//调整至激活状态
	target.lActive()
	
	//如果对象在lsec中设置了隐藏，改变lActive会使之出现。为了避免此bug则继续隐藏对象
	if(target.isShown==false)
	{
		target.hide()
	}
	
	
	//--------------------------------------------判断设备并应用效果
	
	//判断是否是移动设备
	var isTouchEvent = lIsMobile()
	
	//console.log(isTouchEvent)
	
	if(isTouchEvent)//是移动设备==========================================================
	{
		
		//如果是移动设备，并且down未定义则用over代替down
		if(down==undefined) down=over
		
		//移动设备
		target.lTouchstart=function (e) {
			//计算按下时的屏幕坐标
			if(e.originalEvent)
			{
				target.lStartX = e.originalEvent.changedTouches[0].clientX
				target.lStartY = e.originalEvent.changedTouches[0].clientY
			}else{
				target.lStartX = e.changedTouches[0].clientX
				target.lStartY = e.changedTouches[0].clientY
			}
			if(target.lIsActive) 
			{
				if(down!=undefined) down(e)
			}
		}
		target.lTouchend=function (e) {
			//计算移动距离
			if(e.originalEvent)
			{
				target.lMoveX = e.originalEvent.changedTouches[0].clientX-target.lStartX
				target.lMoveY = e.originalEvent.changedTouches[0].clientY-target.lStartY
			}else{
				target.lMoveX = e.changedTouches[0].clientX-target.lStartX
				target.lMoveY = e.changedTouches[0].clientY-target.lStartY
			}
			//console.log(target.lMoveX,target.lMoveY)
			if(target.lIsActive)
			{
				if(normal!=undefined) normal(e)
				
				//如果移动太远则点击不生效
				if(Math.abs(target.lMoveX)<=50 && Math.abs(target.lMoveY)<=50)
				{
					if(click!=undefined) click(e)
					if(lBtnObj.onGlobalClick!=undefined) lBtnObj.onGlobalClick(e)//全球事件
				}
				
			}
		}
		
		//绑定事件
		$(target).bind("touchstart",target.lTouchstart)
		$(target).bind("touchend",target.lTouchend)
		
	}else{//不是移动设备==========================================================
		
		target.lMouseup = function(e)
		{
			//console.log("lMouseup")
			target.lMoveX = e.pageX-target.lStartX;
			target.lMoveY = e.pageY-target.lStartY;
			
			if(target.lIsActive)
			{
				if(down!=undefined)
				{
					if(over!=undefined) over(e)
				}
				
				//如果移动太远则点击不生效
				//console.log(target.lMoveX,target.lMoveY)
				if(Math.abs(target.lMoveX)<=50 && Math.abs(target.lMoveY)<=50)
				{
					if(click!=undefined) click(e)
					if(lBtnObj.onGlobalClick!=undefined) lBtnObj.onGlobalClick(e)//全球事件
				}
				
				
				$(target).unbind("mouseup",target.lMouseup)
			}

		}
		target.lMousedown = function(e)
		{
			//console.log("lMousedown")
			$(target).unbind("mouseup",target.lMouseup)
			
			target.lStartX = e.pageX
			target.lStartY = e.pageY
			
			if(target.lIsActive)
			{
				if(down!=undefined) down(e)
				$(target).bind("mouseup",target.lMouseup)
			}
		}
		
		target.lMouseleave = function(e)
		{
			$(target).unbind("mouseup",target.lMouseup)
			if(target.lIsActive)
			{
				if(normal!=undefined) normal(e)
			}
		}
		
		target.lMouseenter = function(e)
		{
			if(target.lIsActive)
			{
				if(over!=undefined) over(e)
			}
		}
		
		//绑定事件
		$(target).bind("mouseenter",target.lMouseenter)
		$(target).bind("mouseleave",target.lMouseleave)
		$(target).bind("mousedown",target.lMousedown)
		
	}
	
}

/**
 * 删除lbtn效果
 */
function lRemoveLBtn (target) 
{
	if(target.lActive!=undefined)
	{
		target.lActive()
	}
	
	
	target.style.cursor=""
	
	$(target).unbind("mouseenter",target.lMouseenter)
	$(target).unbind("mouseleave",target.lMouseleave)
	$(target).unbind("mousedown",target.lMousedown)
	$(target).unbind("mouseup",target.lMouseup)
	$(target).unbind("touchstart",target.lTouchstart)
	$(target).unbind("touchend",target.lTouchend)
	
	delete target.lMouseenter
	delete target.lMouseleave
	delete target.lMousedown
	delete target.lMouseup
	delete target.lTouchstart
	delete target.lTouchend
	
	delete target.lIsActive
	
	delete target.lActive
	delete target.lDeactive
}

/**
 * 给对象添加拖动事件兼容pc和移动设备,拖动距离为e.dragX,和e.dragY
	lDragEvent(ass04,function (e) 
	{
		//onMove
		var moveX= e.moveX
		var moveY= e.moveY
		
		//缩放比例修正
		//moveX/=0.5
		//moveY/=0.5
		
		e.currentTarget.style.left=e.targetStartX+moveX+"px"
		e.currentTarget.style.top=e.targetStartY+moveY+"px"
		
	},function (e) {
		//onStart
		TweenMax.killTweensOf(e.currentTarget)
	},function (e) {
		//onEnd
		//throw
		var speed=e.getSpeed()
		console.log(speed);
		TweenMax.to(e.currentTarget,1,{
			ease:Power1.easeOut,
			left:"+="+speed.speedX*15,
			top:"+="+speed.speedY*15
		})
	})
 */
function lDragEvent (target,onMove,onStart,onEnd) 
{
	//alert(String(document.ontouchstart)=="null")
	
	var isMobile = lIsMobile()
	
	if(isMobile)
	{
		//手机版
		$(target).bind("touchstart",startM)
	}else{
		//pc版
		$(target).bind("mousedown",startM)
		
		
	}

	function endM (e) {
		//console.log(e.originalEvent.changedTouches[0])
		$(target).unbind("touchmove",tMove)
		$(target).unbind("mousemove",tMove)
		$(target).unbind("mouseleave",endM)
		$(target).unbind("touchend",endM)
		$(target).unbind("mouseup",endM)
		//dispachEvent(e)
		
		if(onEnd!=undefined)
		{
			lEventUtils(e)
			onEnd(e)
		}
	}
	
	function startM (e) {
		//console.log(e.originalEvent.changedTouches[0])
		//e.preventDefault()
		
		if(isMobile)
		{
			$(target).bind("touchmove",tMove)
			$(target).bind("touchend",endM)
		}else{
			$(target).bind("mousemove",tMove)
			$(target).bind("mouseup",endM)
			$(target).bind("mouseleave",endM)
		}
		
		lEventUtils(e)
		
		if(onStart!=undefined)
		{
			onStart(e)
		}
	}
	
	function tMove (e) {
		e.preventDefault()
		
		if(onMove!=undefined)
		{
			lEventUtils(e)
			onMove(e)
		}
	}
	
	
	//删除drawEvent
	target.lRemoveDrawEvent = function () 
	{
		$(target).unbind("touchstart",startM)
		$(target).unbind("touchend",endM)
		$(target).unbind("mousedown",startM)
		$(target).unbind("mouseup",endM)
		$(target).unbind("mouseleave",endM)
		$(target).unbind("mousemove",tMove)
		$(target).unbind("touchmove",tMove)
		delete target.lRemoveDrawEvent
	}
}

/**
 * 鼠标event分析
用法：
	target..addEventListener("touchmove",onMove)
	function onMove(e) {
		console.log(lEventUtils(e).mouseX,"当前鼠标在页面上的x")
		console.log(lEventUtils(e).mouseY,"当前鼠标在页面上的y")
		console.log(lEventUtils(e).isRollout(),"鼠标是否移出对象")
	}
属性：
mouseX	当前坐标x
mouseY	当前坐标y
startX	起始坐标x(当eventType为mouseDown或touchStart时记录)
startY	起始坐标y(当eventType为mouseDown或touchStart时记录)
targetStartX	对象起始坐标x(当eventType为mouseDown或touchStart时记录)
targetStartY	对象起始坐标y(当eventType为mouseDown或touchStart时记录)
moveX	距离startX移动了多少x
moveY	距离startY移动了多少y
moveStepX	距离上一次的位置移动的距离
moveStepY	距离上一次的位置移动的距离
useTime	距离上一次的位置移动所用时间
isMobile	是否是移动版
方法：
readMousePoint()	读取当前mouse位置并保持至target.lEventUtilsObj.mouseX,mouseY
saveStartPoint()	爆粗鼠标当前位置至target.lEventUtilsObj.startX,startY
isRollout()	鼠标是否移出对象
getSpeed()	计算速度，返回60分之1秒移动的距离


 * 
 * @param {Object} e
 */
function lEventUtils (e) {
	var target = e.currentTarget
	var tObj
	
	
	//在对象上(e.currentTarget)建立一个lEventUtilsObj,用于保存数据
	if(target.lEventUtilsObj==undefined)
	{
		target.lEventUtilsObj={}
		target.lEventUtilsObj.isMobile = lIsMobile()
		
		//保存起始点
		target.lEventUtilsObj.getSpeed = function () 
		{
			var tTime=100//采样时间(毫秒)
			var curTime=0
			var curX=0
			var curY=0
			//console.log(this.mouseXStepArr);
			if(this.useTimeArr)
			{
				
				for (i=this.useTimeArr.length-1; i>=0; i--)
				{
					curTime+=this.useTimeArr[i]
					curX+=this.mouseXStepArr[i]
					curY+=this.mouseYStepArr[i]
					
					if(curTime>=tTime)
					{
						break
					}
				   
				}
				
				var timeP = tTime/curTime
				//console.log(curTime,curD,timeP);
				//取100毫秒
				curTime*=timeP
				curX*=timeP
				curY*=timeP
				
				//60分之1秒移动的距离
				curX*=0.16666
				curY*=0.16666
			}
			
			
			//console.log(curX,curY);
			
			return {speedX:curX,speedY:curY}
		}
		
		//是否在对象区域内
		target.lEventUtilsObj.isRollout = function () {
			var t = this.event.currentTarget
			var r = t.getBoundingClientRect()
			//console.log(lHitTest(this.mouseX,this.mouseY,lRect(r.left,r.top,r.width,r.height)))
			return !lHitTest(this.mouseX,this.mouseY,lRect(r.left,r.top,r.width,r.height))
		}
	}
	tObj = target.lEventUtilsObj
	tObj.event = e
	
	//读取当前点
	tObj.lastMouseX = tObj.mouseX
	tObj.lastMouseY = tObj.mouseY
	
	if(tObj.isMobile)
	{
		
		if(this.event.originalEvent!=undefined)
		{
			tObj.mouseX=this.event.originalEvent.changedTouches[0].clientX
			tObj.mouseY=this.event.originalEvent.changedTouches[0].clientY
		}else{
			tObj.mouseX=this.event.changedTouches[0].clientX
			tObj.mouseY=this.event.changedTouches[0].clientY
		}
	}else{
		
		tObj.mouseX=this.event.pageX
		tObj.mouseY=this.event.pageY
	}
	
	if(e.type=="mousedown"||e.type=="touchstart")
	{
		tObj.lastTimeStamp=e.timeStamp
		tObj.timeStamp=e.timeStamp
		tObj.lastMouseX=tObj.mouseX
		tObj.lastMouseY=tObj.mouseY
		
		tObj.mouseXStepArr=[]
		tObj.mouseYStepArr=[]
		tObj.useTimeArr=[]
		tObj.startX=tObj.mouseX
		tObj.startY=tObj.mouseY
		//console.log("parseInt(target.style.left)",parseInt(target.style.left));
		tObj.targetStartX=parseInt(target.style.left)
		tObj.targetStartY=parseInt(target.style.top)
		//console.log("reeee");
	}
	
	if(tObj.lastTimeStamp==undefined)
	{
		tObj.lastTimeStamp=e.timeStamp
		tObj.timeStamp=e.timeStamp
		tObj.lastMouseX=tObj.mouseX
		tObj.lastMouseY=tObj.mouseY
	}
	
	tObj.moveStepX = tObj.mouseX-tObj.lastMouseX
	tObj.moveStepY = tObj.mouseY-tObj.lastMouseY
	
	//时间
	tObj.lastTimeStamp = tObj.timeStamp
	tObj.timeStamp = e.timeStamp
	tObj.useTime=tObj.timeStamp-tObj.lastTimeStamp
	
	if(tObj.mouseXStepArr)
	{
		tObj.mouseXStepArr.push(tObj.moveStepX)
		tObj.mouseYStepArr.push(tObj.moveStepY)
		tObj.useTimeArr.push(tObj.useTime)
	}
	
	//移动值
	tObj.moveX=tObj.mouseX-tObj.startX
	tObj.moveY=tObj.mouseY-tObj.startY
	
	
	//写入event
	tObj.event.startX = tObj.startX
	tObj.event.startY = tObj.startY
	
	tObj.event.targetStartX = tObj.targetStartX
	tObj.event.targetStartY = tObj.targetStartY
	
	tObj.event.mouseX = tObj.mouseX
	tObj.event.mouseY = tObj.mouseY
	
	tObj.event.moveX = tObj.moveX
	tObj.event.moveY = tObj.moveY
	
	tObj.event.moveStepX = tObj.moveStepX
	tObj.event.moveStepY = tObj.moveStepY
	
	tObj.event.useTime = tObj.useTime
	
	tObj.event.getSpeed = function () {
		return tObj.getSpeed()
	}
	
	return tObj
	
}


/**
 * 保存当前坐标
 */
function lSaveOPoint (target) 
{
	target.oLeft = parseFloat(target.style.left)
	target.oTop = parseFloat(target.style.top)
}

/**
 * 恢复坐标位置
 * @param {Object} target
 */
function lBackToOPoint (target) 
{
	target.style.left = target.oLeft+"px"
	target.style.top = target.oTop+"px"
}



//lMath相关=======================================================================================================================================


/**
 * 保留几位小数
 * @param {Number} num	数字
 * @param {Number} w	位数
 * @param {Boolean} fixZero	补齐位数
 */
function lToFixed (num,w,fixZero) {
	var tn = Math.pow(10,w)
	var rNum = Math.round(num*tn)/tn;
	
	if(fixZero==true)
	{
		if(rNum%1==0)
		{
			rNum+="."
		}
		var tLength = String(rNum).split(".")[1].length
		for (var i = 0; i < w-tLength; i++) {
			rNum+="0"
		}
	}
	
	return rNum
}

/**
 * 滚动计数器
 * 
用法：
var rollNum = lCountNum(p12tArr.length,false,onchange)
function onchange (num) 
{
	console.log(num)
}
//rollNum.next() //向后滚动
//rollNum.prev() //向前滚动

属性：
curId	当前数
length	长度(可以直接改变长度)
lastId	上次值

方法：
next()	增加值
prev()	减少值
svn()	检查改变并判断发布onChange
setCurId()	直接改变值
setEpt()	设置空值

 * 
 * @param {Object} length	长度
 * @param {Object} loop	是否循环
 * @param {Object} onChange	当变化时
 */
function lCountNum(length,loop,onChange)
{
	if(loop==undefined)	loop=false
	
	var cObj={}
	cObj.userId//用户设置值
	cObj.curId=0//当前值
	cObj.lastId=-1//之前值
	cObj.length=length//长度
	//cObj.max=length-1//最大数
	
	//设置空值
	cObj.setEpt=function () {
		if(cObj.curId!=-1)
		{
			cObj.lastId=cObj.curId
			cObj.curId=-1
			if(onChange!=undefined)
			{
				onChange(cObj.curId)
			}
		}
	}
	/*
	cObj.forI=function(fun){
		for (var i = 0; i < cObj.length; i++) {
			if(fun!=undefined)
			{
				fun(i)
			}
		}
	}*/
	
	cObj.setCurId=function (num) {
		//改变值
		//console.log("setCurId",num);
		cObj.userId=num
		cObj.svn()
	}
	
	cObj.next=function () {
		
		//改变值
		cObj.userId=cObj.curId+1
		cObj.svn()
	}
	cObj.prev=function () {
		
		//改变值
		cObj.userId=cObj.curId-1
		cObj.svn()
	}
	
	cObj.svn=function () {
		
		if(loop==true)
		{
			cObj.userId=lLoopNum(cObj.userId,cObj.length)
		}else{
			cObj.userId=lNumRange(cObj.userId,0,cObj.length-1)
		}
		
		//是否有变化
		if(cObj.curId!=cObj.userId)
		{
			cObj.lastId = cObj.curId
			cObj.curId = cObj.userId
			
			if(onChange!=undefined)
			{
				onChange(cObj.curId)
			}
		}
	}

	return cObj
}

/**
 * 让tNum始终在某一范围内循环(滚动数字),翻页的时候常用，当前页++或-- 不在页数范围内时使用 lLoopNum(当前页,最大页数)
 * @param {Number}	tNum 当前数字
 * @param {Number}	length 长度
 */
function lLoopNum(tNum,length) {
	
	//maxNum+=1
	tNum = tNum%length
	
	if(tNum>=0)
	{
		return tNum
	}else{
		return tNum+length
	}
}

/**
 * 限制数字的下限和上限
 * @param {Number} num	原来的数字
 * @param {Number} min	数字下限
 * @param {Number} max	数字上限
 */
function lNumRange (num,min,max) 
{
	if(min!=undefined)	num = Math.max(min,num)
	if(max!=undefined)	num = Math.min(max,num)
	
	return num
}

/**
 * 碰撞检测 lHitTest(0,0,lRect(0,0,10,10))//返回 true
 * @param {number} pointX	点x
 * @param {number} pointY	点y
 * @param {object} rect	区域对象用lRect创建
 */
function lHitTest (pointX,pointY,rect)
{
	if(pointX>=rect.x && pointY>=rect.y && pointX<=rect.width+rect.x && pointY<=rect.height+rect.y)
	{
		return true;
	}else{
		return false;
	}
	
}


var lPsdWidth=640;
var lPsdHeight=1008;
/**
 * 读取屏幕宽度计算缩放比例，并返回新的数值。
 */
function lSc (num,oW) {
	if(oW==undefined)	oW=lPsdWidth
	
	var sc = lWindowRect().width/oW
	return num*sc+"px";
}

/**
 * 根据psd宽度计算百分比
 * @param {Number} num	对象在psd上的数值
 * @param {Number} oW	psd的宽度，默认为640
 */
function lpW (num,oW) {
	if(oW==undefined)	oW=lPsdWidth
	var p = num/oW*100
	return p+"%";
}
/**
 * 根据psd高度计算百分比
 * @param {Number} num	对象在psd上的数值
 * @param {Number} oH	psd的高度，默认为1008
 */
function lpH (num,oH) {
	if(oH==undefined)	oH=lPsdHeight
	var p = num/oH*100
	return p+"%";
}

/**
 * 计算区域缩放比例
 * @param {number} width	对象宽
 * @param {number} height	对象高
 * @param {number} tWidth	目标宽
 * @param {number} tHeight	目标高
 * @param {boolean}	noBorder	无边模式缩放
 * @return {number}	缩放比例
 */
function lScaleSc (width,height,tWidth,tHeight,noBorder)
{
	var sc;
	if(noBorder==undefined) noBorder=false;
	if (noBorder)
	{
		sc = Math.max(tHeight / height, tWidth / width);
	}else{
		sc = Math.min(tHeight / height, tWidth / width);
	}
	
	return sc;
}

/**
 * 将对象转换为Rect
 */
function lObjToRect(target)
{
	return lRect(target.offsetLeft,target.offsetTop,target.offsetWidth,target.offsetHeight)
}

/**
 * 点
 * @param {Number} x
 * @param {Number} y
 */
function lPoint (x,y) 
{
	if(x==undefined) x=0
	if(y==undefined) y=0
	var point = new Object()
	point.x = parseFloat(x)
	point.y = parseFloat(y)
	
	point.toString = function()
	{
		return "["+x+","+y+"]";
	}
	
	
	return point
}

/**
 * 区域对象
 */
function lRect(x,y,width,height)
{
	var rectObj=new Object()
	rectObj.className="lRect"
	rectObj.x=x;
	rectObj.y=y;
	rectObj.width=width;
	rectObj.height=height;
	
	rectObj.toString = function()
	{
		return "["+"x:"+x+","+"y:"+y+","+"width:"+width+","+"height:"+height+"]";
	}
	
	return rectObj
}

/**
 * 圆桌概率计算 将标有命中概率(0-100)的数组传入，返回命中结果
 *
 * 例：有3个奖品 a,b,c 中奖率分别为 50%，60%，1%
 * 则传入probability([50,60,1])
 * 返回命中结果，返回-1则说明 miss, 没有命中，如果其中某个奖品中奖率大于等于100%则miss的几率为0
 * 传入大于100%的几率则会扩大该奖品在饼图中的面积，相应命中率则会增加
 *
 * @param {object} arr	概率数组
 * @param {boolean} miss	是否考虑miss情况
 * @return
 */
function lProbability(arr, miss)
{
	if(miss==undefined)	miss=true
	
	var pArr = [];
	var missNum = 100;
	
	//pArr.push(missNum);
	
	var allNum = 0;
	for (var i = 0; i < arr.length; i++)
	{
		allNum += arr[i];
		pArr.push(arr[i]);
		
		if (miss && missNum > 0)
		{
			//计算miss率
			var curmissNum = 100 - arr[i];
			curmissNum = Math.max(0, curmissNum);
			missNum *= curmissNum / 100;
		}
	}

	if (miss)
	{
		//计算allNum中的实际miss值是多少
		//将miss率转换为饼图中的数值
		/*
		try{
			console.log("lMath.lProbability: miss率: " + parseFloat(missNum).toFixed(2) + "%");
		}catch(e){
		}
		*/
		
		if (missNum > 0)
		{
			missNum = allNum / (1 - (missNum / 100)) - allNum;
			allNum += missNum;
			
		}
		/*
		try{
			console.log("lMath.lProbability: 饼图miss值: " + parseFloat(missNum).toFixed(2));
		}catch(e){
		}
		*/
		pArr.unshift(missNum);
	}
	var rNum = Math.random() * allNum;
	var cNum = 0;
	
	/*	
	try{
		console.log("lMath.lProbability: 概率数组:", pArr, "random点:", rNum);
	}catch(e){
	}
	*/
	for (var j = 0; j < pArr.length; j++)
	{
		cNum += pArr[j];
		if (cNum > rNum)
		{
			if (miss)
			{
				return j - 1;
			}
			else
			{
				return j;
			}
		}
	}
	
	
	return -1;
}

/**
 * 生成在此范围内的随机数
 */
function lRandomRange (minNum,maxNum,r) {
	if(r==undefined) r=Math.random()
	return r*(maxNum - minNum)+minNum ;
}

/**
 * 已知线段上2点,返回在同一直线上等距的第三点
 * @param {Object} p1
 * @param {Object} p2
 * @param {Number} ratio	当值为0.5时，点位p1,p2的中点
 */
function lRatioTo (p1,p2,ratio) {
	return lPoint(p1.x + (p2.x - p1.x) * ratio, p1.y + (p2.y - p1.y) * ratio );
}

/**
 * 计算2点间距离
 * @param {Object} p1	点1
 * @param {Object} p2	点2
 * @param {Boolean} pow	是否开跟
用法：
var d = lPDistance(lPoint(0,0),lPoint(5,5))
console.log(d)
 */
function lPDistance (p1,p2,pow) 
{
	var calX = p2.x - p1.x;
	var calY = p2.y - p1.y;
	
	//在应用时可以不开根
	if(pow==undefined||pow==true)
	{
		return Math.sqrt((calX *calX + calY * calY));
	}else{
		return calX *calX + calY * calY
	}
	
}


/**
 * 角度转换向量
 * @param {Number} angle	角度
 * @param {Number} r	半径
 */
function lAngleToVector(angle,r)
{
	if(r==undefined)
	{
		r=1
	}
	var t_rad = lDegree2radian(angle)
	//console.log(Math.cos(t_rad))
	return lPoint(Math.cos(t_rad) * r, Math.sin(t_rad) * r);
}
/**
 * 基于点，角度转换向量点
 */
function lAngleToVectorByP(point,angle,r)
{
	var p = lAngleToVector(angle,r)
	return lPoint(p.x+point.x, p.y+point.y);
}

/**
 * 二维向量坐标转换角度.convert 2D-vector to Angle
 * @param {Number} x
 * @param {Number} y
 */
function lVectorToAngle(x, y)
{
	var angle =  lRadian2degree(Math.atan2(y,x))
	return angle;
}
/**
 * 基于点，二维向量坐标转换角度
 * @param {Object} centerP	中心点
 * @param {Object} tP	目标点
 */
function lVectorToAngleByP(centerP,tP) {
	return lVectorToAngle(tP.x-centerP.x, tP.y-centerP.y)
}

/**
 * 旋转向量
 * @param {Number} x	
 * @param {Number} y	
 * @param {Number} angle	
 */
function lRotateVector (x,y,angle) 
{
	var cAngle =  lVectorToAngle(x,y)
	
	var newAngle = cAngle+angle
	var r = lPDistance({x:x,y:y},{x:0,y:0})
	var newP = lAngleToVector(newAngle,r);
	
	return newP;
}

/**
 * 基于点，旋转向量
 * @param {Object} centerP	中心点
 * @param {Object} tP	目标点
 * @param {Object} angle	角度
 */
function lRotateVectorByP (centerP,tP,angle) 
{
	var cAngle =  lVectorToAngleByP(centerP,tP)
	var newAngle = cAngle+angle
	var r = lPDistance(centerP,tP)
	return lAngleToVectorByP(centerP,newAngle,r);
}

/**
 * 角度转换弧度
 * @param {Number} degree
 */
function lDegree2radian(degree)
{
  // 1 radian = 2(radius = 1, diameter = 1)π
  // 2π = 360° --> π = 180° --> π/180 = 1°
  return Math.PI / 180 * degree;
}

/**
 * 弧度转换角度
 * @param {Number} radian
 */
function lRadian2degree(radian)
{
  // Math.PI / 180 * degree = radian
  // --> degree = radian * (180 / Math.PI)
  return  radian * (180 / Math.PI);
}

//lString string相关=======================================================================================================================================

function lUserAgent(){	return navigator.userAgent.toLowerCase()}
function lIsIpad(){	return lUserAgent().match(/ipad/i) == "ipad";}
function lIsIphoneOs(){	return lUserAgent().match(/iphone os/i) == "iphone os";}
function lIsIos(){	return lIsIpad()||lIsIphoneOs()}
function lIsMidp(){	return lUserAgent().match(/midp/i) == "midp";}
function lIsUc7(){	return lUserAgent().match(/rv:1.2.3.4/i) == "rv:1.2.3.4";}
function lIsUc(){	return lUserAgent().match(/ucweb/i) == "ucweb";}
function lIsAndroid(){	return lUserAgent().match(/android/i) == "android";}
function lIsCE(){	return lUserAgent().match(/windows ce/i) == "windows ce";}
function lIsWM(){	return lUserAgent().match(/windows mobile/i) == "windows mobile";}
function lIsChrome(){	return lUserAgent().match(/chrome/i) == "chrome";}
function lIsFirefox()
{	
	if(lIsFirefox.status==undefined)
	{
		lIsFirefox.status = lUserAgent().match(/firefox/i) == "firefox"
	}
	
	return lIsFirefox.status
	
}

function lIsWeixin(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
 	} else {
		return false;
	}
}

/**
 * 是否是局域网
 */
function lIsLAN()
{
	var tArr = location.hostname.split(".")
	if(tArr[0]==192&&tArr[1]==168)
	{
		return true
		
	}else if(tArr[0]==172&&tArr[1]==16)
	{
		return true
		
	}else if(tArr[0]==127&&tArr[1]==0)
	{
		return true
		
	}else if(tArr[0]==10)
	{
		return true
	}else{
		return false
	}
}

/**
 * 安卓版本号
 */
function lAndroidVer () {
	var userAgentArr =  lUserAgent().split(";")
	var verArr
	for (var i = 0; i < userAgentArr.length; i++) {
		if(userAgentArr[i].indexOf("android")!=-1)
		{
			verArr = userAgentArr[i].split("android")[1].split(".")
			
			for (var j = 0; j < verArr.length; j++) {
				verArr[j]=parseInt(verArr[j])
			}
		}
	}
	return verArr
}
/**
 * ios版本号
 */
function lIosVer () {
	var uaArr = lUserAgent().split(" ")
	var ver
	var iphoneNum = uaArr.indexOf("iphone")
	if(iphoneNum!=-1)
	{
		ver = uaArr[iphoneNum+2].split("_")
		return ver
	}else{
		return false
	}
}

/**
 * 判断数字的单位，如px,%等,如果传入的数字有单位则不做任何处理，如果没有单位则默认加入指定的单位
 * 如传入100px或100%则不做处理，如传入100则会在后面加上默认单位“px”
 * @param {Object} num	数字
 * @param {String} dfUnit	默认单位，默认为"px"
 */
function lCheckUnit (num,dfUnit) {
	if(dfUnit==undefined)	dfUnit="px"
	if(isNaN(num))
	{
		return num
	}else{
		return num+dfUnit
	}
}

/**
 * HTMLDecode
 */
function lHTMLDecode(text)
{
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output;
} 

/**
 * 返回字符数，中文为2个字符
 * @param {string} str	字符
 */
function lStrLength(str)
{
	var len=0;
	for(var i=0;i< str.length;i++)
	{
		if (str.charAt(i)>'~')
		{
			len+=2;
		}else{
			len++
		}
	}
	
	return len;
}

/**
 * 判断字符是否有中文字符  汉字
 * @param {Object} s
 */
function lIsHasChn(s)  {   
    var patrn= /^[\u4E00-\u9FA5]+$/;
    if (!patrn.exec(s)){   
        return false;   
    }else{   
        return true;   
    }   
}

/**
 * 判断字符是否是英文字符
 * @param {Object} s
 */
function lIsEnStr(s)  {   
    var patrn= /^[a-zA-Z]+$/;
    if (!patrn.exec(s)){
        return false;   
    }else{   
        return true;   
    }
}

/**
 * 返回被限制的字符串
 */
function lMaxStrLength (str,maxLength) 
{
	var rStr=""
	var len=0;
	for(var i=0;i< str.length;i++)
	{
		if (str.charAt(i)>'~')
		{
			len+=2;
		}else{
			len++
		}
		
		if(len<=maxLength)
		{
			rStr+=str.charAt(i)
		}else{
			return rStr
		}
	}
	
	return rStr;
}

/**
 * 将参数拼接起来并返回
 * @param {object} arr	对象数组
 * @param {string} symbol	间隔符
 */
function lApt(arr, symbol) {
	if (symbol == undefined)
		symbol = ""

	var pString = ""
	for (var i = 1; i < arr.length; i++) {
		pString += arr[i]
		if (i < arr.length - 1) {
			pString += symbol
		}
	}
	return pString
}

/**
 * 判断手机号码
 */
function lIsPhoneNum(num) {
	
	num = parseInt(num)
	var f3 = parseInt(String(num).substring(0,3))
	
	//移动:
	var narr1=[139,138,137,136,135,134,147,188,187,184,183,182,170,178,159,158,157,152,151,150,139]
	//联通:
	var narr2=[186,185,176,145,156,155,132,131,130,186,170]
	//电信:
	var narr3=[189,181,180,177,153,133,189,133,170]
	
	if(num.toString().length!=11)
	{
		return false
		
	}else if(narr1.indexOf(f3)==-1 && narr2.indexOf(f3)==-1 && narr3.indexOf(f3)==-1)
	{
		return false
	}else{
		
		return true
	}
}

/**
 * 判断邮件
 */
function lIsEmail(num) {
	if (/^([a-zA-Z0-9]+[-|_|\_|\.]?)+@([a-zA-Z0-9]+[-|_|\_|\.]?)+\.[a-zA-Z0-9]{1,10}$/.test(num)) {
		return true
	} else {
		return false
	}
}

/**
 * 遍历obj并返回属性字符串
 */
function lObjToString(obj) {
	var st = ""
	for (var pName in obj) {
		if (obj[pName] != null && obj[pName].constructor == Function) {
			st += pName + ":" + pName + "()\n";
		} else {
			st += pName + ":" + obj[pName] + "\n";
		}

	}
	return st
}

/**
 * 获得页面参数并转换为obj
 */
function lUrlToObj() {
	var url = location.search;
	//获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			//theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
			//theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);//解码
			theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];//不解码
		}
	}
	theRequest.toString = function() {
		return lObjToUrl(theRequest)
	}

	return theRequest;
}

/**
 * 将obj转换为url参数
 */
function lObjToUrl(obj) {
	var st = ""
	for (var pName in obj) {
		if (pName != "toString") {
			if (st == "") {
				//st += "?" + pName + "=" + encodeURIComponent(obj[pName]);
				st += "?" + pName + "=" + obj[pName];
			} else {
				//st += "&" + pName + "=" + encodeURIComponent(obj[pName]);
				st += "&" + pName + "=" + obj[pName];
			}
		}
	}
	return st
}

/**
 * 获得页面Hash参数并转换为obj
 */
function lHashToObj() {
	var url = window.location.hash;
	//获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("#") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			//theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
			//theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);//解码
			theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];//不解码
		}
	}
	theRequest.toString = function() {
		return lObjToHash(theRequest)
	}
	
	//应用到hash
	theRequest.syncToHash=function () {
		window.location.hash = theRequest.toString()
	}

	return theRequest;
}

/**
 * 将obj转换为Hash参数
 */
function lObjToHash(obj) {
	var st = ""
	for (var pName in obj) {
		if (pName != "toString" && pName !="syncToHash") {
			if (st == "") {
				//st += "?" + pName + "=" + encodeURIComponent(obj[pName]);
				st += "#" + pName + "=" + obj[pName];
			} else {
				//st += "&" + pName + "=" + encodeURIComponent(obj[pName]);
				st += "&" + pName + "=" + obj[pName];
			}
		}
	}
	return st
}

/**
 * 井号颜色转换rgb()形式
 * lHex2RgbStr("#FF0000")//输出rgb(255,0,0)
 * lHex2RgbStr("#11FF0000")//输出rgba(255,0,0,17)
 * @param {string} hex	色彩参数
 */
function lHex2RgbStr(hex) {
	var rObj=lHex2rgb (hex)
	if(rObj.a==undefined)
	{
		return "rgb(" + rObj.r + "," + rObj.g + "," + rObj.b +")";
	}else{
		return "rgba(" + rObj.r + "," + rObj.g + "," + rObj.b + "," + (rObj.a / 255) + ")";
	}
	
}

/**
 * {r:255,g:0,b:0}转换"#ff0000"
 */
function lRgbObj2HexStr (rgbObj) {
	var r=""
	rgbObj.r = Math.round(rgbObj.r)
	rgbObj.g = Math.round(rgbObj.g)
	rgbObj.b = Math.round(rgbObj.b)
	if(rgbObj.a) Math.round(rgbObj.a)
	
	if(rgbObj.a==undefined)
	{
		r=lPad(rgbObj.r.toString(16),2)+lPad(rgbObj.g.toString(16),2)+lPad(rgbObj.b.toString(16),2)
	}else{
		r=lPad(rgbObj.a.toString(16),2)+lPad(rgbObj.r.toString(16),2)+lPad(rgbObj.g.toString(16),2)+lPad(rgbObj.b.toString(16),2)
	}
	
	return "#"+r
}

/**
 * "#ff0000" 转换 {r:255,g:0,b:0}
 * "#ffff0000" 转换  {r:255,g:0,b:0,a:255}
 * @param {Object} hex {r:红,g:绿,b:蓝,a:alpha}
 */
function lHex2rgb (hex) {
	var r = hex.replace("#", "");
	var sR,sG,sB,sA,nR,nG,nB,nA
	if (r.length == 3) {
		sR = r.charAt(0)+r.charAt(0)
		sG = r.charAt(1)+r.charAt(1)
		sB = r.charAt(2)+r.charAt(2)
	}else if (r.length == 6) {
		sR = r.substring(0, 2)
		sG = r.substring(2, 4)
		sB = r.substring(4, 6)
	} else if (r.length == 8) {
		sA = r.substring(0, 2)
		sR = r.substring(2, 4)
		sG = r.substring(4, 6)
		sB = r.substring(6)
	}
	
	nR = parseInt(sR, 16);
	nG = parseInt(sG, 16);
	nB = parseInt(sB, 16);
	if(sA!=undefined) nA = parseInt(sA, 16);
	
	r = {r:nR,g:nG,b:nB}
	if(nA!=undefined) r.a = nA

	return r
}
/**
 * rgb颜色转换hsv(hsb)
 */
function lRGBtoHSV(r, g, b) 
{
	r /= 255;
	g /= 255;
	b /= 255;
	var min, max, delta;
	var hsv = new Array(3);
	min = Math.min(r, g, b);
	max = Math.max(r, g, b);
	hsv.v = max;
	delta = max - min;
	if (max != 0) hsv.s = delta / max;
	else {
		hsv.s = .005;
		hsv.h = 0;
		return hsv;
	}
	if (delta == 0) {
		hsv.s = .005;
		hsv.h = 0;
		return hsv;
	}
	if (r == max) hsv.h = (g - b) / delta;
	else if (g == max) hsv.h = 2 + (b - r) / delta;
	else hsv.h = 4 + (r - g) / delta;
	hsv.h *= 60;
	if (hsv.h < 0) hsv.h += 360;
	if (hsv.h >= 360) hsv.h -= 360;
	return hsv;
}

/**
 * hsv(hsb)颜色转换rgb
 */
function lHSVtoRGB(h, s, v) 
{
	var rgb = new Array(3);
	var i;
	var f, p, q, t;
	if (s == 0) {
		rgb.r = rgb.g = rgb.b = v * 255;
		return rgb;
	}
	h /= 60;
	i = Math.floor(h);
	f = h - i;
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	switch (i) {
	case 0:
		rgb.r = v;
		rgb.g = t;
		rgb.b = p;
		break;
	case 1:
		rgb.r = q;
		rgb.g = v;
		rgb.b = p;
		break;
	case 2:
		rgb.r = p;
		rgb.g = v;
		rgb.b = t;
		break;
	case 3:
		rgb.r = p;
		rgb.g = q;
		rgb.b = v;
		break;
	case 4:
		rgb.r = t;
		rgb.g = p;
		rgb.b = v;
		break;
	default:
		rgb.r = v;
		rgb.g = p;
		rgb.b = q;
		break;
	}
	rgb.r *= 255;
	rgb.g *= 255;
	rgb.b *= 255;
	return rgb;
}

/**
 * as Rectangt() 转换到 js rect()
 */
function lAsRect2JsRect(x, y, width, height) {
	var top = y;
	var right = x + width;
	var bottom = y + height;
	var left = x;
	return "rect(" + top + "px " + right + "px " + bottom + "px " + left + "px)";
}

/*
 * rgba 转换 rgb
 * rgba2Rgb("rgba(0,1,2,0.3)") //输出 rgb(0,1,2)
 */
function lRgba2Rgb(rgba) {
	var arr = rgba.split(",")
	var a = arr[arr.length - 1].replace(")", "")
	return rgba.replace("," + a, "").replace("a", "")
}

/**
 * 删除指定位置处的字符串
 * @param {string} tString	目标字符串
 * @param {number} index 字符串位置
 * @param {number} num 数量
 */
function lStringSplice (tString,index,num) {
	var sArr = tString.split("")
	sArr.splice(index,num)
	tString = sArr.join("")
	return tString
}



/**
 * 日期格式化
用法：
对Date的扩展，将 Date 转化为指定格式的String
月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
例子： 
lDateFormat(new Date,"yyyy-MM-dd hh:mm:ss.S")	==> 2006-07-02 08:09:04.423 
lDateFormat(new Date,"yyyy-M-d h:m:s.S")	==> 2006-7-2 8:9:4.18


 * @param {Object} dateOrMilliseconds	日期对象或毫秒数
 * @param {String} fmt	格式字符串
 */
function lDateFormat(dateOrMilliseconds,fmt) 
{
	//修改自meizz的方法Format
	
	if(fmt==undefined) fmt="yyyy-M-d h:m:s.S"
	
	var date
	if(typeof(dateOrMilliseconds)=="number" ||typeof(dateOrMilliseconds)=="string")
	{
		date = new Date
		date.setTime(parseInt(dateOrMilliseconds))
	}else{
		date = dateOrMilliseconds
	}
	
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 判断对象类型
 * 
用法：
console.log(lTyepof(lDiv(mainDiv)))//HTMLDivElement
console.log(lTyepof(new Date))//Date
console.log(lTyepof("string"))//String
console.log(lTyepof([1,2,3]))//Array
console.log(lTyepof(123))//Number
console.log(lTyepof(function () {}))//Function
console.log(lTyepof({}))//Object

 * @param {Object} target	对象
 */
function lTyepof (target) {
	var tString = Object.prototype.toString.call(target)
	return tString.split(" ")[1].slice(0,-1)
}

/**
 * 将json结果格式化
 * @param {Object} data	对象
 * @param {Object} space	空格字符
 */
function lJsonStringify(data,space){
	var seen=[];
	if(space==undefined)
	{
		space="	"
	}
	return JSON.stringify(data,function(key,val){
		if(!val||typeof val !=='object'){
			return val;
		}
		if(seen.indexOf(val)!==-1){
			return '[Circular]';
		}
		seen.push(val);
		return val;
	},space);
}

/**
 * 补齐位数，lPad(100, 4);  // 输出：0100  
 * @param {Number} num	原数字
 * @param {Number} n	位数
 */
function lPad(num, n) {
	
	var tLength = String(num).length
	var rNum = num
	for (var i = 0; i < n-tLength; i++) {
		rNum = "0"+rNum
	}
	
	return rNum
}

//array相关=======================================================================================================================================

/**
 * 数组中的对象相互比较
 * @param {Object} arr
 * @param {Object} onComp
 */
function lCompare (arr,onComp) {
	var length = arr.length
	for (var i = 0; i < length; i++) 
	{
		for(var j = i+1; j < length; j++)
		{
			onComp(arr[i],arr[j])
		}
	}
}

/**
 * 返回数组的最后一个对象
 * @param {Object} arr
 */
function lLastElmArr (arr) 
{
	return arr[arr.length-1]
}

/**
 * 删除数组中的重复项
 * @param {Object} arr
 */
function lArrUnique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

/**
 * 混动数组
 * @param {Array} array	数组
 * @param {Number} range	显示范围
 * @param {Number} step		步数
 * @param {Boolean} loop	是否循环
 */
function lRollArray(array, range, step,loop)
{
	if(loop==undefined)	loop=false
	
	//step *= -1;
	var returnArray = [];
	var i
	var length
	
	if (range != 0)
	{
		if (loop == true)
		{
			length = lNumRange(array.length - 1,0,Number.MAX_VALUE);
			for (i = 0; i < range ; i++) 
			{
				//returnArray.push(array[lRollNum(0, length, step + i)]);
				returnArray.push(array[lLoopNum(step + i, length)]);
			}
		}else {
			
			for (i = 0; i <range ; i++) 
			{
				//console.log(array[step + i],step,i,step + i)
				returnArray.push(array[step + i]);
			}
		}
	}
	
	return returnArray;
}

/**
 * 数组向左滚动
 */
function lArrayRollLeft(array) {
	array.push(array[0]);
	array.shift()
}

/**
 * 数组向右滚动
 */
function lArrayRollRight(array) {
	array.unshift(array[array.length - 1]);
	array.pop()
}

/**
 * 将数组打乱 (不改变原数组)
 * @param {Array} arr	需要打乱的数组
 */
function lOutOfOrder(arr)
{
	arr=arr.slice()
	var rArray=[]
	var length = arr.length;
	for(var i=0;i<length;i++)
	{
		var r=Math.round(Math.random()*(arr.length-1));
		rArray.push(arr[r])
		arr.splice(r,1)
	}
	return rArray
}
/**
 * 从数组中随机挑选一个
 * @param {Array} arr	需要挑选的数组
 */
function lRandomOne(arr)
{
	return arr[parseInt(Math.random() * arr.length)];
}

/**
 * 克隆数组
 * @param {Array} arr	需要挑选的数组
 */
function lCloneArray(arr)
{
	return arr.slice();
}


/**
 * 删除数组中的元素 (不改变原数组)
 * @param {Array} arr	对象数组
 * @param {Number} index	删除的位置
 */
function lDeleteArrElm (arr,index) {
	var tArr = arr.slice()
	tArr.splice(index,1)
	return tArr
}

/**
 * 删除数组中的某元素
 * @param {Object} val
 * @param {Object} tArr
 */
function lDelElmFArr (val,tArr) {
	for(var i=0; i<tArr.length; i++) 
	{
		if(tArr[i] == val) 
		{
			tArr.splice(i, 1);
			i--
	    }
	}
	return tArr
}

//网络相关=======================================================================================================================================

/**
 * @param {string} url	链接
 * @param {object} data	数据
 * @param {function} onSuccess	成功时
 * @param {function} onError	失败时
 * @param {string} type	发送类型post或是get
 * @param {string} dataType	接受数据类型默认为"json"
 * @param {number} reTry	失败时重试次数，默认为3次
 */
function lAjax (url,data,onSuccess,onError,type,dataType,reTry) 
{
	if(type==undefined)	type="post"
	if(dataType==undefined)	dataType="json"
	if(reTry==undefined)	reTry=3
	
	sandData()
	
	function sandData()
	{
		$.ajax({
			type:type,
			dataType:dataType,
			url:url,
			data:data,
			success:onSuccess,
			error:err,
			async:true
		});
	}
	
	var reTryTimes=0;
	function err (p1,p2,p3,p4) {
		reTryTimes++
		//alert("lAjax 重试 "+url)
		console.log("lAjax 重试 "+url)
		if(reTryTimes<reTry)
		{
			sandData()
		}else{
			if(onError!=undefined)
			{
				onError(p1,p2,p3,p4)
			}
		}
	}
}

/**
 * 链接跳转
 * @param {string} url	跳转链接
 * @param {boolean}	newTab 打开新页面，默认为false
 */
function lNavToUrl(url,newTab)
{
	if(url!=undefined && url!="")
	{
		if(newTab==undefined || newTab == false)
		{
			window.location.href=url;
		}else{
			window.open(url)
		}
	}
}

/**
 * 跳转并且fillout
 * @param {Object} url
 * @param {Object} newTab
 * @param {Object} time
 * @param {Object} color
 */
function lNavToUrlWithFillout (url,newTab,time,color) 
{
	if(time==undefined) time=0.3
	if(color==undefined) color="#ffffff"
	document.body.style.background=color;
	TweenMax.to(document.body,time,{autoAlpha:0,onComplete:function () {
		lNavToUrl(url,newTab,color)
	}})
}

/**
 * @param {string} content	内容
 * @param {string} url	链接
 * @param {string} pic	图片。多张图片用“||”隔开
 * @param {string} appkey
 * @param {boolean} newWindow	新窗口
 */
function lShareToTXWb (content,url,pic,appkey,newWindow) {
	if(pic==undefined)
	{
		pic=""
	}
	if(appkey==undefined) appkey=""
	if(newWindow==undefined) newWindow=true
	
	var c=content
	var shareUrl = "http://share.v.t.qq.com/index.php?c=share&a=index&url="+url+"&utm_medium=tqq&title="+c+"&appkey="+appkey+"&pic="+pic+"&assname="
	
	if(newWindow)
	{
		window.open(shareUrl)
	}else{
		window.location.href=shareUrl
	}
}

/**
 * 分享到微博
 */
function lShareToSinaWb(content,url,pic,appkey,newWindow) 
{
	if(pic==undefined)
	{
		pic=""
	}

	if(appkey==undefined) appkey=""
	if(newWindow==undefined) newWindow=true
	var c=encodeURI(content)
	var shareUrl = "http://service.weibo.com/share/share.php?url="+url+"&appkey="+appkey+"&pic="+pic+"&title=" + c
	
	
	if(newWindow)
	{
		window.open(shareUrl)
	}else{
		window.location.href=shareUrl
	}
		
	return shareUrl
}

//加载=======================================================================================================================================
/**
 * 队列加载
 * 
 * 	var urlArr=["1.png","2.png","3.png","4.png","5.png","6.png"]
 *  LQueueLoader(infoUrlArr,onCom)
 * 	
 * 	function onCom () 
 * 	{
 * 	}
 * 
 * @param {array} urlArr	队列地址
 * @param {function} onComplete	全部加载完成，参数1  ：完成的图片数组
 * @param {function} onChildComplete	单个加载完成，参数1  ：原事件参数，参数2  ：当前完成对象在原数组中的位置，参数3  ：当前完成数，参数4 ：队列总数
 * @param {function} onError	图片加载错误，参数1  ：错误事件
 * @param {number} threading	线程数，默认为3（可以同时加载几张图片）
 */
function lQueueLoader (urlArr,onComplete,onChildComplete,onError,threading)
{
	if(threading==undefined) threading=3;
	
	var picArr=[];
	var curPic
	var waitArr = urlArr.slice(0);
	var completeArr=[]
	var completeNum=0//完成图片加载的数量
	
	
	//线程
	for (var i = 0; i < threading; i++) {
		startLoading() 
	}
	
	
	function startLoading () 
	{
		if(waitArr[0]!=undefined)
		{
			var img = document.createElement("img");
			img.src = waitArr[0]
			img.onload = p_onload;
			img.onerror = p_error;
			waitArr.shift()
		}
	}
	function p_error(e)
	{
		completeNum+=1;
		if(onError!=undefined)
		{
			onError(e)
		}
	}

	function p_onload (e) 
	{
		completeNum+=1;//当前完成数
		var picUrl = e.target.src//图片路径
		var completeIndex//当前完成对象在原数组中的位置
		var totalNum = urlArr.length//队列总数
		
		//按照原图片的顺序加入到完成数组中去
		for (var i = 0; i < totalNum; i++) {
			
			if(picUrl.indexOf(urlArr[i])!=-1)
			{
				completeArr[i]=e.target;
				completeIndex =i;
			}
		}
		
		
		//发布单个完成事件
		if(onChildComplete!=undefined)
		{
			onChildComplete(e,completeIndex,completeNum,totalNum)
		}
		
		//判断是否全部加载完毕
		if(waitArr.length==0 && completeNum == totalNum)
		{
			//全部完毕：发布全部完毕事件
			if(onComplete!=undefined)
			{
				onComplete(completeArr)
			}
		}else{
			//尚未全部完毕：继续加载
			startLoading() 
		}
		
	}
}

/**
 * 当所有图片都加载完成时调用,如果某个图片加载错误将会跳过该图片
 * 
 * LOnAllComplete([img1,img2,img3,img4,img5],onCom)
 * 
 * function onCom()
 * {
 * }
 * 
 * @param {array} picArr	图片数组
 * @param {function} onComplete	全部加载完成
 * @param {function} onChildComplete	单个加载完成，参数1  ：原事件参数，参数2  ：当前完成数，参数3 ：队列总数
 * @param {function} onError	图片加载错误
 */
function lOnAllComplete (picArr,onComplete,onChildComplete,onError)
{
	var curLoadNum=0;//当前加载个数
	var totalPicNum=picArr.length//图片总数
	
	for (var i = 0; i < picArr.length; i++) 
	{
		//console.log(picArr[i].complete==false , picArr[i].src=="");
		if(picArr[i].complete==false || picArr[i].src=="")
		{
			//$(picArr[i]).load(p_onLoad)
			picArr[i].addEventListener("load",p_onLoad)
			picArr[i].onerror=p_onError
		}else{
			curLoadNum+=1
		}
	}
	
	checkComplete ()
	
	//单个图片完成加载
	function p_onLoad (e) {
		e.target.removeEventListener("load",p_onLoad)
		curLoadNum+=1
		
		if(onChildComplete !=undefined)
		{
			onChildComplete(e,curLoadNum,picArr.length)
		}
		
		checkComplete ()
	}
	
	//图片加载错误
	function p_onError () {
		if(onError !=undefined)
		{
			onError()
		}
		totalPicNum-=1;
		checkComplete ()
	}
	
	//检查是否完成队列
	function checkComplete () {
		if(curLoadNum==totalPicNum)
		{
			if(onComplete !=undefined)
			{
				onComplete()
			}
		}
	}
	
}

/**
 * 修改样式请修改lLoading.bgDiv（背景）及lLoading.squareDiv（圆角方块）
 * 
用法：
var lloading = lLoading()
lloading.style1()
lloading.showLoading()

lloading.bgDiv.style.background="rgba(0,0,0,0.4)"//背景色
lloading.circle.shape.style.stroke = "#f03d80"//圆圈颜色
lloading.circle.bgShape.style.stroke = "#980c3e"//圆圈底色
lloading.showLoading()//显示loading

属性：
bgDiv	背景
squareDiv	圆角方块
circle	loading圆
isShown	是否显示

方法：
style1()	白色底
style2()	黑色底
style3()	带有白色矩形的黑色底
showLoading()	显示loading
closeLoading()	关闭loading


 * 
 * @param {number} scale	按比例缩放(输入原屏幕尺寸如：640)
 * @param {object} circleParam	圆环参数
 */
function lLoading(scale,circleParam)
{
	var parent = document.body
	
	if(scale==undefined)
	{
		scale=640
	}
	
	var sc=1
	
	var lLoading = new Object()
	lLoading.isShown=true
	
	//主div
	lLoading.bgDiv = document.createElement("div")
	lLoading.bgDiv.style.position="fixed"
	lLoading.bgDiv.style.top = 0+"px";
	lLoading.bgDiv.style.left= 0+"px";
	lLoading.bgDiv.style.width = 100+"%";
	lLoading.bgDiv.style.height = 100+"%";
	
	lLoading.bgDiv.style.zIndex=100
	
	parent.appendChild(lLoading.bgDiv)
	
	//圆角方块
	lLoading.squareDiv = document.createElement("div")
	lLoading.squareDiv.style.position="absolute"
	lLoading.squareDiv.style.width = 200+"px";
	lLoading.squareDiv.style.height = 200+"px";
	lLoading.squareDiv.style.borderRadius=15+"px"
	lLoading.bgDiv.appendChild(lLoading.squareDiv)
	
	
	//显示/关闭	
	lLoading.showLoading =function()
	{
		
		if(lLoading.isShown==false)
		{
			
			lLoading.isShown=true
			lLoading.resize()
			TweenMax.set(lLoading.circle,{rotation:0})
			
			//播放圆圈动画
			lLoading.circle.play()
			
			//TweenMax.to(lLoading.circle,1,{rotation:360,repeat:-1,ease:Linear.easeNone})
			TweenMax.set(lLoading.bgDiv,{autoAlpha:1})
			parent.appendChild(lLoading.bgDiv)
			
		}
	}
	lLoading.closeLoading =function()
	{
		if(lLoading.isShown==true)
		{
			lLoading.isShown=false
			//停止圆圈动画
			lLoading.circle.stop()
			
			TweenMax.set(lLoading.bgDiv,{autoAlpha:0})
			//lRemoveChild(lLoading.bgDiv)
		}

	}
	
	//旋转的loaidng circle
	lLoading.circle = lLoadingCircle(lLoading.squareDiv,0,0,circleParam)
	lAlignByMarginAuto(lLoading.circle)
	
	lLoading.circle.style.pointerEvents="none"
	
	//对齐
	lLoading.resize=function()
	{
		if(scale!=undefined)
		{
			sc = lWindowRect().width/scale
			TweenMax.set(lLoading.squareDiv,{scale:sc,transformOrigin:"top left"})
		}

		
		lAlign(lLoading.squareDiv,lLoading.squareDiv.offsetWidth*sc,lLoading.squareDiv.offsetHeight*sc,lWindowRect(),5,5)
	}
	lLoading.resize()
	$(window).resize(lLoading.resize)
	
	//风格1
	lLoading.style1=function () 
	{
		lLoading.circle.shape.style.stroke="#fff"
		lLoading.circle.bgShape.style.stroke="rgba(0,0,0,0.3)"
		lLoading.squareDiv.style.background="rgba(0,0,0,0)"
		lLoading.bgDiv.style.background="rgba(255,255,255,0.3)";
	}
	
	lLoading.style2=function () 
	{
		lLoading.circle.shape.style.stroke="#fff"
		lLoading.circle.bgShape.style.stroke="rgba(255,255,255,0.3)"
		lLoading.squareDiv.style.background="rgba(0,0,0,0)"
		lLoading.bgDiv.style.background="rgba(0,0,0,0.5)";
	}

	lLoading.style3=function () 
	{
		lLoading.circle.shape.style.stroke="rgba(0,0,0,0.5)"
		lLoading.circle.bgShape.style.stroke="rgba(0,0,0,0.2)"
		lLoading.bgDiv.style.background="rgba(0,0,0,0.2)";
		lLoading.squareDiv.style.background="rgba(255,255,255,0.9)";
	}
	
	
	lLoading.closeLoading()
	
	lLoading.style1()
	
	return lLoading
}

/**
 * loading圆环
 * 
用法：
var lc = lLoadingCircle(mainDiv)

属性：
shape	loading图形1
bgShape	背景圆图形

方法：
play()	开始动画
stop()	停止动画

 * 
 * 
 * @param {object} parent	父级
 * @param {number} left	left
 * @param {number} top	top
 * @param {object} param	参数
 * @p-config {number} cR	圆半径
 * @p-config {number} strokeWidth	环宽度
 * @p-config {number} tTime	动画时间
 * @p-config {string} color	颜色
 * @p-config {string} bgColor	颜色2
 */
function lLoadingCircle (parent,left,top,param)
{
	var mainDiv = lDiv(parent,left,top,0,0)
	
	if(param==undefined) param=new Object
	
	if(param.cR==undefined) param.cR=30//圆半径
	if(param.strokeWidth==undefined) param.strokeWidth=10//环宽度
	if(param.tTime==undefined) param.tTime=1//动画时间
	if(param.color==undefined) param.color="#fff"//颜色
	if(param.bgColor==undefined) param.bgColor="rgba(0,0,0,0.2)"//颜色
	
	mainDiv.tileArr=[]//块数组
	mainDiv.tweenArr=[]//tween数组
	var i
	
	//是否支持svg,支持则用svg绘制
	if(lHasSVG())
	{
		var svgW=param.cR*2+param.strokeWidth
		var svgH=param.cR*2+param.strokeWidth
		
		var bgSvg = document.createElementNS("http://www.w3.org/2000/svg","svg")
		bgSvg.style.position="absolute"
		mainDiv.appendChild(bgSvg)
		bgSvg.setAttribute("width",svgW+"px")
		bgSvg.setAttribute("height",svgH+"px")
		
		var bgShape = document.createElementNS("http://www.w3.org/2000/svg","circle")
		bgShape.style.fill="none"
		bgShape.style.stroke=param.bgColor
		
		bgShape.style.strokeWidth=param.strokeWidth
		bgShape.style.strokeLinecap="round"
		
		bgShape.setAttribute("cx",svgW/2)
		bgShape.setAttribute("cy",svgH/2)
		bgShape.setAttribute("r",param.cR)
		bgSvg.appendChild(bgShape)
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
		svg.style.position="absolute"
		mainDiv.appendChild(svg)
		var svgW=param.cR*2+param.strokeWidth
		var svgH=param.cR*2+param.strokeWidth
		svg.setAttribute("width",svgW+"px")
		svg.setAttribute("height",svgH+"px")
		
		var shape = document.createElementNS("http://www.w3.org/2000/svg","circle")
		shape.style.fill="none"
		shape.style.stroke=param.color
		
		shape.style.strokeWidth=param.strokeWidth
		shape.style.strokeLinecap="round"
		shape.style.strokeDasharray="189.5px, 199.5px"
		shape.style.strokeDashoffset="132.6px"
		
		shape.setAttribute("cx",svgW/2)
		shape.setAttribute("cy",svgH/2)
		shape.setAttribute("r",param.cR)
		svg.appendChild(shape)
		
		svg.style.left=-svgW/2+"px"
		svg.style.top=-svgH/2+"px"
		bgSvg.style.left=-svgW/2+"px"
		bgSvg.style.top=-svgH/2+"px"
		
		//TweenMax.to(shape,0,{drawSVG:'0% 30%'})
		
	}else{
		
	}
	
	mainDiv.shape = shape
	mainDiv.bgShape = bgShape
	
	mainDiv.play=function () {
		TweenMax.to(svg,0,{rotation:0,transformOrigin:"50% 50%"})
		TweenMax.to(svg,param.tTime,{rotation:360,repeat:-1,transformOrigin:"50% 50%",ease:Power0.easeNone})
	}
	
	mainDiv.stop=function () {
		TweenMax.killTweensOf(svg)
		
	}
	
	return mainDiv
}


//其他=======================================================================================================================================

/**
 * 横屏提醒
 * @param {Function} onChange	当屏幕比例变为横屏时
 */
function lOrientationTip (onChange) 
{
	window.addEventListener("resize",onR)
	var windowRect
	var isHorizontal=false
	
	function onR (e) {
		windowRect = lWindowRect()
		//lDebug.log(["r",windowRect.width,windowRect.height])
		
		var curState = getState(windowRect)
		//if(isHorizontal!=curState)
		//{
			isHorizontal=curState
			
			//lDebug.log(["change",isHorizontal,windowRect.width,windowRect.height])
			if(onChange!=undefined)  onChange(isHorizontal)
		//}
	}
	
	//判断是否是横屏
	function getState (rect) {
		
		//console.log(800/600);4:3为1.3333
		if(rect.width/rect.height>=1.333)
		{
			return true
		}else{
			return false
		}
	}
	
}

/**
 * 摇一摇
 * 
lAddYao(function () {
	alert("摇动1次就删除")
})
 * 
 * @param {Function} onYao	当摇动时
 * @param {Boolean} once	调用1次就删除
 * @param {Number} speed	摇动力量
 */
function lAddYao (onYao,once,speed) {
	if (window.DeviceMotionEvent) {
		lRemoveYao()
		
		if(speed==undefined)	speed=30
		if(once==undefined)	once=true
		var yNum=0
		var x = y = z = lastX = lastY = lastZ = 0; //重置所有数值 
		
		window.lOnYao = function () {
			var acceleration = event.accelerationIncludingGravity; //将传感值赋给acceleration 
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			
			if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
				yNum+=1
				
				if(yNum>=3)
				{
					if(onYao!=undefined)
					{
						onYao()
						//alert(Math.abs(x - lastX)+" "+Math.abs(y - lastY))
					}
					
					//调用1次就删除
					if(once)	lRemoveYao()
					yNum=0
				}
				
			}else{
				yNum-=0.5
				yNum=lNumRange(yNum,0)
			}
			lastX = x;
			lastY = y;
			lastZ = z;
		}
		
		window.addEventListener('devicemotion', window.lOnYao,false);
	}
}
/**
 *	删除摇一摇 
 */
function lRemoveYao () {
	window.removeEventListener('devicemotion', window.lOnYao);
	window.lOnYao=undefined
}

/**
 * 复制obj
 * 
 * @param {object} tObj
 */
function lObjClone (tObj) 
{
	var rObj=new Object()
	for(var i in tObj)
	{
		rObj[i] = tObj[i]
	}
	
	return rObj
}

/*
 * 判断是否支持svg
 */
function lHasSVG()
{
	return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect; 
} 

/**
 * 判断是否是移动设备
 */
function lIsMobile() 
{
	var userAgent = lUserAgent()
	
	var result = true
	
	if(userAgent.indexOf("mobile")!=-1)
	{
		//移动设备
		result=true
	}else{
		
		try{
			result = "ontouchstart" in document
		}catch(e){
			result=false
		}
		
	}
	
	return result
}

/**
 * 通过TweenMax内部机制制作的enterframe
用法：
var tmEf = tweenMaxEf(onEf)
function onEf (e) {
	//e.dTime/30 计算出30毫秒的时间比例
	//如一个物体每30毫秒前进10像素，则当前帧移动的距离为10×(e.dTime/30)
	console.log(e.dTime/30,e.dTime,e.curTime,e.lastTime)
}
tmEf.start()

属性：
dTime	距离上一帧经过的时间
lastTime	上一帧的时间
curTime	当前时间
fNum	帧编号

方法：
stop()	停止
start()	开始

 * @param {Function} onEf
 */
function lTweenMaxEf (onEf) 
{
	var tObj={curTime:0}
	tObj.tween=TweenMax.to(tObj,1*999999999,{curTime:1000*999999999,onUpdate:onUpdate,ease:Power0.easeNone})
	tObj.lastTime=0
	tObj.dTime=0
	tObj.fNum=0
	
	function onUpdate () 
	{
		tObj.dTime=tObj.curTime-tObj.lastTime
		onEf(tObj)
		tObj.lastTime=tObj.curTime
		tObj.fNum++
	}
	
	tObj.stop=function () 
	{
		tObj.tween.pause()
		tObj.tween.seek(0)
	}
	tObj.start=function () 
	{
		tObj.curTime=0
		tObj.lastTime=0
		tObj.dTime=0
		tObj.fNum=0
		tObj.tween.seek(0)
		tObj.tween.play()
		
	}
	tObj.stop()
	
	return tObj
}

/**
 * 通过TweenMax内部机制制作的timer

用法：
	var ltimer = lTweenMaxTimer(10,onTimer,onCom)
	ltimer.start()//开始计时
	function onTimer (e) {
		//          时间格式化                                       当前时间      剩余时间
		console.log(lDateFormat(e.timeLeft,"ss.S"),e.curTime,e.timeLeft)
	}
	function onCom () {
		console.log("计时结束")
	}

属性：
dTime	距离上一帧经过的时间
lastTime	上一帧的时间
curTime	当前时间
totalTime	总时间
timeLeft	剩余时间
status	当前状态，状态有run,pause,stop 三种

方法：
stop()	停止(重置)
start()	开始
pause()	暂停


 * @param {Number} totalTime	总时间，单位为秒。如不传则默认999999999
 * @param {Function} onTimer	在计时运行时每帧触发
 * @param {Function} onComplete	时间结束时触发
 */
function lTweenMaxTimer (totalTime,onTimer,onComplete) 
{
	if(totalTime==undefined)
	{
		totalTime=999999999
	}
	
	var tObj={curTime:0}
	tObj.tween=TweenMax.to(tObj,1*totalTime,{curTime:1000*totalTime,onUpdate:onUpdate,onComplete:onCom,ease:Power0.easeNone})
	tObj.lastTime=0
	tObj.dTime=0
	tObj.totalTime=1000*totalTime;
	tObj.timeLeft = tObj.totalTime
	tObj.status = "run"
	
	function onCom () {
		if(onComplete!=undefined)	onComplete(tObj)
	}
	
	function onUpdate () 
	{
		tObj.timeLeft = tObj.totalTime-tObj.curTime
		tObj.dTime=tObj.curTime-tObj.lastTime
		if(onTimer!=undefined)	onTimer(tObj)
		tObj.lastTime=tObj.curTime
	}
	
	tObj.pause=function () 
	{
		tObj.status = "pause"
		tObj.tween.pause()
	}
	
	tObj.stop=function () 
	{
		tObj.status = "stop"
		tObj.tween.pause()
		tObj.tween.seek(0)
	}
	tObj.start=function () 
	{
		if(tObj.status == "stop")
		{
			tObj.curTime=0
			tObj.lastTime=0
			tObj.dTime=0
			tObj.tween.seek(0)
		}
		
		tObj.tween.play()
		tObj.status = "run"
	}
	
	tObj.stop()
	
	return tObj
}

/**
 * h5本地存储管理根据当前域名作为存储名称
 用法：
 var lstObj = lLocalStorage()
 console.log(lstObj.content)//当前域名保存的内容
 属性：
 content	当前域名保存的内容
 方法：
 loadLS()	读取保存的内容
 saveLS()	保存内容
 clear()	Delete内容
 */
function lLocalStorage () {
	var lstObj={}
	lstObj.localStName = window.location.host
	lstObj.content
	
	lstObj.loadLS = function () {
		if(window.localStorage)
		{
			//console.log("loadLS",localStName,window.localStorage[localStName],window.localStorage)
			if(window.localStorage[lstObj.localStName]!=undefined)
			{
				lstObj.content = JSON.parse(window.localStorage[lstObj.localStName])
			}
		}
	}
	
	lstObj.saveLS = function () {
		if(window.localStorage && lstObj.content!=undefined)
		{
			window.localStorage[lstObj.localStName] = JSON.stringify(lstObj.content)
		}
	}
	
	lstObj.clear = function () {
		window.localStorage.removeItem(lstObj.localStName)
		lstObj.content = undefined
	}
	
	lstObj.loadLS()
	
	return lstObj
}

var lDebug={}
lDebug.log=function(txt) {
	console.log(txt);
}


/**
用法：
	lDebugLog(mainDiv)
	lDebug.log("111")
	
 * @param {Object} p	父级
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
function lDebugLog (p,x,y,w,h) 
{
	if(w==undefined) w=640
	if(h==undefined) h=22*5
	var logDiv = lDiv(p,x,y,w,h)
	
	logDiv.style.webkitUserDrag=""
	
	var textArea = document.createElement("textarea")
	logDiv.appendChild(textArea)
	textArea.style.position="absolute"
	textArea.value="debugLog"
	textArea.style.width=w+"px"
	textArea.style.height=h+"px"
	textArea.style.background="rgba(0,0,0,0.3)"
	textArea.style.border="none"
	textArea.style.color="#fff"
	textArea.style.fontFamily = "Microsoft YaHei,Arial";
	textArea.style.fontSize=22+"px"
	
	var startY
	var startScrollTop
	var moveD
	logDiv.addEventListener("touchstart",function (e) {
		startY=e.touches[0].clientY
		startScrollTop = textArea.scrollTop
	})
	logDiv.addEventListener("touchmove",function (e) {
		moveD=startY-e.touches[0].clientY
		textArea.scrollTop=startScrollTop+moveD
		//console.log(e.touches[0].clientY-startY);
	})
	
	function log (txt) {
		textArea.value+="\n"+txt
		textArea.scrollTop=textArea.scrollHeight
		
		if(textArea.scrollHeight>=500)
		{
			textArea.value=textArea.value.substring(lDebug.textArea.value.indexOf("\n")+1)
		}
		
		//console.log(lDebug.textArea.scrollHeight);
		//console.log(lDebug.textArea.value.substring(lDebug.textArea.value.indexOf("\n")+1))
		
		console.log(txt);
	}
	
	lDebug.log = log
	
	lDebug.textArea = textArea
	logDiv.textArea = textArea
	
	return logDiv
}

/**
 * 初始化option
 * 
 用法：
		option = lInitOption(option)
		option.appP("fullScreen",false)//添加值
 * 
 * @param {Object} optionObj
 */
function lInitOption (optionObj) {
	if(optionObj==undefined)
	{
		optionObj={}
	}
	
	/**
	 * 添加属性
	 * @param {String} name	值名称
	 * @param {Object} dftP	默认值
	 */
	optionObj.appP=function(name,dftP)
	{
		if(this[name]==undefined)
		{
			this[name]=dftP
		}
	}
	return optionObj
}
