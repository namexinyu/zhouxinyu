import createAction from 'ACTION/createAction';
import getBindEmployeeData from 'SERVICE/ExpCenter/BindEmployee';

function getBindEmployeeList(params) {
    return {
        promise: getBindEmployeeData.getBindEmployee(params)
    };
};

if (!__PROD__) {
    getBindEmployeeList.actionType = __filename;
};

export default createAction(getBindEmployeeList);