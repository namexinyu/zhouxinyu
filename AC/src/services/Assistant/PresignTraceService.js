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

let PresignTraceService = {
  getPresignTraceList: (params = {}) => {
    return HttpRequest.post({
      url: API_URL + '/BK_PreOrderStatics/WD_BK_ListPreOrderStatics',
      params: params
    }, baseToDo);
  }
};
export default PresignTraceService;
