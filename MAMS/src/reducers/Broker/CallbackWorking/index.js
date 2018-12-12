import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import getCallbackWorkingList from 'ACTION/Broker/CallbackWorking/getCallbackWorkingList';
import updateWorkingReply from 'ACTION/Broker/CallbackWorking/updateWorkingReply';
import setWorkingReply from 'ACTION/Broker/CallbackWorking/setWorkingReply';

const STATE_NAME = 'state_broker_callbackWorking';


function InitialState() {
    return {
        state_name: STATE_NAME,
        RecordList: [],
        tmpReplyObj: {},
        queryParams: {
            CheckinRecruit: {value: undefined},
            EntryCallbackStatus: {value: '1'},
            StartDate: {value: undefined},
            StopDate: {value: moment().subtract(6, 'days')},
            UserMobile: {value: undefined},
            UserName: {value: undefined}
        },
        orderParams: {Key: ['CheckinTime'], Order: 1},
        pageParam: {
            currentPage: 1,
            pageSize: 20
        },
        RecordCount: 0,
        getWorkingListFetch: {
            status: 'close',
            response: ''
        },
        setWorkingReplyFetch: {
            status: 'close',
            params: undefined,
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
                    queryParams: {
                        CheckinRecruit: {value: undefined},
                        EntryCallbackStatus: {value: '-9999'},
                        StartDate: {value: undefined},
                        StopDate: {value: moment().subtract(6, 'days')},
                        UserMobile: {value: undefined},
                        UserName: {value: undefined}
                    }
                };
            }
            return {};

        }),
        [updateWorkingReply]: merge((payload, state) => {
            return {
                tmpReplyObj: payload.tmpReplyObj
            };
        }),
        [getCallbackWorkingList]: merge((payload, state) => {
            return {
                getWorkingListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCallbackWorkingList.success]: merge((payload, state) => {

            return {
                getWorkingListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? (payload.Data.UserInforList || []) : [],
                RecordCount: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getCallbackWorkingList.error]: merge((payload, state) => {
            return {
                getWorkingListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setWorkingReply]: merge((payload, state) => {
            return {
                setWorkingReplyFetch: {
                    status: 'pending',
                    params: payload
                }
            };
        }),
        [setWorkingReply.success]: merge((payload, state) => {
            return {
                setWorkingReplyFetch: {
                    status: 'success',
                    params: state.setWorkingReplyFetch.params,
                    response: payload
                }
            };
        }),
        [setWorkingReply.error]: merge((payload, state) => {
            return {
                setWorkingReplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;