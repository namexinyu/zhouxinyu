import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AttendanceAction from 'ACTION/Audit/Modal/AttendanceAction';
import moment from 'moment';


const {
    modalGetAttendanceData,
    modalAuditAttendanceData,
    modalModifyAttendanceData
} = AttendanceAction;
const STATE_NAME = 'state_audit_attendanceModal';

// 结构说明：列表页点击row时，传入ID字段，根据ID字段触发GetXXXData请求获取该条记录数据并赋值给Data与OriData,用于重置操作
function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        Data: undefined,
        OriData: undefined,
        GetAttendanceFetch: {
            status: 'close',
            response: ''
        },
        AuditAttendanceFetch: {
            status: 'close',
            response: ''
        },
        ModifyAttendanceFetch: {
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
        [modalGetAttendanceData]: merge((payload, state) => {
            return {
                GetAttendanceFetch: {
                    status: 'pending'
                },
                Data: undefined,
                OriData: undefined
            };
        }),
        [modalGetAttendanceData.success]: merge((payload, state) => {
            let data = payload.Data ? Object.keys(payload.Data).reduce((obj, key) => Object.assign(obj, {[key]: {value: payload.Data[key]}}), {}) : undefined;
            if (data.CheckinStartDate && data.CheckinStartDate.value && moment(data.CheckinStartDate.value).isValid()) {
                data.CheckinStartDate = {value: moment(data.CheckinStartDate.value)};
            } else {
                data.CheckinStartDate = {value: undefined};
            }
            if (data.CheckinStopDate && data.CheckinStopDate.value && moment(data.CheckinStopDate.value).isValid()) {
                data.CheckinStopDate = {value: moment(data.CheckinStopDate.value)};
            } else {
                data.CheckinStopDate = {value: undefined};
            }
            return {
                GetAttendanceFetch: {
                    status: 'success',
                    response: payload
                },
                Data: data,
                OriData: payload.Data ? {...payload.Data} : undefined
            };
        }),
        [modalGetAttendanceData.error]: merge((payload, state) => {
            return {
                GetAttendanceFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalAuditAttendanceData]: merge((payload, state) => {
            return {
                AuditAttendanceFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalAuditAttendanceData.success]: merge((payload, state) => {
            return {
                AuditAttendanceFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalAuditAttendanceData.error]: merge((payload, state) => {
            return {
                AuditAttendanceFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalModifyAttendanceData]: merge((payload, state) => {
            return {
                ModifyAttendanceFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalModifyAttendanceData.success]: merge((payload, state) => {
            return {
                ModifyAttendanceFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalModifyAttendanceData.error]: merge((payload, state) => {
            return {
                ModifyAttendanceFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;