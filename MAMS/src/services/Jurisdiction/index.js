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
let Service = {
    // 菜单资源列表
    getListMyResource: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/MenuList',
            params: params
        }, baseToDo);
    },
    // 获取员工列表
    getListResourceGives: (params) => {
        return HttpRequest.post({
          url: API_URL + '/AccessControl/GetTypeEmployeeList',
          params: params 
      }, baseToDo);
    },
    // 增加菜单资源
    getCreateResource: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/MenuAdd',
            params: params
        }, baseToDo);
    },
    // 删除菜单资源
    getDeleteResource: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/MenuDelete',
            params: params
        }, baseToDo);
    },
    // 批量员工授权
    getGiveResource: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/AddEmployeesResources',
            params: params
        }, baseToDo);
    },
    // 批量权限回收
    getTakeResource: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/DeleteEmployeesResources',
            params: params
        }, baseToDo);
    },
    // 修改菜单资源
    getMenuModify: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/MenuModify',
            params: params
        }, baseToDo);
    },
    // 获取员工权限
    getEmployeeResources: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/GetEmployeeResources',
            params: params
        }, baseToDo);
    },
    // 设置员工权限
    SetEmployeeResources: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/SetEmployeeResources',
            params: params
        }, baseToDo);
    },
    // 员工菜单列表
    getCanLookMenus: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AccessControl/CanLookMenus',
            params: params
        }, baseToDo);
    }
};
export default Service;