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
        message.success("划款成功！");
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        message.destroy();
        message.error("划款失败！");
        return res;
    }
};

let getTransferMoneyService = {
    getTransferMoney: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_WodaLabor/FIN_WLB_TransferMoney',
            params: params
        }, baseToDo);
    }
};
export default getTransferMoneyService;