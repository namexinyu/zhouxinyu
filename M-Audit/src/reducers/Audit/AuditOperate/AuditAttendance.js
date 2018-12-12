import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getAttendanceUnAuditRecord,
    getAttendanceUnAuditCount,
    auditAttendance
} = AuditOperateAction;

const STATE_NAME = 'state_audit_attendance_operate';

function InitialState() {
    return {
        unAuditCount: '',
        attendanceExamplePic: '',
        attendancePic: '',
        workerCardPic: '',
        auditAttendanceInfo: {},
        startTime: {},
        endTime: {},
        noPassReason: {},
        getAttendanceUnAuditRecordFetch: {
            status: 'close',
            response: ''
        },
        getAttendanceUnAuditCountFetch: {
            status: 'close',
            response: ''
        },
        auditAttendanceFetch: {
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
        [getAttendanceUnAuditRecord]: merge((payload, state) => {
            return {
                getAttendanceUnAuditRecordFetch: {
                    status: 'pending',
                    response: ''
                },
                unAuditCount: '',
                attendanceExamplePic: '',
                attendancePic: '',
                workerCardPic: '',
                auditAttendanceInfo: {},
                startTime: {},
                endTime: {},
                noPassReason: {}
            };
        }),
        [getAttendanceUnAuditRecord.success]: merge((payload, state) => {
            return {
                getAttendanceUnAuditRecordFetch: {
                    status: 'success',
                    response: payload
                },
                auditAttendanceInfo: payload.Data || {}
            };
        }),
        [getAttendanceUnAuditRecord.error]: merge((payload, state) => {
            return {
                getAttendanceUnAuditRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [auditAttendance]: merge((payload, state) => {
            return {
                auditAttendanceFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [auditAttendance.success]: merge((payload, state) => {
            return {
                auditAttendanceFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditAttendance.error]: merge((payload, state) => {
            return {
                auditAttendanceFetch: {
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
                unAuditCount: payload.Data && payload.Data.Num || 0
            };
        }),
        [getAttendanceUnAuditCount.error]: merge((payload, state) => {
            return {
                getAttendanceUnAuditCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

