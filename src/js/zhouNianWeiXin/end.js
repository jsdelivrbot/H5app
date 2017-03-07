/**
 * Created by zlei on 2016/8/3.
 */
var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') >= 0;
document.addEventListener('touchmove',function(e){
    e.preventDefault();
});
var myH=$(window).height(),myInterval,time=0;

var page_back,page_btn,page_downBtn;
var body=document.body;
var page_1,page_1_txt1,page_1_txt2,page_1_txt3,page_1_back;
var page_2,page_2_txt1,page_2_txt2,page_2_txt3,page_2_back;
var page_3,page_3_txt1,page_3_txt2,page_3_txt3,page_3_txt4,page_3_txt5,page_3_qr,page_3_back1,page_3_back2,page_3_back3,page_3_back4,page_3_back5,page_3_back6;
var endPage=document.getElementById("end");
var now= 1,tempPage,deltaNum;
window.onload=function() {
    myInterval= setInterval(function(){
        time+=1;
        if(time>3){
            clearInterval(myInterval);
            loadImg();
        }
        $('#load-bar span').html(time+ "%");
    },150+250*Math.random());
};


var imgNum =0;
function  loadImg(){
    $.imgpreload(assets,
        {
            each: function () {
                var status = $(this).data('loaded') ? 'success' : 'error';
                if (status == "success") {
                    var v = (parseFloat(++imgNum) / assets.length).toFixed(2);
                    $('#load-bar span').html(Math.round(v * 100) + "%");
                }
            },
            all: function () {
                loadEnd();
            }
        });
}

function loadEnd(){
    $('#load-bar span').html("100%");
    $(".loading").fadeOut();
    setStage();
   showEndPage();
}





function setStage(){

    page_back=new lImg("../../img/zhouNianWeiXin/back.gif",endPage,0,0,640);

    page_1=new lDiv(endPage,0,0,640,1138,"",true);
    page_1_back=new lImg("../../img/zhouNianWeiXin/img_1.png",page_1,315,myH-828,325);
    page_1_back.hide();

    page_1_txt1=new lImg("../../img/zhouNianWeiXin/page_1Txt_1.png",page_1,42,66,399);
    page_1_txt1.hide();
    page_1_txt2=new lImg("../../img/zhouNianWeiXin/page_1Txt_2.png",page_1,42,413,265);
    page_1_txt2.hide();
    page_1_txt3=new lImg("../../img/zhouNianWeiXin/page_1Txt_3.png",page_1,42,645,266);
    page_1_txt3.hide();

    //-------------------------------------------------------------
    page_2=new lDiv(endPage,0,0,640,1138,"",true);

    page_2_txt1=new lImg("../../img/zhouNianWeiXin/page_2Txt_1.png",page_2,38,61,563);
    page_2_txt1.hide();
    page_2_txt2=new lImg("../../img/zhouNianWeiXin/page_2Txt_2.png",page_2,355,370,247);
    page_2_txt2.hide();
    page_2_txt3=new lImg("../../img/zhouNianWeiXin/page_2Txt_3.png",page_2,355,610,248);
    page_2_txt3.hide()
    page_2_back=new lImg("../../img/zhouNianWeiXin/img_2.png",page_2,0,myH-725,343);
    page_2_back.hide();
    //-------------------------------------------------------------

    page_3=new lDiv(endPage,0,0,640,1138,"",true);


    page_3_back1=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-100,myH-480,104);
    page_3_back1.hide();
    page_3_back2=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-100,myH-150,104);
    page_3_back2.hide();
    page_3_back3=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-100,myH-282,104);
    page_3_back3.hide();
    page_3_back4=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-120,myH-352,60);
    page_3_back4.hide();
    page_3_back5=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-120,myH-412,50);
    page_3_back5.hide();
    page_3_back6=new lImg("../../img/zhouNianWeiXin/img_5.png",page_3,-120,myH-310,70);
    page_3_back6.hide();

    page_3_txt1=new lImg("../../img/zhouNianWeiXin/page_3Txt_1.png",page_3,30,57,581);
    page_3_txt1.hide();
    page_3_txt2=new lImg("../../img/zhouNianWeiXin/page_3Txt_2.png",page_3,37,237,573);
    page_3_txt2.hide();
    page_3_txt3=new lImg("../../img/zhouNianWeiXin/page_3Txt_3.png",page_3,37,350,572);
    page_3_txt3.hide();
    page_3_txt4=new lImg("../../img/zhouNianWeiXin/page_3Txt_4.png",page_3,37,431,472);
    page_3_txt4.hide();




    page_3_txt5=new lImg("../../img/zhouNianWeiXin/page_3Txt_5.png",page_3,137,myH-147,373);
    page_3_txt5.hide();


    TweenMax.to(page_3_back1,2,{x:800,y:"-=140",repeat:-1,delay:1});
    TweenMax.to(page_3_back2,2,{x:800,y:"-=140",repeat:-1,delay:2.5});
    TweenMax.to(page_3_back3,2,{x:800,y:"-=140",repeat:-1});
    TweenMax.to(page_3_back4,2,{x:800,y:"-=180",repeat:-1,delay:.5});
    TweenMax.to(page_3_back5,2,{x:800,y:"-=120",repeat:-1,delay:1.2});
    TweenMax.to(page_3_back6,2,{x:800,y:"-=120",repeat:-1,delay:1.5});


    page_downBtn=new lImg("../../img/zhouNianWeiXin/btn_2.png",endPage,282,myH-60,90,57);
    TweenMax.to(page_downBtn,0.4,{y:-20,yoyo:true,repeat:-1});

    page_btn = lCreateElm("img",endPage,0,myH-760,640);
    page_btn.src="../../img/zhouNianWeiXin/img_qr.png";
    // window.track = page_btn;
    page_btn.addEventListener('touchstart', function() {
        page_btn.track = setTimeout(function() {
            _hmt.push(['_trackEvent', '周年微信长按二维码', '长按一秒']);
        }, 800);
    });

    page_btn.addEventListener('touchend', function() {
        clearTimeout(page_btn.track);
    });
    //page_btn=new lImg("../../img/zhouNianWeiXin/img_qr.png",body,0,myH-560,640);
    //page_btn.hide();
  /*  lBtn(page_btn,function () {
        //下载借贷宝
        lNavToUrlWithFillout("http://jdb.jiudingcapital.com/download.html?from=zhitou1");
    });*/
    //-------------------------------------------------------------
    TweenMax.to(page_btn,0,{autoAlpha:0});
    page_downBtn.hide();
    page_back.hide();
    page_1.hide();
    page_2.hide();
    page_3.hide();
}




var pageN;
function gotopage(txt){
    if(txt=="UP"){
        now--
    }else{
        now++
    }
    if(now<=0){
        now=1;
    }else if(now>=4){
        now=3
    }else{
        gotoPageNnm(now);
    }
}
function showEndPage(){

    pageN = new TimelineMax({repeat:-0,paused:true});
    pageN.to(page_1_txt1,0,{scaleX:"+=2.3",scaleY:"+=2.3",autoAlpha:0});
    pageN.to(page_1_txt2,0,{y:"+=100",autoAlpha:0});
    pageN.to(page_1_txt3,0,{y:"+=100",autoAlpha:0});
    pageN.to(page_1_back,0,{y:"+=100",autoAlpha:0});

    pageN.to(page_1,1,{autoAlpha:1},"-=0.3");
    pageN.to(page_1_txt1,1,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeInOut},"-=0.7");
    pageN.to(page_1_back,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.2");

    pageN.to(page_1_txt2,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.3");
    pageN.to(page_1_txt3,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");
    pageN.to(page_downBtn,1,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
    tempPage=page_1;
    pageN.play();
    page_back.show();

    body.addEventListener('touchstart', function(event) {
        if(touchOff){
            touchOff=false;
            deltaNum = event.targetTouches[0].clientY;
            body.addEventListener('touchmove', touchMove);
            TweenMax.delayedCall(1,function(){
                touchOff=true;
            })
        }
    }, false);
    function touchMove(event){
        var tempNum = event.targetTouches[0].clientY;
        if(Math.abs(tempNum-deltaNum)>30){
            if(tempNum<deltaNum){
                gotopage("DOWN");
            }else{
                gotopage("UP");
            }
            body.removeEventListener('touchmove',touchMove)
        }
    }

}
var touchOff=true;

function gotoPageNnm(num){
   TweenMax.to(tempPage,0.4,{autoAlpha:0});
    switch (num)
    {
        case 1:

            pageN = new TimelineMax({repeat:-0,paused:true});
            pageN.to(page_1_txt1,0,{scaleX:"+=2.3",scaleY:"+=2.3",autoAlpha:0});
            pageN.to(page_1_txt2,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_1_txt3,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_1_back,0,{y:"+=100",autoAlpha:0});

            pageN.to(page_1,1,{autoAlpha:1},"-=0.3");
            pageN.to(page_1_txt1,1,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeInOut},"-=0.7");
            pageN.to(page_1_back,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.2");

            pageN.to(page_1_txt2,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.3");
            pageN.to(page_1_txt3,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            tempPage=page_1;
            pageN.play();
            break;
        case 2:
            TweenMax.to(page_btn,.5,{autoAlpha:0});
            TweenMax.to(page_downBtn,1,{autoAlpha:1});
            pageN = new TimelineMax({repeat:-0,paused:true});
            pageN.to(page_2_txt1,0,{scaleX:"+=2.3",scaleY:"+=2.3",autoAlpha:0});

            pageN.to(page_2_txt2,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_2_txt3,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_2_back,0,{y:"+=100",autoAlpha:0});

            pageN.to(page_2,1,{autoAlpha:1},"-=0.3");
            pageN.to(page_2_txt1,1,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeInOut},"-=0.7");
            pageN.to(page_2_back,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.2");
            pageN.to(page_2_txt2,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.3");
            pageN.to(page_2_txt3,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            tempPage=page_2;
            pageN.play();
            break;
        case 3:
            TweenMax.to(page_downBtn,1,{autoAlpha:0});
            pageN = new TimelineMax({repeat:-0,paused:true});
            pageN.to(page_3_txt1,0,{scaleX:"+=2.3",scaleY:"+=2.3",autoAlpha:0});
            pageN.to(page_3_txt2,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_3_txt3,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_3_txt4,0,{y:"+=100",autoAlpha:0});
            pageN.to(page_3_txt5,0,{y:"+=100",autoAlpha:0});


            pageN.to(page_3_back1,0,{autoAlpha:0});
            pageN.to(page_3_back2,0,{autoAlpha:0});
            pageN.to(page_3_back3,0,{autoAlpha:0});
            pageN.to(page_3_back4,0,{autoAlpha:0});
            pageN.to(page_3_back5,0,{autoAlpha:0});
            pageN.to(page_3_back6,0,{autoAlpha:0});

            pageN.to(page_btn,0,{y:"+=100",autoAlpha:0});

            pageN.to(page_3,1,{autoAlpha:1},"-=0.3");
            pageN.to(page_3_txt1,1,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeInOut},"-=0.7");

            pageN.to(page_3_txt2,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.1");
            pageN.to(page_3_txt3,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_txt4,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");

            pageN.to(page_btn,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_txt5,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7");

            pageN.to(page_3_back1,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_back2,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_back3,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_back4,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_back5,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");
            pageN.to(page_3_back6,.5,{autoAlpha:1,ease:Power4.easeOut},"-=0.7");


            tempPage=page_3;
            pageN.play();
            break;
    }

}