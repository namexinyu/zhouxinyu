import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getWorkerCardUnAuditRecord,
    getWorkerCardUnAuditCount,
    auditWorkerCard
} = AuditOperateAction;

const STATE_NAME = 'state_audit_workerCard_operate';

function InitialState() {
    return {
        unAuditCount: '',
        examplePic: '',
        cardPic: '',
        workerId: {},
        r_workerId: {},
        auditWorkerInfo: {},
        noPassReason: {},
        getWorkerCardUnAuditRecordFetch: {
            status: 'close',
            response: ''
        },
        auditWorkerCardFetch: {
            status: 'close',
            response: ''
        },
        getWorkerCardUnAuditCountFetch: {
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
        [getWorkerCardUnAuditRecord]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditRecordFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getWorkerCardUnAuditRecord.success]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditRecordFetch: {
                    status: 'success',
                    response: payload
                },
                auditWorkerInfo: payload.Data || {}
            };
        }),
        [getWorkerCardUnAuditRecord.error]: merge((payload, state) => {
            return {
                getWorkerCardUnAuditRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [auditWorkerCard]: merge((payload, state) => {
            return {
                auditWorkerCardFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [auditWorkerCard.success]: merge((payload, state) => {
            return {
                auditWorkerCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditWorkerCard.error]: merge((payload, state) => {
            return {
                auditWorkerCardFetch: {
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
                unAuditCount: payload.Data && payload.Data.Num || 0
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

