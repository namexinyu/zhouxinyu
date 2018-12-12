import createAction from 'ACTION/createAction';
import StaffService from 'SERVICE/ExpCenter/StaffService';

function getHubEmployeeList(param) {
    return {
        promise: StaffService.getHubEmployeeList(param)
    };
}

export default createAction(getHubEmployeeList);