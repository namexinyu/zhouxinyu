import PCA from './PCA';

function translate(PCA) {
    let p = PCA.Province;
    let ps = PCA.ProvinceSort;
    let c = PCA.City;
    let a = PCA.Area;
    let result = [];
    for (let key of ps) {
        for (let skey in c) {
            if (key == skey) {
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
                        });
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
    if (result.length > 0) {
        let sz_index = result[0].children.findIndex((v, i) => v.label.indexOf('苏州') > -1);
        if (sz_index == -1) return;
        let sz_item = result[0].children[sz_index];
        result[0].children.splice(sz_index, 1);
        result[0].children.splice(0, 0, sz_item);
    }
    return result;
}
export default translate(PCA);