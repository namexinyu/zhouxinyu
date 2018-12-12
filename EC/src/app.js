import boot from 'ROUTE/boot';

import moment from 'moment';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 在应用加载前，进行一些全局处理 增强对时间的处理

// Support Date format
window.Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[k])
                : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// Support money format from Number or String.
const FormatMoney = function (conf) {
    let opts = Object.assign({}, conf);
    let mn = parseFloat(this);
    if (isNaN(mn)) {
        return '';
    }
    if (opts.fixed && typeof opts.fixed === 'number') {
        mn = mn.toFixed(opts.fixed);
    }
    if (opts.comma) {
        let mstr = mn.toString();
        let ls = mstr.split('.')[0];
        let rs = mstr.split('.')[1] || '';
        let newArray = Array.from(ls).reverse();
        let newStr = '';
        for (let i = 0; i < newArray.length; i++) {
            newStr = newStr + (i > 0 && i % 3 === 0 ? ',' : '') + newArray[i];
        }
        mn = Array.from(newStr).reverse().join('') + (rs.length ? '.' : '') + rs;
    }
    return mn;
};
window.String.prototype.FormatMoney = FormatMoney;
window.Number.prototype.FormatMoney = FormatMoney;

let class2type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (e, i) {
    class2type["[object " + e + "]"] = e.toLowerCase();
});
function _typeof(obj) {
    if (obj == null) {
        return String(obj);
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[class2type.toString.call(obj)] || "object" :
        typeof obj;
}
window._typeof = _typeof;


// 挂载应用
boot(document.getElementById('app'));
