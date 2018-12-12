import merge from '../../merge';
import getVehicleList from 'ACTION/ExpCenter/GetCommonData/getVehicleList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_vehicleList';
function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = i.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}
function InitialState() {
    return {
        getVehicleListFetch: {
            status: 'pending',
            response: ''
        },
        VehicleList: []
    };
}

const getVehicleListList = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return new InitialState();
            }
            return {};
        }),
        [setParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return payload.params;
            }
            return {};
        }),
        [setFetchStatus]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
                state[payload.fetchName].status = payload.status;
                return state;
            }
            return {};
        }),
        [getVehicleList]: merge((payload, state) => {
            return {
                getVehicleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getVehicleList.success]: merge((payload, state) => {
            return {
                getVehicleListFetch: {
                    status: 'success',
                    response: payload
                },
                VehicleList: payload.Data.VehicleList ? payload.Data.VehicleList : []
            };
        }),
        [getVehicleList.error]: merge((payload, state) => {
            return {
                getVehicleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getVehicleListList;