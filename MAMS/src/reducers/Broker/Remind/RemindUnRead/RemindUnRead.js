import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getRemindUnReadList from 'ACTION/Broker/Remind/getRemindUnReadList';
import setRemindReaded from 'ACTION/Broker/Remind/setRemindReaded';

const STATE_NAME = 'state_broker_remindUnRead';

function InitialState() {
    return {
        remindUnReadList: [],
        showTag: 'unread',
        queryParams: {
            MemberName: '',
            Newstype: [],
            ReStarTime: null,
            ReEndTime: null,
            ReadType: 1
        },
        RemindID: [], // 用于提醒标记已读
        // orderParams: {Key: 'NewsTime', Order: 1},
        orderParams: [],
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        getRemindUnReadListFetch: {
            status: 'close',
            response: ''
        },
        setRemindReadedFetch: {
            status: 'close',
            prams: [],
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
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
        [getRemindUnReadList]: merge((payload, state) => {
            return {
                getRemindUnReadListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRemindUnReadList.success]: merge((payload, state) => {
            return {
                getRemindUnReadListFetch: {
                    status: 'success',
                    response: payload
                },
                remindUnReadList: payload.Data.MemberList || [],
                totalSize: payload.Data.RecordCount || 0
            };
        }),
        [getRemindUnReadList.error]: merge((payload, state) => {
            return {
                getRemindUnReadListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setRemindReaded]: merge((payload, state) => {
            return {
                setRemindReadedFetch: {
                    status: 'pending',
                    params: payload
                }
            };
        }),
        [setRemindReaded.success]: merge((payload, state) => {
            return {
                setRemindReadedFetch: {
                    status: 'success',
                    params: state.setRemindReadedFetch.params,
                    response: payload
                }
            };
        }),
        [setRemindReaded.error]: merge((payload, state) => {
            return {
                setRemindReadedFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;