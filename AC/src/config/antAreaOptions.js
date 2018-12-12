import PCA from './PCA';

function translate(PCA) {
    let p = PCA.Province;
    let c = PCA.City;
    let a = PCA.Area;
    let result = [];
    for (let key in p) {
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
    return result;
}
export default translate(PCA);