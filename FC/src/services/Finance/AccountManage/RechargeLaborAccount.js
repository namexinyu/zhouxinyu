import {HttpRequest, env} from 'mams-com';

import {message} from 'antd';

message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
let baseToDo = {
    successDo: (res) => {
        message.destroy();
        message.success("充值成功！");
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        message.destroy();
        message.error("充值失败！");
        return res;
    }
};

let getRechargeLaborAccountService = {
    getRechargeLaborAccount: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_WodaLabor/FIN_WLB_RechargeLaborAccount',
            params: params
        }, baseToDo);
    }
};
export default getRechargeLaborAccountService;