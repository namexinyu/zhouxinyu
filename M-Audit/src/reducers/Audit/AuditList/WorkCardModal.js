import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import WorkCardAction from 'ACTION/Audit/Modal/WorkCardAction';
import moment from 'moment';


const {
    modalGetWorkCardData,
    modalAuditWorkCardData,
    modalModifyWorkCardData
} = WorkCardAction;
const STATE_NAME = 'state_audit_workCardModal';

// 结构说明：列表页点击row时，传入ID字段，根据ID字段触发GetXXXData请求获取该条记录数据并赋值给Data与OriData,用于重置操作
function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        Data: undefined,
        OriData: undefined,
        GetWorkCardFetch: {
            status: 'close',
            response: ''
        },
        AuditWorkCardFetch: {
            status: 'close',
            response: ''
        },
        ModifyWorkCardFetch: {
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
        [modalGetWorkCardData]: merge((payload, state) => {
            return {
                GetWorkCardFetch: {
                    status: 'pending'
                },
                Data: undefined,
                OriData: undefined
            };
        }),
        [modalGetWorkCardData.success]: merge((payload, state) => {
            let data = payload.Data ? Object.keys(payload.Data).reduce((obj, key) => Object.assign(obj, {[key]: {value: payload.Data[key]}}), {}) : undefined;
            if (data.InterviewDate && data.InterviewDate.value && moment(data.InterviewDate.value).isValid()) {
                data.InterviewDate = {value: moment(data.InterviewDate.value)};
            } else {
                data.InterviewDate = {value: undefined};
            }
            return {
                GetWorkCardFetch: {
                    status: 'success',
                    response: payload
                },
                Data: data,
                OriData: payload.Data ? {...payload.Data} : undefined
            };
        }),
        [modalGetWorkCardData.error]: merge((payload, state) => {
            return {
                GetWorkCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalAuditWorkCardData]: merge((payload, state) => {
            return {
                AuditWorkCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalAuditWorkCardData.success]: merge((payload, state) => {
            return {
                AuditWorkCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalAuditWorkCardData.error]: merge((payload, state) => {
            return {
                AuditWorkCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalModifyWorkCardData]: merge((payload, state) => {
            return {
                ModifyWorkCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalModifyWorkCardData.success]: merge((payload, state) => {
            return {
                ModifyWorkCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalModifyWorkCardData.error]: merge((payload, state) => {
            return {
                ModifyWorkCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;