/**
 * Created by user on 2016/3/3.
 */
authObj.init({
    url: window.location.hostname + '/h5app/partials/targetPro/index.html' + window.location.search,
    bind_url: window.location.hostname + '/h5app/partials/targetPro/targetBind.html' + window.location.search,
    authorizer:'wechat'
});
authObj.codeMa('.getCode', '.ipt');
$(authObj.bind('.btn', '.ipt', '', '.yanzhengma'));
