import createAction from 'ACTION/createAction';
import DepartmentService from 'SERVICE/Common/DepartmentService';

function GetDepartmentFilterList(param) {
    return {
        promise: DepartmentService.GetDepartmentFilterList(param)
    };
}

export default createAction(GetDepartmentFilterList);