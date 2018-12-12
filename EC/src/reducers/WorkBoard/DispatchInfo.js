import merge from '../merge';
import getDispatchInfo from 'ACTION/WorkBoard/getDispatchInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_dispatchInfo';

function InitialState() {
    return {
        getDispatchInfoFetch: {
            status: 'pending',
            response: ''
        },
        DispatchCount: 1,
        SuccessDispatchCount: 1,
        WaitDispatchCount: 1
    };
}

const getDispatchInfoList = {
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
        [getDispatchInfo]: merge((payload, state) => {
            return {
                getDispatchInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getDispatchInfo.success]: merge((payload, state) => {
            return {
                getDispatchInfoFetch: {
                    status: 'success',
                    response: payload
                },
                DispatchCount: payload.Data.DispatchCount,
                SuccessDispatchCount: payload.Data.SuccessDispatchCount,
                WaitDispatchCount: payload.Data.WaitDispatchCount
            };
        }),
        [getDispatchInfo.error]: merge((payload, state) => {
            return {
                getDispatchInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getDispatchInfoList;