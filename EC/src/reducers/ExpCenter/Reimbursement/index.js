import merge from '../../merge';
import getReimbursement from 'ACTION/ExpCenter/Reimbursement';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_reimbursement';
function InitialState() {
    return {
        getReimbursementFetch: {
            status: 'pending',
            response: ''
        },
        ClaimMoney: ""
    };
}

const getSystemMsgList = {
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
        [getReimbursement]: merge((payload, state) => {
            return {
                getReimbursementFetch: {
                    status: 'pending'
                }
            };
        }),
        [getReimbursement.success]: merge((payload, state) => {
            return {
                getReimbursementFetch: {
                    status: 'success',
                    response: payload
                },
                ClaimMoney: payload.Data.ClaimMoney
            };
        }),
        [getReimbursement.error]: merge((payload, state) => {
            return {
                getReimbursementFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getSystemMsgList;