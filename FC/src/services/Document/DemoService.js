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
let DemoService = {
    getEmployeeProfile: (params) => {
        return HttpRequest.get({
            url: env.api_url + 'mockjs/1/api/getemployeeprofile',
            params: params
        }, baseToDo);
    },
    updateDoctorProfile: (params) => {
        return HttpRequest.post({
            url: env.api_url + 'mockjs/1/api/updatedoctorprofile',
            params: params
        });
    },
    // 获取职位列表
    getRecruitSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Members/WD_MEMB_GetRecruitList',
            params: params || {}
        }, baseToDo);
    }
};
export default DemoService;