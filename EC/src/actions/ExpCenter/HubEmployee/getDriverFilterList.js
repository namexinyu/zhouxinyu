import createAction from 'ACTION/createAction';
import StaffService from 'SERVICE/ExpCenter/StaffService';

function getDriverFilterList(param) {
    return {
        promise: StaffService.getDriverFilterList(param)
    };
}

export default createAction(getDriverFilterList);