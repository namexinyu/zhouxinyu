import merge from '../merge';
import getHistoryDispatchInfo from 'ACTION/WorkBoard/getHistoryDispathInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_historyDispatchInfo';

function InitialState() {
    return {
        getHistoryDispatchInfoFetch: {
            status: 'pending',
            response: ''
        },
        DispatchCountH: 1,
        SuccessDispatchCountH: 1,
        WaitDispatchCountH: 1
    };
}

const getHistoryDispatchInfoList = {
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
        [getHistoryDispatchInfo]: merge((payload, state) => {
            return {
                getHistoryDispatchInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHistoryDispatchInfo.success]: merge((payload, state) => {
            return {
                getHistoryDispatchInfoFetch: {
                    status: 'success',
                    response: payload
                },
                DispatchCountH: payload.Data.DispatchCount,
                SuccessDispatchCountH: payload.Data.SuccessDispatchCount,
                WaitDispatchCountH: payload.Data.WaitDispatchCount
            };
        }),
        [getHistoryDispatchInfo.error]: merge((payload, state) => {
            return {
                getHistoryDispatchInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getHistoryDispatchInfoList;