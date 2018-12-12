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

let removeMobile = {
  getMoveNullNumberApplyList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BA_OverviewDailyWork/BA_MoveNullNumberApplyList',
      params: params
    }, baseToDo);
  }
};
export default removeMobile;
