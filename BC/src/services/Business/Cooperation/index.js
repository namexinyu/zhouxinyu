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
    // 获取商务合作列表
  getCooperationList: (params) => {
    return HttpRequest.post({
        url: env.api_url + '/BK_Event/WD_QryBSCNList',
        params: params
    }, baseToDo, {EmployeeMapID: true});
  },
  // 获取商务合作详情
  getCooperationDetail: (params) => {
    return HttpRequest.post({
      url: env.api_url + '/BK_Event/WD_QryBSCNDetail',
      params: params
    }, baseToDo, {EmployeeMapID: true});
  },
  // 商务合作回访记录
  updateCooperationInfo: (params) => {
    return HttpRequest.post({
      url: env.api_url + '/BK_Event/WD_ModifyBSCN',
      params: params
    }, baseToDo, {EmployeeMapID: true});
  }
};