import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getRemindHistoryList from 'ACTION/Broker/Remind/getRemindHistoryList';
import setRemindDeleted from 'ACTION/Broker/Remind/setRemindDeleted';

const STATE_NAME = 'state_broker_remindHistory';

function InitialState() {
    return {
        remindHistoryList: [],
        DelRemindID: [], // 用于勾选删除提醒
        queryParams: {
            MemberName: '',
            Newstype: [],
            ReStarTime: null,
            ReEndTime: null,
            ReadType: 1
        },
        // orderParams: {Key: 'NewsTime', Order: 1},
        orderParams: [],
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        getRemindHistoryFetch: {
            status: 'close',
            response: ''
        },
        setRemindDeletedFetch: {
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
        [getRemindHistoryList]: merge((payload, state) => {
            return {
                getRemindHistoryFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRemindHistoryList.success]: merge((payload, state) => {
            return {
                getRemindHistoryFetch: {
                    status: 'success',
                    response: payload
                },
                remindHistoryList: payload.Data.MemberList || [],
                totalSize: payload.Data.RecordCount || 0
            };
        }),
        [getRemindHistoryList.error]: merge((payload, state) => {
            return {
                getRemindHistoryFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [setRemindDeleted]: merge((payload, state) => {
            return {
                setRemindDeletedFetch: {
                    status: 'pending',
                    params: payload
                }
            };
        }),
        [setRemindDeleted.success]: merge((payload, state) => {
            return {
                setRemindDeletedFetch: {
                    status: 'success',
                    params: state.setRemindDeletedFetch.params,
                    response: payload
                }
            };
        }),
        [setRemindDeleted.error]: merge((payload, state) => {
            return {
                setRemindDeletedFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;