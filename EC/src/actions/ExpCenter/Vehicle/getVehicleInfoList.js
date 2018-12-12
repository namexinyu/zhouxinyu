import createAction from 'ACTION/createAction';
import VehicleService from 'SERVICE/ExpCenter/VehicleList';

function getVehicleInfoList(params) {
    return {
        promise: VehicleService.getVehicleList(params)
    };
};

if (!__PROD__) {
    getVehicleInfoList.actionType = __filename;
};

export default createAction(getVehicleInfoList);