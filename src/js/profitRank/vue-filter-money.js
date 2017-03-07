/**
 * 金钱展示filter
 * 金钱值为分，例如 342.22元，入参应为: 34222
 */
Vue.filter('formatMoney', function(value, type, fixedNum) {
    var TEN_THOUSAND = 10000;
    var TEN_THOUSAND_UNIT = '万';
    var HUNDRED_MILLION = 100000000;
    var HUNDRED_MILLION_UNIT = '亿'

    function number2Str(value) {
        return ('' + value).replace(/[^(\d.)]*/g, '')
            .split('').reverse().join('')
            .replace(/(\d{3})(?=\d)/g, '$1,')
            .split('').reverse().join('');
    }
    fixedNum = fixedNum || 2;
    type = type || 'full';
    value = +value;
    if (isNaN(value)) {
        return '--.--';
    } else {
        // value统一单位是分，按分进行转换
        value = (value / 100).toFixed(2);
        if (type === 'full') {
            return number2Str(value);
        } else if (type === 'short') {
            if (value < TEN_THOUSAND) {
                return number2Str(value);
            } else if (value < HUNDRED_MILLION) {
                return number2Str((value / TEN_THOUSAND).toFixed(1)) + TEN_THOUSAND_UNIT;
            } else {
                return number2Str((value / HUNDRED_MILLION).toFixed(1)) + HUNDRED_MILLION_UNIT;
            }
        } else {
            throw new Error('Wrong formatMoney type');
        }
    }
});
