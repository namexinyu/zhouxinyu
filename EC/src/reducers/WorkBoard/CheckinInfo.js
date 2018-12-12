import merge from '../merge';
import getCheckinInfo from 'ACTION/WorkBoard/getCheckinInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_checkinInfo';

function InitialState() {
    return {
        getCheckinInfoFetch: {
            status: 'pending',
            response: ''
        },
        CheckinCount: 1,
        PreCheckinCount: 1
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
        [getCheckinInfo]: merge((payload, state) => {
            return {
                getCheckinInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCheckinInfo.success]: merge((payload, state) => {
            return {
                getCheckinInfoFetch: {
                    status: 'success',
                    response: payload
                },
                CheckinCount: payload.Data.CheckinCount,
                PreCheckinCount: payload.Data.PreCheckinCount
            };
        }),
        [getCheckinInfo.error]: merge((payload, state) => {
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