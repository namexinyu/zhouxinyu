function getProvinceList(ChArea) {
    let result = {};
    for (let key in ChArea) {
        if (key.toString().substr(2, 4) === '0000') {
            result[key] = ChArea[key];
        }
    }
    return result;
}

function getCityList(ChArea, Province) {
    let result = {};
    for (let key in Province) {
        result[key] = {};
        for (let skey in ChArea) {
            if (key.toString().substr(0, 2) === skey.toString().substr(0, 2) && skey.toString().substr(4, 2) === '00' && skey.toString().substr(2, 4) !== '0000') {
                result[key][skey] = ChArea[skey];
            }
        }
        if (!Object.keys(result[key]).length) {
            result[key][key] = ChArea[key];
        }
    }
    return result;
}

function getAreaList(ChArea, City) {
    let result = {};
    for (let key in City) {
        let sc = City[key];
        for (let sk in sc) {
            result[sk] = {};
            for (let ss in ChArea) {
                if (sk.toString().substr(0, 4) === ss.toString().substr(0, 4) && ss.toString().substr(4, 2) !== '00' || (sk.toString().substr(2, 4) === '0000' && sk.toString().substr(0, 2) === ss.toString().substr(0, 2) && ss.toString().substr(4, 2) !== '00')) {
                    result[sk][ss] = ChArea[ss];
                }
            }
            if (!Object.keys(result[sk]).length) {
                result[sk][sk] = ChArea[sk];
            }
        }
    }
    return result;
}

function translateAntOptions(p, c, a) {
    let result = [];
    for (let key in p) {
        for (let skey in c) {
            if (key = skey) {
                let ca = [];
                for (let ss in c[skey]) {
                    ca.push({
                        value: ss,
                        label: c[skey][ss]
                    });
                }
                for (let i = 0; i < ca.length; i++) {
                    let kk = ca[i].value;
                    let ao = a[kk];
                    ca[i].children = [];
                    for (let sa in ao) {
                        ca[i].children.push({
                            value: sa,
                            label: ao[sa]
                        })
                    }
                }
                result.push({
                    value: key,
                    label: p[key],
                    children: ca
                });
            }
        }
    }
    return result;
}
export default {
    getProvinceList,
    getCityList,
    getAreaList,
    translateAntOptions
};