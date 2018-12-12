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

let getDeletePreSignService = {
    getDeletePreSign: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_PreOrderSrv/WD_JJZX_DeletePreOrder',
            params: params
        }, baseToDo);
    }
};
export default getDeletePreSignService;
