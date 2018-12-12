import merge from '../merge';
import getLaborPickupInfo from 'ACTION/WorkBoard/getLaborPickupInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_laborPickupInfo';

function InitialState() {
    return {
        getLaborPickupInfoFetch: {
            status: 'pending',
            response: ''
        },
        GiveupCount: 1,
        PickupCount: 1,
        WaitPickupCount: 1
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
        [getLaborPickupInfo]: merge((payload, state) => {
            return {
                getLaborPickupInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborPickupInfo.success]: merge((payload, state) => {
            return {
                getLaborPickupInfoFetch: {
                    status: 'success',
                    response: payload
                },
                GiveupCount: payload.Data.GiveupCount,
                PickupCount: payload.Data.PickupCount,
                WaitPickupCount: payload.Data.WaitPickupCount
            };
        }),
        [getLaborPickupInfo.error]: merge((payload, state) => {
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