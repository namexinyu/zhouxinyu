import createAction from 'ACTION/createAction';
import DepartmentService from 'SERVICE/Common/DepartmentService';

function getDepartmentList(param) {
    return {
        promise: DepartmentService.GetDepartmentFilterList(param)
    };
}

export default createAction(getDepartmentList);