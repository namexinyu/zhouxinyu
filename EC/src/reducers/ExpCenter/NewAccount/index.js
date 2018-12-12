import merge from '../../merge';
import getNewAccount from 'ACTION/ExpCenter/NewAccount';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_new_account';

function InitialState() {
    return {
        getNewAccountFetch: {
            status: 'pending',
            response: ''
        },
        IsOk: null
    };
}

const getNewAccountList = {
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
        [getNewAccount]: merge((payload, state) => {
            return {
                getNewAccountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getNewAccount.success]: merge((payload, state) => {
            return {
                getNewAccountFetch: {
                    status: 'success',
                    response: payload
                },
                IsOk: payload.Data.IsOk
            };
        }),
        [getNewAccount.error]: merge((payload, state) => {
            return {
                getNewAccountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getNewAccountList;