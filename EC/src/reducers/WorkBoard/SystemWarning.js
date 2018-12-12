import merge from '../merge';
import getSystemWarning from 'ACTION/WorkBoard/getSystemWarning';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_systemWarning';

function InitialState() {
    return {
        getSystemWarningFetch: {
            status: 'pending',
            response: ''
        },
        TomorwPreCheckCount: null
    };
}

const getSystemWarningList = {
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
        [getSystemWarning]: merge((payload, state) => {
            return {
                getSystemWarningFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSystemWarning.success]: merge((payload, state) => {
            return {
                getSystemWarningFetch: {
                    status: 'success',
                    response: payload
                },
                TomorwPreCheckCount: payload.Data.TomorwPreCheckCount
            };
        }),
        [getSystemWarning.error]: merge((payload, state) => {
            return {
                getSystemWarningFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getSystemWarningList;