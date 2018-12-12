import CommonService from 'SERVICE/Common/index';

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
    let promise;
    if (name == 'BankName') { // 临时处理银行卡列表枚举值 by albert
        promise = new Promise(function (resolve, reject) {
            CommonService.getBankNameList({}).then((res) => {
                if (res.Data && res.Data.RecordList) {
                    let content = res.Data.RecordList.map((item) => {
                        return {
                            EnumValue: item.BankID + '',
                            EnumDesc: item.BankName
                        };
                    });
                    resolve(content);
                } else {
                    resolve([]);
                }
            }, function (error) {
                reject(error);
            });
        });
    } else {
        promise = new Promise(function (resolve, reject) {
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
    }

    return promise;
}

export default {
    getEnumMapByName
};