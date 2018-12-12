import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CallbackAction from 'ACTION/Audit/CallbackAction';
import moment from 'moment';

const {
    getCallbackEntryListByUser,
    setCallbackEntryDataByUser
} = CallbackAction;
const STATE_NAME = 'state_audit_callbackEntryListByUser';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            UserName: {value: ''},
            Mobile: {value: ''}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        getCallbackEntryListByUserFetch: {
            status: 'close',
            response: ''
        },
        setCallbackEntryDataByUserFetch: {
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
        [getCallbackEntryListByUser]: merge((payload, state) => {
            return {
                getCallbackEntryListByUserFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getCallbackEntryListByUser.success]: merge((payload, state) => {
            let c_c = (payload.Data || {}).RecordCount || 0;
            if (c_c > 10) c_c = 10;
            return {
                getCallbackEntryListByUserFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: c_c,
                RecordListLoading: false
            };
        }),
        [getCallbackEntryListByUser.error]: merge((payload, state) => {
            return {
                getCallbackEntryListByUserFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setCallbackEntryDataByUser]: merge((payload, state) => {
            return {
                setCallbackEntryDataByUserFetch: {
                    status: 'pending'
                }
            };
        }),
        [setCallbackEntryDataByUser.success]: merge((payload, state) => {
            return {
                setCallbackEntryDataByUserFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setCallbackEntryDataByUser.error]: merge((payload, state) => {
            return {
                setCallbackEntryDataByUserFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;