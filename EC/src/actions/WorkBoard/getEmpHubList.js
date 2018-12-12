import createAction from 'ACTION/createAction';
import getEmpHubListData from 'SERVICE/WorkBoard/EmpHubList';

function getEmpHubList(params) {
    return {
        promise: getEmpHubListData.getEmpHubList(params)
    };
};

if (!__PROD__) {
    getEmpHubList.actionType = __filename;
};

export default createAction(getEmpHubList);