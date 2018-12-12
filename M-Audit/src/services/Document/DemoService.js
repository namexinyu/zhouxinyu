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
let DemoService = {
    getEmployeeProfile: (params) => {
        return HttpRequest.get({
            url: API_URL + 'mockjs/1/api/getemployeeprofile',
            params: params
        }, baseToDo);
    },
    updateDoctorProfile: (params) => {
        return HttpRequest.post({
            url: API_URL + 'mockjs/1/api/updatedoctorprofile',
            params: params
        });
    },
    // 获取职位列表
    getRecruitSimpleList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetRecruitList',
            params: params || {}
        }, baseToDo);
    }
};
export default DemoService;