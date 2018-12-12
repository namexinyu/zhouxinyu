import merge from '../../merge';
import getLaborAccount from 'ACTION/Finance/AccountManage/LaborAccount';
import getRechargeLaborAccount from 'ACTION/Finance/AccountManage/RechargeLaborAccount';
import getTransferMoney from 'ACTION/Finance/AccountManage/TransferMoney';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_fc_laborAccount';

function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = arr[i].iLaborID.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}

function InitialState() {
    return {
        RecordList: [],
        RecordCount: 0,
        entBL: [],
        Parms: {
            AccountStatus: [],
            BossName: "",
            LaborName: "",
            RecordIndex: 0,
            RecordSize: 10
        },
        getRechargeLaborAccountFetch: {
            status: 'pending',
            response: ''
        },
        getTransferMoneyFetch: {
            status: 'pending',
            response: ''
        },
        getLaborAccountFetch: {
            status: 'pending',
            response: ''
        }
    };
}

const getLaborAccountList = {
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
        [getLaborAccount]: merge((payload, state) => {
            return {
                getLaborAccountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborAccount.success]: merge((payload, state) => {
            return {
                getLaborAccountFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : [],
                RecordCount: payload.Data.RecordCount
            };
        }),
        [getLaborAccount.error]: merge((payload, state) => {
            return {
                getLaborAccountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getRechargeLaborAccount]: merge((payload, state) => {
            return {
                getRechargeLaborAccountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRechargeLaborAccount.success]: merge((payload, state) => {
            return {
                getRechargeLaborAccountFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getRechargeLaborAccount.error]: merge((payload, state) => {
            return {
                getRechargeLaborAccountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getTransferMoney]: merge((payload, state) => {
            return {
                getTransferMoneyFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTransferMoney.success]: merge((payload, state) => {
            return {
                getTransferMoneyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getTransferMoney.error]: merge((payload, state) => {
            return {
                getTransferMoneyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getLaborAccountList;