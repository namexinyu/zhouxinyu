export default {
    queryArray: function (queryObj, opts) {
        let result = [];
        for (let key in queryObj) {
            if (queryObj[key] !== '' && queryObj[key] !== undefined && queryObj[key] !== null) {
                result.push({
                    Key: key,
                    Value: queryObj[key]
                });
            }
        }
        return result;
    },
    query: function (queryObj, opts) {
        for (let key in queryObj) {
            if (queryObj[key] === '' || queryObj[key] === undefined || queryObj[key] === null) {
                delete queryObj[key];
            }
        }
        return queryObj;
    },
    orderArray: function (orderObj, opts) {
        let result = [];
        for (let key in orderObj) {
            if (opts.antd) {
                if (orderObj[key] === 'descend') {
                    result.push({
                        Key: key,
                        Order: 1
                    });
                }
                if (orderObj[key] === 'ascend') {
                    result.push({
                        Key: key,
                        Order: 2
                    });
                }
            } else {
                if (orderObj[key] !== '' && orderObj[key] !== undefined && orderObj[key] !== null) {
                    result.push({
                        Key: key,
                        Order: orderObj[key]
                    });
                }
            }

        }
        return result;
    },
    order: function (orderObj, opts) {
        for (let key in orderObj) {
            if (opts.antd) {
                if (orderObj[key] === 'descend') {
                    orderObj[key] = 1;
                }
                if (orderObj[key] === 'ascend') {
                    orderObj[key] = 2;
                }
                if (orderObj[key] === false) {
                    delete orderObj[key];
                }
            } else {
                if (orderObj[key] === '' || orderObj[key] === undefined || orderObj[key] === null) {
                    delete orderObj[key];
                }
            }

        }
        return orderObj;
    }
};