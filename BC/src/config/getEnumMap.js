import CommonService from 'SERVICE/Business/Common/index';
function getAllEnumMapping() {
    let promise = new Promise(function (resolve, reject) {
        if (window.EnumList && window.EnumCount) {
            resolve({
                list: window.EnumList,
                count: window.EnumCount
            });
        } else {
            CommonService.getCommonEnumMapping().then(function (res) {
                let list = res.Data.EnumList;
                let count = res.Data.Count;
                window.EnumList = list;
                window.EnumCount = count;
                resolve({
                    list: list,
                    count: count
                });
            }, function (error) {
                console.log(error);
                reject(error);
            });
        }

    });
    return promise;
}
function getEnumMapByName(name) {
    let promise = new Promise(function (resolve, reject) {
        getAllEnumMapping().then(function (res) {
            let list = res.list;
            let count = res.count;
            for (let i = 0; i < list.length; i++) {
                if (list[i].EnumName === name) {
                    resolve(list[i].EnumContent);
                }
            }
            resolve([]);
        }, function (error) {
            reject(error);
        });
    });
    return promise;
}

export default {
    getEnumMapByName
};