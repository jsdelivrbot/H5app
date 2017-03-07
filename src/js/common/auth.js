/*authObj = {};
 提供了init、checkAtuth、bind、codeMa、_ajax等方法。
 */
/*一.初始化函数auth.init(params);
* 参数
* @param  {params} object      yes        初始化配置函数
params = {
    url:'业务页url',
    bind_url:'绑定借贷宝账号页url-手机号登陆页',
    authorizer:'wechat'
}；
demo：
authObj.init({
    url: window.location.hostname + 'url页面路径' + window.location.search,
    bind_url: window.location.hostname + 'bind_url页面路径' + window.location.search,
    authorizer:'wechat'
});*/
//  二.调用authObj.checkAuth(callback, url,bindUrl);
/**
 * [authObj.checkAuth ]
 * 请求参数
 * @param  {Function} callback      yes         [绑定成功后的回调，可谓空函数]
 * @param  {string}   checkUrl      yes        [业务页url]
 * @param  {string}   bindUrl       yes        [绑定借贷宝账号页url-手机号登陆页]
 */
/*1.返回参数：
绑定成功回调函数：callback
{
    "error": {
    "returnCode": 0,
        "returnMessage": "成功",
        "returnUserMessage": "成功"
},
    "data":{
    "user_id":"xxx",//用户在借贷宝的id，未绑定账号时返回null
},
}
2.判断授权成功
jiedaibao.com域名下的cookie存在
outer_open_id；
auth_token；字段
3.判断绑定成功函数*/
//demo :
/*
authObj.checkAuth(
    function (res) {
        if(!!res.data.user_id) {
            alert('绑定成功！')
        }
    },
    window.location.hostname + 'url页面路径',
    window.location.hostname + 'bind_url页面路径'
);
*/

// 三.调用auth.codeMa(codeBtn,codeInput，event)
/* @param  {string}   codeBtn           no                 [获取验证码按钮]
* @param  {string}   event             no                 [事件名称默认'click'，可空]
* @param  {string}   codeInput         yes                [输入框: ‘#codeInput’  验证码输入框类名]
PS：默认点击事件获取验证码；
demo：*/
//authObj.codeMa('.getCode', '.ipt');
// 四.调用authObj.bind(bindDom, inputDom，event,codeInput);
/**
 * [authObj.bind ]
 * @param  {string}   bindDom           yes                [选择器如：’#btn’    checkAuth回调]
 * @param  {string}   inputDom          yes                [输入框: ‘#ipt’   绑定input value的id或类名]
 * @param  {string}   event             no                 [事件名称默认'click']
 * @param  {string}   codeInput         yes                [输入框: ‘#codeInput’  验证码输入框类名]
 */
    //demo :
//authObj.bind('.btn', '.ipt', '', '.yanzhengma')
    // 五. authObj._ajax(ajaxApi,params,errorCallBack,successCallBack,type);
/** @param  {string}       ajaxApi                 yes                [请求url]
* @param  {object}       params                  yes                [请求参数，可空 ：{}]
* @param  {Function}     errorCallBack           no                 [error回调函数]
* @param  {Function}     successCallBack         no                 [success回调函数]
* @param  {string}       type                    no                 [请求类型，可不写，默认'post']*/
// 此ajax封装了微信中的跨域问题需要添加的参数；
   /* xhrFields: {
        withCredentials: true
    },
    crossDomain: true,*/
    // 后端的要设置相应的参数：
  /*  header("Access-Control-Allow-Credentials: true");
      header("Access-Control-Allow-Origin: http://www.xxx.com")*/
/*Api 依赖接口 server.json
* {{sendVerifyCodeApi}}
* {{authApi}}
* {{getInfoApi}}
* {{bindApi}}
* */
var authObj = {
    //是否初始化
    initStatus:0,
    // 手机号校验开关   0 关闭; 1 打开
    openBtn:1,
    // 验证码开关
    code:0,
    // 配置参数
    params:{
        "outer_open_id":"",
        "jdb_mobile":"",
        "auth_token":"",
        "authorizer":"wechat",
        "url":"",
        "bind_url":"",
        "codeMa":"",
        "advancedPermission":false
    },
    //存储url参数
    storageUrl:{

    },
    // 读取cookies
    init:function (obj){
        // url ,bind_url, authorizer默认wechat;
        /*
        *  obj = {
        *   url:"",  yes
        *   bind_url:"", yes
        *   authorizer："wechat" yes
        *  }
        * */
        if(!obj.url || !obj.bind_url ||!obj.authorizer) {
             toastError('初始化失败！');
            authObj.initStatus = 0;
        } else {
            authObj.initStatus = 1;
            authObj.params = $.extend({}, authObj.params, obj);
        }

    },
    _doCookies:function (url,bindUrl) {
        var outer_open_id = $.fn.cookie('outer_open_id')|| '';
        var jdb_mobile = $.fn.cookie('jdb_mobile') ||'';
        var auth_token = $.fn.cookie('auth_token') ||'';
        var objParams = {
            "outer_open_id":outer_open_id,
            "jdb_mobile":jdb_mobile,
            "auth_token":auth_token,
            "url":url,
            "bind_url":bindUrl
        };
        authObj.params = $.extend({}, authObj.params, objParams);
    },
    Counttime:function (waitTime, o, _this) {
        if (waitTime == 0) {
            _this.removeAttribute("disabled");
            _this.innerHTML="获取验证码";
            waitTime = 60;
            authObj.code = 0;

        } else {
            _this.setAttribute("disabled", true);
            _this.innerHTML= waitTime + "s后重发";
            waitTime--;
            authObj.code = 1;

            setTimeout(function() {
                authObj.Counttime(waitTime, o, _this);
            },1000)
        }
    },
    codeMa:function (getCode,phoneNum,clickEvent) {
         if(!authObj.initStatus) {
             toastError('初始化失败！');
             return;
         }
        var clickEvent = clickEvent ||'click';
        var waitTime = 60;
        var Dom = $(getCode);
        Dom.on(clickEvent, function () {
            var _this = this;
            var val =$(phoneNum).val();
            var regmoblie = $.trim(val.replace(/\s/g,""));
            authObj._mobileCheck(val);
            if (authObj.openBtn!=0) {
                authObj.Counttime(waitTime, Dom, _this);
                authObj._ajax(
                    '{{sendVerifyCodeApi}}',
                    {
                        "mobile":regmoblie,
                        "authorizer":"wechat",
                        "type":"thirdbind"
                    },
                    function () {
                        jdb.hideLoading();
                    },
                    function (res, callBack) {
                        //authObj._recodeCheck(res, callBack)
                    })
            };

        });
    },
    auth:function (url,bind_url,authorizer) {
        var url = encodeURIComponent(url);
        var bind_url = encodeURIComponent(bind_url);
        window.location.href = 'http://tradeapi.jiedaibao.com.cn/mybankv21/phppassport/v2/passport/outer/auth?url=' + url +'&bind_url=' + bind_url + '&authorizer=wechat'
    },
    // 初始化 授权请求
    checkAuth:function (callBack,url,bindUrl) {
        if(!authObj.initStatus) {
            toastError('初始化失败！');
            return;
        }
        authObj._doCookies(url,bindUrl);
        authObj._extend(url,bindUrl);
        authObj._authFun(callBack);
    },
    _ajax:function (ajaxApi,params,errorCallBack,successCallBack,_type) {
        var type = _type ||'post';
        $.ajax({
            url:ajaxApi,
            dataType:'json',
            data:params,
            async : false,
            type: type,
            error:errorCallBack,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:successCallBack
        })
    },
    // 检查Auth函数
    _authFun: function (callBack) {
        authObj._ajax(
            '{{authApi}}',
            authObj.params,
            function () {
                jdb.hideLoading();
                return false;
            },
            function (res) {
                //authObj._recodeCheck(res, callBack)
                if(res.error.returnCode == 503108) {

                    if(!!res.data && !!res.data.redirect_url){
                        window.location.href = res.data.redirect_url;
                    }else {
                        $(authObj.auth( authObj.params.url, authObj.params.bind_url))
                    }
                }
                else if (res.error.returnCode == 503109) {
                    if(authObj.params.advancedPermission){
                        callBack(res);
                    }else if(!!res.data && !!res.data.redirect_url){
                        window.location.href = res.data.redirect_url;
                    }else {
                        $(authObj.auth( authObj.params.url, authObj.params.bind_url));
                    }
                }
                else if (res.error.returnCode == 0) {
                    if(!!res.data && !!res.data.redirect_url)  {
                        window.location.href = res.data.redirect_url;
                    }
                    else if(!!callBack && typeof callBack == "function") {
                        callBack( res );
                    }
                }
                else {
                    if(!res.error.returnUserMessage) {
                        toastError(res.error.returnUserMessage);
                    } else {
                        toastError('服务器错误！');
                    };
                    return false;
                } ;
            },'get')
    },
    _recodeCheck: function (res, callBack) {
        if(res.error.returnCode == 503108) {
                     if(!!res.data && !!res.data.redirect_url){
                         window.location.href = res.data.redirect_url;
                     }else {
                         $(authObj.auth( authObj.params.url, authObj.params.bind_url))
                     }
        }
        else if (res.error.returnCode == 503109) {
                     if(!!res.data && !!res.data.redirect_url){
                         window.location.href = res.data.redirect_url;
                     }else {
                         $(authObj.auth( authObj.params.url, authObj.params.bind_url));
                     }
        }
        else if (res.error.returnCode == 0) {
                     if(!!res.data && !!res.data.redirect_url)  {
                         window.location.href = res.data.redirect_url;
                     }
                     else if(!!callBack && typeof callBack == "function") {
                         callBack( res );
                     }
        }
        else {
                // if(!res.error.returnUserMessage) {
                //     toastError(res.error.returnUserMessage);
                // } else {
                    toastError(res.error.returnUserMessage);
                //};
                    return false;
        } ;
    },
    bind:function (domBind,valueClass,clickEvent,code,callBack) {
        if(!authObj.initStatus) {
            toastError('初始化失败！');
            return;
        }
        var clickEvent = clickEvent ||'click';
        var domBind = $(domBind);
        $(domBind).on(clickEvent, function (){
            var valpramas =$(valueClass).val();
            var codeVal =$(code).val();
            var outer_open_id = $.fn.cookie('outer_open_id')||'';
            var jdb_mobile = $.fn.cookie('jdb_mobile')||'';
            var auth_token = $.fn.cookie('auth_token')||'';
            var urlTt = url('?url') || '';
              valpramas = $.trim(valpramas.replace(/\s/g,""));
            // 获取验证码
           // authObj.codeMa(valpramas);
            authObj._mobileCheck(valpramas);

            // 检验验证码是否为数字
            if (typeof +codeVal != 'number' || +codeVal != +codeVal){
                authObj.openBtn = 0;
                toastError('请输入正确的验证码！')
            }else {
                authObj.openBtn = 1;
            };

            // 判断验证、手机开关
            if(authObj.openBtn ){
                authObj._ajax(
                    '{{bindApi}}',
                    {
                        "mobile":valpramas,
                        "url":urlTt,
                        "code":codeVal,
                        "authorizer":"wechat"
                    },
                    function () {
                        jdb.hideLoading();
                    },
                    function (res) {
                        authObj._recodeCheck(res, callBack);
                    })
            }
        });
    },
    _mobileCheck:function (moblie) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        var regmoblie = $.trim(moblie.replace(/\s/g,""));
        if(!!regmoblie){
            if (!reg.test(regmoblie ) ){
                toastError('手机号码有误，请重填!')
                authObj.openBtn = 0;
            } else {
                authObj.openBtn = 1;
            }
        }else{
            toastError('手机号不能为空')
        };

    },
    getInfo:function (callBack) {
        authObj._ajax(
            '{{getInfoApi}}',
            {
                "authorizer":'wechat'
            },
            function () {
                jdb.hideLoading();
            },
            function (res) {
                authObj._recodeCheck(res, callBack)
            })
    },
    //扩展url地址,可以传参;
    _extend:function (url,bindUrl){
        var url = url || '';
        var bindUrl = bindUrl || '';
        var urlParams = {
            "url":url,
            "bind_url":bindUrl
        };
        authObj.params = $.extend({}, authObj.params, urlParams)
    }
};
