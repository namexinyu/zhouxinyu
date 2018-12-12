import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getIdCardUnAuditRecord,
    getIdCardUnAuditCount,
    auditIdCard
} = AuditOperateAction;

const STATE_NAME = 'state_audit_idCard_operate';

function InitialState() {
    return {
        unAuditCount: '',
        idCard1: '',
        idCard2: '',
        userName: {},
        userNation: {},
        areaCode: {},
        userAddress: {},
        idCardNum: {},
        limitDate: {},
        assuedOffice: {},
        lts: false,
        r_userName: {},
        r_userNation: {},
        r_areaCode: {},
        r_userAddress: {},
        r_idCardNum: {},
        r_limitDate: {},
        r_assuedOffice: {},
        r_lts: false,
        noPassReason: {},
        sourceUserInfo: '',
        getIdCardUnAuditCountFetch: {
            status: 'close',
            response: ''
        },
        getIdCardUnAuditRecordFetch: {
            status: 'close',
            response: ''
        },
        auditIdCardFetch: {
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
        [getIdCardUnAuditCount]: merge((payload, state) => {
            return {
                getIdCardUnAuditCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getIdCardUnAuditCount.success]: merge((payload, state) => {
            return {
                getIdCardUnAuditCountFetch: {
                    status: 'success',
                    response: payload
                },
                unAuditCount: payload.Data.RecordCount
            };
        }),
        [getIdCardUnAuditCount.error]: merge((payload, state) => {
            return {
                getIdCardUnAuditCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getIdCardUnAuditRecord]: merge((payload, state) => {
            return {
                getIdCardUnAuditRecordFetch: {
                    status: 'pending'
                },
                unAuditCount: '',
                idCard1: '',
                idCard2: '',
                userName: {},
                userNation: {},
                areaCode: {},
                userAddress: {},
                idCardNum: {},
                limitDate: {},
                assuedOffice: {},
                lts: false,
                r_userName: {},
                r_userNation: {},
                r_areaCode: {},
                r_userAddress: {},
                r_idCardNum: {},
                r_limitDate: {},
                r_assuedOffice: {},
                r_lts: false,
                noPassReason: {},
                sourceUserInfo: ''
            };
        }),
        [getIdCardUnAuditRecord.success]: merge((payload, state) => {
            return {
                getIdCardUnAuditRecordFetch: {
                    status: 'success',
                    response: payload
                },
                sourceUserInfo: payload.Data
            };
        }),
        [getIdCardUnAuditRecord.error]: merge((payload, state) => {
            return {
                getIdCardUnAuditRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [auditIdCard]: merge((payload, state) => {
            return {
                auditIdCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [auditIdCard.success]: merge((payload, state) => {
            return {
                auditIdCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditIdCard.error]: merge((payload, state) => {
            return {
                auditIdCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

