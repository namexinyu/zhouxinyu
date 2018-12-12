import createAction from 'ACTION/createAction';
import getBrokersOnDutyEdit from 'SERVICE/ExpCenter/BrokersOnDutyEdit';

function getBrokersOnDutyEditList(params) {
    return {
        promise: getBrokersOnDutyEdit.getBrokersOnDutyEdit(params)
    };
};

if (!__PROD__) {
    getBrokersOnDutyEditList.actionType = __filename;
};

export default createAction(getBrokersOnDutyEditList);