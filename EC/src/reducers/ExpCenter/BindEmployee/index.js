import merge from '../../merge';
import getBindEmployee from 'ACTION/ExpCenter/BindEmployee';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_bind_employee';

function InitialState() {
    return {
        getBindEmployeeFetch: {
            status: 'pending',
            response: ''
        },
        IsOk: null
    };
}

const getBindEmployeeList = {
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
        [getBindEmployee]: merge((payload, state) => {
            return {
                getBindEmployeeFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBindEmployee.success]: merge((payload, state) => {
            return {
                getBindEmployeeFetch: {
                    status: 'success',
                    response: payload
                },
                IsOk: payload.Data.IsOk
            };
        }),
        [getBindEmployee.error]: merge((payload, state) => {
            return {
                getBindEmployeeFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getBindEmployeeList;