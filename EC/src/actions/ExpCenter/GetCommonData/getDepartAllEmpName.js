import createAction from 'ACTION/createAction';
import getDepartAllEmpNameData from 'SERVICE/ExpCenter/DepartAllEmpName';

function getDepartAllEmpNameList(params) {
    return {
        promise: getDepartAllEmpNameData.getDepartAllEmpName(params)
    };
};

if (!__PROD__) {
    getDepartAllEmpNameList.actionType = __filename;
};

export default createAction(getDepartAllEmpNameList);