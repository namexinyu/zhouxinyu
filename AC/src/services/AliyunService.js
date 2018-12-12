import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.aliyun_api;

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
            url: API_URL + '/Aliyun/WD_ALI_GetAliSTS',
            params: params
        }, baseToDo);
    }
};
export default WDAliyunService;