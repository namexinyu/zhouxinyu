import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Broker/HeaderService';

// 获取头部账户信息
const accountInformationGet = createAction((param) => ({
    promise: HeaderService.accountInformationGet(param)
}));
// 设置工作状态
const accountInformationSetStatus = createAction((param) => ({
    promise: HeaderService.accountInformationSetStatus(param)
}));
export {accountInformationGet, accountInformationSetStatus};
