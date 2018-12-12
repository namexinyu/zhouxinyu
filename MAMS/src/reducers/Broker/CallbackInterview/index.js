import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import getCallBackInterviewList from 'ACTION/Broker/CallbackInterview/getCallbackInterviewList';
import updateInterviewReply from 'ACTION/Broker/CallbackInterview/updateInterviewReply';
import setInterviewReply from 'ACTION/Broker/CallbackInterview/setInterviewReply';

const STATE_NAME = 'state_broker_callbackInterview';


function InitialState() {
    return {
        state_name: STATE_NAME,
        RecordList: [],
        tmpReplyObj: {},
        queryParams: {
            CheckinRecruit: {value: {value: undefined, text: undefined}},
            InterviewStatus: {value: []},
            StartDate: {value: moment()},
            StopDate: {value: moment()},
            UserMobile: {value: undefined},
            UserName: {value: undefined},
            CallbackStatus: {value: '-9999'}
        },
        otherParams: {
            RecruitTmp: undefined
        },
        orderParams: {Key: ['CheckinTime'], Order: 1},
        pageParam: {
            currentPage: 1,
            pageSize: 20
        },
        RecordCount: 0,
        getInterviewListFetch: {
            status: 'close',
            response: ''
        },
        setInterviewReplyFetch: {
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
                    queryParams: new InitialState().queryParams,
                    otherParams: new InitialState().otherParams
                };
            }
            return {};

        }),
        [updateInterviewReply]: merge((payload, state) => {
            return {
                tmpReplyObj: payload.tmpReplyObj
            };
        }),
        [getCallBackInterviewList]: merge((payload, state) => {
            return {
                getInterviewListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCallBackInterviewList.success]: merge((payload, state) => {
            return {
                getInterviewListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? (payload.Data.UserInforList || []) : [],
                RecordCount: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getCallBackInterviewList.error]: merge((payload, state) => {
            return {
                getInterviewListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setInterviewReply]: merge((payload, state) => {
            return {
                setInterviewReplyFetch: {
                    status: 'pending',
                    params: payload
                }
            };
        }),
        [setInterviewReply.success]: merge((payload, state) => {
            return {
                setInterviewReplyFetch: {
                    status: 'success',
                    params: state.setInterviewReplyFetch.params,
                    response: payload
                }
            };
        }),
        [setInterviewReply.error]: merge((payload, state) => {
            return {
                setInterviewReplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })

    }
};
export default Reducer;