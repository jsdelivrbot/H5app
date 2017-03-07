/**
 * Created by user on 2016/3/3.
 */
    authObj.init({
        url: window.location.hostname + '/h5app/partials/targetPro/index.html' + window.location.search,
        bind_url: window.location.hostname + '/h5app/partials/targetPro/targetBind.html' + window.location.search,
        authorizer:'wechat'
    });
    $(authObj.checkAuth(
        function(res) {
            if(res.data.user_id) {
                alert('微信绑定成功！');
                $('body').css({
                    background:'#220',
                    color:'#f00',
                    fontSize:'30px'
                });

            };
    },
        window.location.hostname + '/h5app/partials/public/auth.html',
        window.location.hostname + '/h5app/partials/public/bind.html'
    ));
