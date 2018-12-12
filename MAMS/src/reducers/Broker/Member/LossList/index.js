import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

import getLossList from 'ACTION/Broker/Member/getLossList';

const STATE_NAME = 'state_broker_member_lossList';

const initialState = {
    dataList: [],
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
        [getLossList]: merge((payload, state) => {
            return {
                getDataListFetch: {
                    status: 'pending'
                },
                lossList: null
            };
        }),
        [getLossList.success]: merge((payload, state) => {
            return {
                getDataListFetch: {
                    status: 'success',
                    response: payload
                },
                dataList: payload.Data.TurnList || []
            };
        }),
        [getLossList.error]: merge((payload, state) => {
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