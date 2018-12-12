import createAction from 'ACTION/createAction';
import getBrokersOnDuty from 'SERVICE/ExpCenter/BrokersOnDuty';

function getBrokersOnDutyList(params) {
    return {
        promise: getBrokersOnDuty.getBrokersOnDuty(params)
    };
};

if (!__PROD__) {
    getBrokersOnDutyList.actionType = __filename;
};

export default createAction(getBrokersOnDutyList);