import merge from '../merge';
import getHistoryCheckinInfo from 'ACTION/WorkBoard/getHistoryCheckinInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_historyCheckinInfo';

function InitialState() {
    return {
        getCheckinInfoFetch: {
            status: 'pending',
            response: ''
        },
        CheckinCountH: 1,
        PreCheckinCountH: 1
    };
}

const getCheckinInfoList = {
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
        [getHistoryCheckinInfo]: merge((payload, state) => {
            return {
                getCheckinInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHistoryCheckinInfo.success]: merge((payload, state) => {
            return {
                getCheckinInfoFetch: {
                    status: 'success',
                    response: payload
                },
                CheckinCountH: payload.Data.CheckinCount,
                PreCheckinCountH: payload.Data.PreCheckinCount
            };
        }),
        [getHistoryCheckinInfo.error]: merge((payload, state) => {
            return {
                getCheckinInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getCheckinInfoList;