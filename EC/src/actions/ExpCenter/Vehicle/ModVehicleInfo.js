import createAction from 'ACTION/createAction';
import VehicleService from 'SERVICE/ExpCenter/VehicleList';

function ModVehicleInfo(params) {
    return {
        promise: VehicleService.ModVehicleInfo(params)
    };
};

if (!__PROD__) {
    ModVehicleInfo.actionType = __filename;
};

export default createAction(ModVehicleInfo);