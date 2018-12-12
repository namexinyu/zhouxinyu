import merge from '../merge';
import getHistoryLaborPickupInfo from 'ACTION/WorkBoard/getHistoryLaborPickupInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_historyLaborPickupInfo';

function InitialState() {
    return {
        getLaborPickupInfoFetch: {
            status: 'pending',
            response: ''
        },
        GiveupCountH: 1,
        PickupCountH: 1,
        WaitPickupCountH: 1
    };
}

const getLaborPickupInfoList = {
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
        [getHistoryLaborPickupInfo]: merge((payload, state) => {
            return {
                getLaborPickupInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHistoryLaborPickupInfo.success]: merge((payload, state) => {
            return {
                getLaborPickupInfoFetch: {
                    status: 'success',
                    response: payload
                },
                GiveupCountH: payload.Data.GiveupCount,
                PickupCountH: payload.Data.PickupCount,
                WaitPickupCountH: payload.Data.WaitPickupCount
            };
        }),
        [getHistoryLaborPickupInfo.error]: merge((payload, state) => {
            return {
                getLaborPickupInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getLaborPickupInfoList;