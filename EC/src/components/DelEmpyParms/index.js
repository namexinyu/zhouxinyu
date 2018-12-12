import React from 'react';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
const HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
const HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;

function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}
function filterObject(obj, order) { // 删除空数据
    if(isArray(obj) == "Object") {
        var returnObj = {};
        for(let i in obj) {
            if(isArray(obj[i]) == "Object" && Object.keys(obj[i]).length == 0) {
                continue;
            }else if(isArray(obj[i]) == "Array" && obj[i].length == 0) {
                continue;
            }else{
                if(i == "HubIDList") {
                    if(isArray(obj[i]) == "String") {
                        returnObj[i] = [Number(obj[i])];
                    }else{
                        returnObj[i] = obj[i];
                    }
                }else if(obj[i]) {
                    if(typeof obj[i] === "string") {
                        returnObj[i] = obj[i].trim();
                    }else{
                        returnObj[i] = obj[i];
                    }
                }
            }
        }
        if(order) {
            returnObj.RecordIndex = 0;
            returnObj.RecordSize = 2000;
        }

        return returnObj;
    }
    return obj;
}

let fun = {
    "isArray": isArray,
    "filterObject": filterObject
};
export default fun;