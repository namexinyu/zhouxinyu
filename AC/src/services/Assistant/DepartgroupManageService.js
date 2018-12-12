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
  // 获取经纪中心部门列表
  getDepartmentList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerDepList',
      params: params
    }, baseToDo);
  },
  // 增加部门
  addDepartment: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_AddBrokerDepartment',
      params: params
    }, baseToDo);
  },
  // 修改部门
  updateDepartment: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_ModifyBrokerDepartment',
      params: params
    }, baseToDo);
  },
  // 获取经纪中心战队列表
  getGroupList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_GetBrokerTeamList',
      params: params
    }, baseToDo);
  },
  // 修改战队
  addGroup: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_AddBrokerTeam',
      params: params
    }, baseToDo);
  },
  // 修改战队
  updateGroup: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_BrokerManager/BA_BRMG_ModifyBrokerTeam',
      params: params
    }, baseToDo);
  }
};
