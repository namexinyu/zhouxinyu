import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CallbackAction from 'ACTION/Audit/CallbackAction';
import moment from 'moment';

const {
    getCallbackEntryList,
    setCallbackEntryData
} = CallbackAction;
const STATE_NAME = 'state_audit_callbackEntryList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            // StartDate: {value: undefined},
            // StopDate: {value: undefined},
            // RangeDate: {value: [moment().subtract(2, 'days'), moment()]},
            RangeDate: {value: [undefined, undefined]},
            UserName: {value: ''},
            Mobile: {value: ''},
            Recruit: {value: {value: undefined, text: undefined}},
            IsAll: {value: '1'},
            InterviewStatus: {value: '-9999'},
            JFFInterviewStatus: {value: '-9999'},
            WorkCardStatus: {value: '-9999'}
        },
        EntType: 0,
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        getCallbackEntryListFetch: {
            status: 'close',
            response: ''
        },
        setCallbackEntryDataFetch: {
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
                return {queryParams: init.queryParams};
            }
            return {};
        }),
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
        [getCallbackEntryList]: merge((payload, state) => {
            return {
                getCallbackEntryListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [getCallbackEntryList.success]: merge((payload, state) => {
            return {
                getCallbackEntryListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [getCallbackEntryList.error]: merge((payload, state) => {
            return {
                getCallbackEntryListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setCallbackEntryData]: merge((payload, state) => {
            return {
                setCallbackEntryDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [setCallbackEntryData.success]: merge((payload, state) => {
            return {
                setCallbackEntryDataFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setCallbackEntryData.error]: merge((payload, state) => {
            return {
                setCallbackEntryDataFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;