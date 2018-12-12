import createAction from 'ACTION/createAction';
import getVehicleListData from 'SERVICE/ExpCenter/VehicleList';

function getVehicleListList(params) {
    return {
        promise: getVehicleListData.getVehicleList(params)
    };
};

if (!__PROD__) {
    getVehicleListList.actionType = __filename;
};

export default createAction(getVehicleListList);