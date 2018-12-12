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
  // 获取会员归属拆分日志列表
  getSplitLogList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BK_RecruitSrv/WD_JJZX_LisRecit',
      params: params
    }, baseToDo);
  },
  // 查询认证和未认证会员
  getCertMember: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerUserCertInfo',
      params: params
    }, baseToDo, {needThrottleCheck: false});
  },
  // 拆分账号
  SplitAccount: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_SplitBrokerAccount',
      params: params
    }, baseToDo);
  },
  // 获取经纪人昵称
  getBrokerNicknameByAccount: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerNickNameByAccount',
      params: params
    }, baseToDo, {needThrottleCheck: false});
  }
};
