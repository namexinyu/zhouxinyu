import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import TransferApplyAction from 'ACTION/Broker/TransferApply/TransferApplyAction';
import moment from 'moment';
import {Constant} from 'UTIL/constant/index';

const {
    GetTransferApplyList,
    CallTransferApply
} = TransferApplyAction;

const STATE_NAME = 'state_broker_transferApplyList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            RangeDate: {value: [moment().add(-90, 'days'), moment()]},
            BrokerNum: {value: ''},
            Name: {value: ''},
            Mobile: {value: ''},
            ApplyResult: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: Constant.pageSize
        },
        ApplyData: {
            Mobile: {value: ''},
            Reason: {value: ''}
        },
        RecordListLoading: false,
        RecordList: [],
        RecordCount: 0,
        EmployeeSimpleList: [],
        GetTransferApplyListFetch: {
            status: 'close',
            response: ''
        },
        CallTransferApplyFetch: {
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [GetTransferApplyList]: merge((payload, state) => {
            return {
                GetTransferApplyListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [GetTransferApplyList.success]: merge((payload, state) => {
            return {
                GetTransferApplyListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetTransferApplyList.error]: merge((payload, state) => {
            return {
                GetTransferApplyListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordCount: 0,
                RecordListLoading: false
            };
        }),
        // 华理的请求三连ACTION分割线
        [CallTransferApply]: merge((payload, state) => {
            return {
                CallTransferApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [CallTransferApply.success]: merge((payload, state) => {
            return {
                CallTransferApplyFetch: {
                    status: 'success',
                    response: payload
                },
                ApplyData: {
                    Mobile: '',
                    Reason: ''
                },
                showModal: false
            };
        }),
        [CallTransferApply.error]: merge((payload, state) => {
            return {
                CallTransferApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;