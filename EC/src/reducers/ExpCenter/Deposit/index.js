import merge from '../../merge';
import getDeposit from 'ACTION/ExpCenter/Deposit';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_deposit';
function InitialState() {
    return {
        getDepositFetch: {
            status: 'pending',
            response: ''
        },
        AmountDeposit: null
    };
}

const getDriverListList = {
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
        [getDeposit]: merge((payload, state) => {
            return {
                getDepositFetch: {
                    status: 'pending'
                }
            };
        }),
        [getDeposit.success]: merge((payload, state) => {
            return {
                getDepositFetch: {
                    status: 'success',
                    response: payload
                },
                AmountDeposit: payload.Data.Amount
            };
        }),
        [getDeposit.error]: merge((payload, state) => {
            return {
                getDepositFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getDriverListList;