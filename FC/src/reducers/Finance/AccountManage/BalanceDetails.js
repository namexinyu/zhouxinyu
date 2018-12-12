import merge from '../../merge';
import getBalanceDetails from 'ACTION/Finance/AccountManage/BalanceDetails';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_fc_balanceDetails';
function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = i.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}
function InitialState() {
    return {
        getBalanceDetailsFetch: {
            status: 'pending',
            response: ''
        },
        RecordList: [],
        RecordCount: 0,
        TotalIn: 0,
        TotalOut: 0,
        Parms: {
            Order: 0,
            CreateTimeEnd: "",
            CreateTimeStart: "",
            RecordIndex: 0,
            RecordSize: 10,
            TradeType: [],
            iAccountID: null
        }
    };
}

const getBalanceDetailsList = {
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
        [getBalanceDetails]: merge((payload, state) => {
            return {
                getPriceAllocationFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBalanceDetails.success]: merge((payload, state) => {
            return {
                getPriceAllocationFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : [],
                RecordCount: payload.Data.RecordCount,
                TotalIn: payload.Data.TotalIn,
                TotalOut: payload.Data.TotalOut
            };
        }),
        [getBalanceDetails.error]: merge((payload, state) => {
            return {
                getPriceAllocationFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getBalanceDetailsList;