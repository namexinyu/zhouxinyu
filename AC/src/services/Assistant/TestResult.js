import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;


let baseToDo = {
  successDo: (res) => {
    return res;
  },
  errorDo: (res) => {
    // maybe you could dialog the res.message
    return res;
  }
};

let TestResult = {
  getMemberTestList: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BK_Exam/BK_STA_QryGroupUserList',
      params: params
    }, baseToDo);
  },

  GetBrokerDepartList: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BA_OverviewDailyWork/BA_GetDepartWithGroup',
      params: params
    }, baseToDo);
  },

  getFactoryTestList: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BK_Exam/BK_STA_QryGroupEntList',
      params: params
    }, baseToDo);
  },
  getMemberDetail: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BK_Exam/BK_STA_QryUserExamList',
      params: params
    }, baseToDo);
  },
  getFactoryDetail: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BK_Exam/BK_STA_QryEntExamList',
      params: params
    }, baseToDo);
  },
  getExamList: (params) => {
    return HttpRequest.post({
      url: API_URL + '/BK_Exam/BA_GetUnFamiliarList',
      params: params
    }, baseToDo);
  }

};
export default TestResult;
