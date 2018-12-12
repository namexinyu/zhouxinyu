import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;


let baseToDo = {
  successDo: (res) => {
    return res;
  },
  errorDo: (res) => {
    return res;
  }
};

export default {
  // 查询经纪人账号列表
  getAccountList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_SearchBrokerAccount',
      params: params
    }, baseToDo);
  },
  // 获取经纪人账号详情
  getAccountDetail: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerAccountDetail',
      params: params
    }, baseToDo);
  },
  // 新增经纪人账号
  newAccount: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_CreateBrokerAccount',
      params: params
    }, baseToDo);
  },
  // 更新经纪人账号
  updateAccount: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_EditBrokerAccount',
      params: params
    }, baseToDo);
  },
  // 激活/关停经纪人账号
  changeAccountStatus: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_StartStopAccount',
      params: params
    }, baseToDo);
  },
  // 获取经纪人段位信息
  getAccoutLevel: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerRankList',
      params: params
    }, baseToDo);
  },
  // 获取操作日志列表
  getOperationLogs: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_QueryBrokerOPLog',
      params: params
    }, baseToDo);
  }
};
