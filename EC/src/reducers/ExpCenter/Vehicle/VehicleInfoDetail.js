import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ModVehicleInfo from 'ACTION/ExpCenter/Vehicle/ModVehicleInfo';

const STATE_NAME = 'state_ec_vehicleInfoDetail';

function InitialState() {
    return {
        state_name: STATE_NAME,
        // authHubID: -9999,
        VehicleID: undefined,
        VehicleData: undefined,
        VehicleDataOri: undefined,
        AdminTmp: undefined,
        RecordListLoading: false,
        ModVehicleInfoFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [ModVehicleInfo]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                ModVehicleInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [ModVehicleInfo.success]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                ModVehicleInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [ModVehicleInfo.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                ModVehicleInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;