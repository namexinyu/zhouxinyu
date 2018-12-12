import TypeOf from 'UTIL/base/TypeOf';

const ObjectToArray = function (o) {
    let results = [];
    if (TypeOf(o) === 'object') {
        let entries = Object.entries(o);
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1] !== '') {
                let temp = {};
                temp[entries[i][0]] = entries[i][1];
                results.push(temp);
            }
        }
    }
    return results;
};

export default ObjectToArray;