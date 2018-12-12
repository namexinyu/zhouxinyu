import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import IDCardAction from 'ACTION/Audit/Modal/IDCardAction';
import getAntAreaOptions, {spreadAreaToPCA} from 'CONFIG/antAreaOptions';
import moment from 'moment';


const {
    modalGetIDCardData,
    modalAuditIDCardData,
    modalModifyIDCardData
} = IDCardAction;
const STATE_NAME = 'state_audit_idCardModal';

// 结构说明：列表页点击row时，传入ID字段，根据ID字段触发GetXXXData请求获取该条记录数据并赋值给Data与OriData,用于重置操作
function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        Data: undefined,
        OriData: undefined,
        GetIDCardFetch: {
            status: 'close',
            response: ''
        },
        AuditIDCardFetch: {
            status: 'close',
            response: ''
        },
        ModifyIDCardFetch: {
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
        [modalGetIDCardData]: merge((payload, state) => {
            return {
                GetIDCardFetch: {
                    status: 'pending'
                },
                Data: undefined,
                OriData: undefined
            };
        }),
        [modalGetIDCardData.success]: merge((payload, state) => {
            let data = payload.Data ? Object.keys(payload.Data).reduce((obj, key) => Object.assign(obj, {[key]: {value: payload.Data[key]}}), {}) : undefined;
            if (data.ValidateDate && data.ValidateDate.value && moment(data.ValidateDate.value).isValid()) {
                data.ValidateDate = {value: moment(data.ValidateDate.value)};
            } else {
                data.ValidateDate = {value: undefined};
            }
            if (data.AreaCode && data.AreaCode.value) {
                data.AreaCode = {value: spreadAreaToPCA(data.AreaCode.value)};
            }
            if (data.Native && data.Native.value) {
                data.Native = {value: data.Native.value + ''};
            } else {
                data.Native = {value: undefined};
            }
            return {
                GetIDCardFetch: {
                    status: 'success',
                    response: payload
                },
                Data: data,
                OriData: payload.Data ? {...payload.Data} : undefined
            };
        }),
        [modalGetIDCardData.error]: merge((payload, state) => {
            return {
                GetIDCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalAuditIDCardData]: merge((payload, state) => {
            return {
                AuditIDCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalAuditIDCardData.success]: merge((payload, state) => {
            return {
                AuditIDCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalAuditIDCardData.error]: merge((payload, state) => {
            return {
                AuditIDCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION
        [modalModifyIDCardData]: merge((payload, state) => {
            return {
                ModifyIDCardFetch: {
                    status: 'pending'
                }
            };
        }),
        [modalModifyIDCardData.success]: merge((payload, state) => {
            return {
                ModifyIDCardFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modalModifyIDCardData.error]: merge((payload, state) => {
            return {
                ModifyIDCardFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;