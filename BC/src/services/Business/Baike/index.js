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
    // 获取百科分类tab list
    getCategoriesList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/GetCategories',
            params: params
        }, baseToDo);
    },
    // 自动完成
    getTopSearch: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/GetTopSearch',
            params: params
        }, baseToDo, {needThrottleCheck: false});
    },
    // 获取特定分类的文章列表
    getDocListByCategory: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/GetDocList',
            params: params
        }, baseToDo);
    },
    // 点击搜索按钮获取搜索结果列表
    getSearchResults: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/QryDoc',
            params: params
        }, baseToDo);
    },
    // 添加百科
    addDoc: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/AddDoc',
            params: params
        }, baseToDo);
    },
    // 更新百科
    updateDoc: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/EditDoc',
            params: params
        }, baseToDo);
    },
    // 删除百科
    deleteDoc: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/DelDoc',
            params: params
        }, baseToDo);
    },
    // 获取百科详情
    getDocDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/wiki/GetDoc',
            params: params
        }, baseToDo);
    }
};