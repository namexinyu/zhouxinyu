import HttpRequest from 'REQUEST';
import {message} from 'antd';
import env from 'CONFIG/envs';
const API_URL = env.api_url;

message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
let baseToDo = {
    successDo: (res) => {
        message.destroy();
        message.success('操作成功！');
        return res;
    },
    errorDo: (res) => {
        message.destroy();
        message.error('操作失败！');
        // maybe you could dialog the res.message
        return res;
    }
};

let getDriverPickService = {
    getDriverPick: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_ResourceManager/WD_RMAN_SetDriverPick',
            params: params
        }, baseToDo);
    }
};
export default getDriverPickService;