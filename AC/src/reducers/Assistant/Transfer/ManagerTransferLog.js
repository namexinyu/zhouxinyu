import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ManagerTransferAction from 'ACTION/Assistant/ManagerTransferAction';
import moment from 'moment';

const {
    mtGetTransferLogList,
    mtGetEmployeeSimpleList
} = ManagerTransferAction;

const STATE_NAME = 'state_ac_managerTransferLog';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            RangeDate: {value: [moment().add(-7, 'days'), moment()]},
            SourceType: {value: '-9999'},
            Name: {value: ''},
            Mobile: {value: ''},
            IDCardNum: {value: ''},
            OldBroker: {value: ''},
            Operator: {value: {value: undefined, text: undefined}}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordListLoading: false,
        RecordList: [],
        RecordCount: 0,
        EmployeeSimpleList: [],
        mtGetTransferLogListFetch: {
            status: 'close',
            response: ''
        },
        mtGetEmployeeSimpleListFetch: {
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
        [mtGetTransferLogList]: merge((payload, state) => {
            return {
                mtGetTransferLogListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [mtGetTransferLogList.success]: merge((payload, state) => {
            return {
                mtGetTransferLogListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [mtGetTransferLogList.error]: merge((payload, state) => {
            return {
                mtGetTransferLogListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordCount: 0,
                RecordListLoading: false
            };
        }),
        [mtGetEmployeeSimpleList]: merge((payload, state) => {
            return {
                mtGetEmployeeSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [mtGetEmployeeSimpleList.success]: merge((payload, state) => {
            return {
                mtGetEmployeeSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                EmployeeSimpleList: payload.Data ? payload.Data.RecordList || [] : []
            };
        }),
        [mtGetEmployeeSimpleList.error]: merge((payload, state) => {
            console.log('mtGetEmployeeSimpleList.error', payload);
            return {
                mtGetEmployeeSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;