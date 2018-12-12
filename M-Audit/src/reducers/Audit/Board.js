import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
const {
    getIdCardUnAuditCount,
    getBankCardUnAuditCount,
    getAttendanceUnAuditCount,
    getWorkerCardUnAuditCount
} = AuditOperateAction;

const STATE_NAME = 'state_audit_board';

function InitialState() {
    return {
        unAuditIdCardCount: 0,
        unAuditBankCardCount: 0,
        unAuditWorkerCardCount: 0,
        unAuditAttendanceCount: 0
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
                unAuditIdCardCount: payload.Data && payload.Data.RecordCount || 0
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
        [getBankCardUnAuditCount]: merge((payload, state) => {
            return {
                getBankCardUnAuditCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBankCardUnAuditCount.success]: merge((payload, state) => {
            return {
                getBankCardUnAuditCountFetch: {
                    status: 'success',
                    response: payload
                },
                unAuditBankCardCount: payload.Data && payload.Data.UncheckedNum || 0
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
        [getAttendanceUnAuditCount]: merge((payload, state) => {
            return {
                getAttendanceUnAuditCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAttendanceUnAuditCount.success]: merge((payload, state) => {
            return {
                getAttendanceUnAuditCountFetch: {
                    status: 'success',
                    response: payload
                },
                unAuditAttendanceCount: payload.Data && payload.Data.Num || 0
            };
        }),
        [getAttendanceUnAuditCount.error]: merge((payload, state) => {
            return {
                getAttendanceUnAuditCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getWorkerCardUnAuditCount]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getWorkerCardUnAuditCount.success]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditCountFetch: {
                    status: 'success',
                    response: payload
                },
                unAuditWorkerCardCount: payload.Data && payload.Data.Num || 0
            };
        }),
        [getWorkerCardUnAuditCount.error]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;