import merge from '../../merge';
import getDriverList from 'ACTION/ExpCenter/DriverList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_driverList';
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
        getDriverListFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLoading: false,
        DriverList: [],
        TotalCount: 0,
        parms: {
            RecordIndex: 0,
            RecordSize: 2000
        }
    };
}

const getDriverListList = {
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
        [getDriverList]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getDriverListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getDriverList.success]: merge((payload, state) => {
            return {
                getDriverListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                DriverList: payload.Data.DriverList ? addKey(payload.Data.DriverList) : [],
                TotalCount: payload.Data.TotalCount
            };
        }),
        [getDriverList.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getDriverListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getDriverListList;