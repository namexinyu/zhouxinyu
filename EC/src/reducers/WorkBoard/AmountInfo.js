import merge from '../merge';
import getAmountInfo from 'ACTION/WorkBoard/getAmountInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_amountInfo';

function InitialState() {
    return {
        getAmountInfoFetch: {
            status: 'pending',
            response: ''
        },
        GetTotalAmount: 1,
        ReturnAmount: 1
    };
}

const getAmountInfoList = {
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
        [getAmountInfo]: merge((payload, state) => {
            return {
                getAmountInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAmountInfo.success]: merge((payload, state) => {
            return {
                getAmountInfoFetch: {
                    status: 'success',
                    response: payload
                },
                GetTotalAmount: payload.Data.GetTotalAmount,
                ReturnAmount: payload.Data.ReturnAmount
            };
        }),
        [getAmountInfo.error]: merge((payload, state) => {
            return {
                getAmountInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getAmountInfoList;