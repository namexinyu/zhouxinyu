import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Broker/HeaderService';

// 获取头部系统消息列表
const getHeaderSystemInfo = createAction((param) => ({
    promise: HeaderService.systemMessageGet(param)
}));
// 标记头部系统消息
const markHeaderSystemInfo = createAction((param) => ({
    promise: HeaderService.systemMessageMarkAsRead(param)
}));
export {getHeaderSystemInfo, markHeaderSystemInfo};
