import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};
export default {
    // 获取服务人员列表
    GetHubList: (params) => {
    return HttpRequest.post({
        url: env.api_url + '/Hub/WD_HUB_GetHubList',
        params: params
    }, baseToDo, {EmployeeMapID: true});
  }

};