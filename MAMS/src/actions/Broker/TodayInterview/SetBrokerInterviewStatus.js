import createAction from 'ACTION/createAction';
import SetBrokerInterviewStatusList from 'SERVICE/Broker/SetBrokerInterviewStatus';

function SetBrokerInterviewStatusData(params) {
    return {
        promise: SetBrokerInterviewStatusList.setBrokerInterviewStatus(params)
    };
};

if (!__PROD__) {
    SetBrokerInterviewStatusData.actionType = __filename;
};

export default createAction(SetBrokerInterviewStatusData);