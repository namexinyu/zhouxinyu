import createAction from 'ACTION/createAction';
import setPrePickSetting from 'SERVICE/Broker/PrePickSetting';

function setPrePickSettingData(params) {
    return {
        promise: setPrePickSetting.PrePickSetting(params)
    };
};

if (!__PROD__) {
    setPrePickSettingData.actionType = __filename;
};

export default createAction(setPrePickSettingData);