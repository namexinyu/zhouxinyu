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
  getServiceStaffList: (params) => {
    return HttpRequest.post({
        url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborContact',
        params: params
    }, baseToDo, {EmployeeMapID: true});
  },
    // 增加服务人员
  addServiceStaff: (params) => {
    return HttpRequest.post({
      url: env.api_url + '/BZ_Labor/BZ_LABO_AddLaborContact',
      params: params
    }, baseToDo, {EmployeeMapID: true});
  },
  // 更新服务人员信息
  updateServiceStaff: (params) => {
    return HttpRequest.post({
        url: env.api_url + '/BZ_Labor/BZ_LABO_EditLaborContact',
        params: params
    }, baseToDo, {EmployeeMapID: true});
  },
  // 删除服务人员信息
  deleteServiceStaff: (params) => {
    return HttpRequest.post({
        url: env.api_url + '/BZ_Labor/BZ_LABO_DelLaborContact',
        params: params
    }, baseToDo, {EmployeeMapID: true});
  }

};