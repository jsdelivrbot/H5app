   

   function initEvent() {
       $('.callDurationBtn').on('click', function(e) {
           e.preventDefault();
           var ua = navigator.userAgent;
           if (ua.match(/ipad|ios|iphone/i)) {
               location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
           } else if (ua.match(/MicroMessenger/i)) {
               location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
           } else if (ua.match(/android/i)) {
               location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rrh.jdb';
           } else {
               location.href = 'http://www.jiedaibao.com/pcIndex.html';
           }
       })

   }
    initEvent();
   //下载借贷宝跳转问题

