import createAction from 'ACTION/createAction';
import getEmployeeListData from 'SERVICE/ExpCenter/EmployeeList';

function getEmployeeList(params) {
    return {
        promise: getEmployeeListData.getEmployee(params)
    };
};

if (!__PROD__) {
    getEmployeeList.actionType = __filename;
};

export default createAction(getEmployeeList);