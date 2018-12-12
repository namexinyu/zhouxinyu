import boot from 'ROUTE/boot';

import moment from 'moment';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import CONFIGURATION, {UTIL, env} from 'mams-com';
import QueryParam from "mams-com/lib/utils/base/QueryParam/index";

if (__DEV__)
    UTIL.Storage.sessionStorage('mams_business_session_login_info').putItems({
        "token": "ox7HASDE2fDgmB9TQ/x19tVN8fWmNyDf2rq1KIwojNM=",
        "accountList": "[{\"SalesID\":46,\"SalesName\":\"\"}]",
        "employeeId": 689,
        "accountName": "Erinluo",
        "loginTime": 1536824041026,
        "departmentName": "业务工作台"
    });
CONFIGURATION.initAppSessionStorage({
    LOGIN_INFO_SESSION_STORAGE: UTIL.Storage.sessionStorage('mams_business_session_login_info'),
    ENUM_MAPPING_SESSION_STORAGE: UTIL.Storage.sessionStorage('mams_business_session_enum_mapping')
});

CONFIGURATION.initGologinCallback((extraParam) => {
    let url = env.mams_url + '/login/index';
    window.location.href = QueryParam.setQueryParam(url, Object.assign({
        r: window.location.href
    }, (extraParam || {})));
});

CONFIGURATION.initEnvs({
    dev: {
        aliyun_api: 'http://139.224.170.14',
        api_url: 'http://139.224.170.14',
        mams_url: 'http://139.224.170.14:8090'
    }
});

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
    return window.isNaN(new Date(fmt)) ? '' : fmt;
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

// 一些自定义的文本
window.errorTitle = {
    normal: 'Sorry，出错了',
    funny: 'o(╥﹏╥)o服务器开小差了'
};

if (!window.Object.values) {
    window.Object.values = function (obj) {
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    };
}

if (!window.Object.entries) {
    Object.entries = function (obj) {
        let ownProps = Object.keys(obj);
        let i = ownProps.length;
        let resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}

// 挂载应用
boot(document.getElementById('app'));
