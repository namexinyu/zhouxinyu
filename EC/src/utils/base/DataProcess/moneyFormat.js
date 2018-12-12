let defaults = {
    fixed: 2,
    comma: true
};
let moneyFormat = function (money, conf) {
    let opts = Object.assign({}, conf);
    let mn = parseFloat(money);
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

export default moneyFormat;