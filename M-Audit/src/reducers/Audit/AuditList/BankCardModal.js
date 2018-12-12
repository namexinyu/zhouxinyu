import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import BankCardAction from 'ACTION/Audit/Modal/BankCardAction';


const {
    modalGetBankCardData,
    modalAuditBankCardData,
    modalModifyBankCardData
} = BankCardAction;
const STATE_NAME = 'state_audit_bankCardModal';

// 结构说明：列表页点击row时，传入ID字段，根据ID字段触发GetXXXData请求获取该条记录数据并赋值给Data与OriData,用于重置操作
function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        Data: undefined,
        OriData: undefined,
        GetBankCardFetch: {
            status: 'close',
            response: ''
        },
        AuditBankCardFetch: {
            status: 'close',
            response: ''
        },
        ModifyBankCardFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
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
        // 华丽的请求三连ACTION
        [modalGetBankCardData]: merge((payload, state) => {
            return {
                GetBankCardFetch: {
                    status: 'pending'
                },
                Data: undefined,
                OriData: undefined
            };
        }),
        [modalGetBankCardData.success]: merge((payload, state) => {
            let data = payload.Data ? Object.keys(payload.Data).reduce((obj, key) => Object.assign(obj, {[key]: {value: payload.Data[key]}}), {}) : undefined;
            if (data.BankID && data.BankID.value && data.BankID.value != -9999) {
                data.BankID = {value: data.BankID.value + ''};
            } else {
                data.BankID = {value: undefined};
            }
            return {
                GetBankCardFetch: {
                    status: 'success',
                    response: payload
                },
                Data: data,
                OriData: payload.Data ? {...payload.Data} : undefined
            };
        }),
        [modalGetBankCardData.error]: merge((payload, state) => {
            return {
                GetBankCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalAuditBankCardData]: merge((payload, state) => {
            return {
                AuditBankCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalAuditBankCardData.success]: merge((payload, state) => {
            return {
                AuditBankCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalAuditBankCardData.error]: merge((payload, state) => {
            return {
                AuditBankCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalModifyBankCardData]: merge((payload, state) => {
            return {
                ModifyBankCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalModifyBankCardData.success]: merge((payload, state) => {
            return {
                ModifyBankCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalModifyBankCardData.error]: merge((payload, state) => {
            return {
                ModifyBankCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;