import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getVehicleInfoList from 'ACTION/ExpCenter/Vehicle/getVehicleInfoList';

const STATE_NAME = 'state_ec_vehicleInfoList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        authHubID: -9999,
        vehicleInfoList: [],
        // queryParams: {
        //     Name: undefined,
        //     EnableStatus: 0
        // },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        RecordListLoading: false,
        getVehicleInfoListFetch: {
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
        [getVehicleInfoList]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getVehicleInfoListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getVehicleInfoList.success]: merge((payload, state) => {
            return {
                getVehicleInfoListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                vehicleInfoList: (payload.Data ? (payload.Data.VehicleList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getVehicleInfoList.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getVehicleInfoListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;