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
    getTagList: (params = {}) => {
      return HttpRequest.post({
          url: API_URL + '/BA_EnterpriseTagLibrary/BA_GetEnterpriseTagList',
          params: params
      }, baseToDo);
    },
    getAllTagList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_EnterpriseTagLibrary/BA_GetEnterpriseTagList',
            params: params
        }, baseToDo);
      },
    deleteTagContent: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_EnterpriseTagLibrary/BA_DeleteEnterpriseTagContent',
            params: params
        }, baseToDo);
    },
    editTag: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_EnterpriseTagLibrary/BA_EidtEnterpriseTag',
            params: params
        }, baseToDo);
    },
    addTag: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_EnterpriseTagLibrary/BA_AddEnterpriseTag',
            params: params
        }, baseToDo);
    },
    updateTag: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_EnterpriseTagLibrary/BA_ModifyEnterpriseTag ',
            params: params
        }, baseToDo);
    },
    getTagMatchList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_RecruitTmpTagMatching/BA_SearchRecruitTmpTagMatchingList',
            params: params
        }, baseToDo);
    },
    getMatchTags: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_RecruitTmpTagMatching/BA_GetRecruitTmpTagMatchingList',
            params: params
        }, baseToDo);
    },
    updateMatchTag: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BA_RecruitTmpTagMatching/BA_EditRecruitTmpTagMatching',
            params: params
        }, baseToDo);
    }

};
