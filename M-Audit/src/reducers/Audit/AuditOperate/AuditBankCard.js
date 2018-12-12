import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getBankCardUnAuditRecord,
    getBankCardUnAuditCount,
    auditBankCard
} = AuditOperateAction;

const STATE_NAME = 'state_audit_bankCard_operate';

function InitialState() {
    return {
        bankCardPic: '',
        unAuditCount: '',
        bankId: {},
        r_bankId: {},
        bankCardNum: {},
        r_bankCardNum: {},
        auditBankCardInfo: '',
        noPassReason: {},
        getBankCardUnAuditRecordFetch: {
            status: 'close',
            response: ''
        },
        getBankCardUnAuditCountFetch: {
            status: 'close',
            response: ''
        },
        auditBankCardFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
            }
            return {};
        }),
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
                return temp;
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
        [getBankCardUnAuditCount]: merge((payload, state) => {
            return {
                getBankCardUnAuditCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getBankCardUnAuditCount.success]: merge((payload, state) => {
            return {
                getBankCardUnAuditCountFetch: {
                    status: 'success',
                    response: payload
                },
                unAuditCount: payload.Data.UncheckedNum
            };
        }),
        [getBankCardUnAuditCount.error]: merge((payload, state) => {
            return {
                getBankCardUnAuditCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getBankCardUnAuditRecord]: merge((payload, state) => {
            return {
                getBankCardUnAuditRecordFetch: {
                    status: 'pending',
                    response: ''
                },
                bankCardPic: '',
                unAuditCount: '',
                bankId: {},
                r_bankId: {},
                bankCardNum: {},
                r_bankCardNum: {},
                auditBankCardInfo: '',
                noPassReason: {}
            };
        }),
        [getBankCardUnAuditRecord.success]: merge((payload, state) => {
            return {
                getBankCardUnAuditRecordFetch: {
                    status: 'success',
                    response: payload
                },
                auditBankCardInfo: payload.Data
            };
        }),
        [getBankCardUnAuditRecord.error]: merge((payload, state) => {
            return {
                getBankCardUnAuditRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [auditBankCard]: merge((payload, state) => {
            return {
                auditBankCardFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [auditBankCard.success]: merge((payload, state) => {
            return {
                auditBankCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditBankCard.error]: merge((payload, state) => {
            return {
                auditBankCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

