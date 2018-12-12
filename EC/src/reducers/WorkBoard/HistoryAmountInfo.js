import merge from '../merge';
import getHistoryAmountInfo from 'ACTION/WorkBoard/getHistoryAmountInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_historyAmountInfo';

function InitialState() {
    return {
        getAmountInfoFetch: {
            status: 'pending',
            response: ''
        },
        GetTotalAmountH: 1,
        ReturnAmountH: 1
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
        [getHistoryAmountInfo]: merge((payload, state) => {
            return {
                getAmountInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHistoryAmountInfo.success]: merge((payload, state) => {
            return {
                getAmountInfoFetch: {
                    status: 'success',
                    response: payload
                },
                GetTotalAmountH: payload.Data.GetTotalAmount,
                ReturnAmountH: payload.Data.ReturnAmount
            };
        }),
        [getHistoryAmountInfo.error]: merge((payload, state) => {
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