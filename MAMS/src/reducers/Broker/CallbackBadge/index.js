import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getCallBackBadgeList from 'ACTION/Broker/CallbackBadge/getCallbackBadgeList';
import moment from 'moment';

const STATE_NAME = 'state_broker_callbackBadge';


function InitialState() {
    return {
        state_name: STATE_NAME,
        RecordList: [],
        tmpReplyObj: {},
        queryParams: {
            CheckinRecruit: {value: {value: undefined, text: undefined}},
            WorkCardStatus: {value: ['3', '4']},
            StartDate: {value: undefined},
            StopDate: {value: moment().subtract(2, 'days')},
            UserMobile: {value: undefined},
            UserName: {value: undefined}
        },
        orderParams: {Key: ['CheckinTime'], Order: 1},
        pageParam: {
            currentPage: 1,
            pageSize: 20
        },
        RecordCount: 0,
        getBadgeListFetch: {
            status: 'close',
            response: ''
        }
        // queryParams: {
        //     CheckinRecruitID: undefined,
        //     WorkCardStatus: [3, 4],
        //     StartDate: undefined,
        //     StopDate: moment().subtract(2, 'days'),
        //     UserMobile: undefined,
        //     UserName: undefined
        // },
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
                        CheckinRecruit: {value: {value: undefined, text: undefined}},
                        WorkCardStatus: {value: []},
                        StartDate: {value: undefined},
                        StopDate: {value: moment().subtract(2, 'days')},
                        UserMobile: {value: undefined},
                        UserName: {value: undefined}
                    }
                };
            }
            return {};

        }),
        [getCallBackBadgeList]: merge((payload, state) => {
            return {
                getBadgeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCallBackBadgeList.success]: merge((payload, state) => {
            return {
                getBadgeListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? (payload.Data.UserInforList || []) : [],
                RecordCount: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getCallBackBadgeList.error]: merge((payload, state) => {
            return {
                getBadgeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;