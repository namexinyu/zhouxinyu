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
    GetBrokerDepartList: (params) => {
      return HttpRequest.post({
          url: API_URL + '/BA_OverviewDailyWork/BA_GetDepartWithGroup',
          params: params
      }, baseToDo);
    }
};