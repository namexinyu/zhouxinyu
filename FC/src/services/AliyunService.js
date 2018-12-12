import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};
let WDAliyunService = {
    // 获取委托列表
    getSercetKey: (params = {}) => {
        return HttpRequest.post({
            url: env.aliyun_api + '/Aliyun/WD_ALI_GetAliSTS',
            params: params
        }, baseToDo);
    }
};
export default WDAliyunService;