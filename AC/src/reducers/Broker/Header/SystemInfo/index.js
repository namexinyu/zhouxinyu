import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import {getHeaderSystemInfo, markHeaderSystemInfo} from 'ACTION/Broker/Header/SystemInfo';

const STATE_NAME = 'state_broker_header_systemInfo';

const initialState = {
    dataList: [],
    currentPage: 1,
    pageSize: 10,
    totalSize: 0,
    getDataListFetch: {
        status: 'close',
        response: ''
    }
};
const Reducer = {
    initialState: initialState,
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return initialState;
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
        [getHeaderSystemInfo]: merge((payload, state) => {
            return {
                getDataListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHeaderSystemInfo.success]: merge((payload, state) => {
            return {
                getDataListFetch: {
                    status: 'success',
                    response: payload
                },
                dataList: payload.Data.MessageList,
                totalSize: payload.Data.RecordCount
            };
        }),
        [getHeaderSystemInfo.error]: merge((payload, state) => {
            return {
                getDataListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;