import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import {
    reminderGet,
    reminderGetPast,
    deleteAlarm,
    setQueryParams,
    resetQueryParams,
    resetDataList,
    selectShowAlarmType,
    selectPage,
    markHeaderAlarm
} from 'ACTION/Broker/Header/Alarm';
import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';

const STATE_NAME = 'state_broker_header_alarm';

function InitialState() {
    return {
        tabKey: 'tab1',
        showAlarmType: 0, // 0-已过期,1-未到期
        past: { // 0-已过期
            alarmType: 0,
            dataList: [],
            queryParams: {
                Who: '',
                DateUpperBound: '',
                DateLowerBound: '',
                Content: '',
                Read: 0
            },
            currentPage: 1,
            pageSize: 10,
            totalSize: 0,
            getDataListFetch: {
                status: 'close',
                response: ''
            }
        },
        future: { // 1-未到期
            alarmType: 1,
            dataList: [],
            queryParams: {
                Who: '',
                DateUpperBound: '',
                DateLowerBound: '',
                Content: ''
            },
            currentPage: 1,
            pageSize: 10,
            totalSize: 0,
            getDataListFetch: {
                status: 'close',
                response: ''
            }
        },
        deleteAlarmFetch: {
            status: 'close',
            response: ''
        },
        personalRemindCount: 0,
        getPersonalRemindCountFetch: {
            status: 'close',
            response: ''
        },
        markHeaderAlarmFetch: {
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
        [setQueryParams]: (state, payload) => (
            payload.type === 1 ? {
                ...state,
                future: {
                    ...state.future,
                    queryParams: payload.queryParams
                }
            } : payload.type === 0 ? {
                ...state,
                past: {
                    ...state.past,
                    queryParams: payload.queryParams
                }
            } : state
        ),
        [resetQueryParams]: (state, payload) => {
            let initState = new InitialState();
            return payload.type === 1 ? {
                ...state,
                future: {
                    ...state.future,
                    queryParams: initState.future.queryParams
                }
            } : payload.type === 0 ? {
                ...state,
                past: {
                    ...state.past,
                    queryParams: initState.past.queryParams
                }
            } : payload;
        },
        [resetDataList]: (state, payload) => {
            let initState = new InitialState();
            return payload.type === 1 ? {
                ...state,
                future: {
                    ...state.future,
                    currentPage: initState.future.currentPage,
                    pageSize: initState.future.pageSize,
                    totalSize: initState.future.totalSize,
                    dataList: initState.future.dataList
                }
            } : payload.type === 0 ? {
                ...state,
                past: {
                    ...state.past,
                    currentPage: initState.past.currentPage,
                    pageSize: initState.past.pageSize,
                    totalSize: initState.past.totalSize,
                    dataList: initState.past.dataList
                }
            } : payload;
        },
        [reminderGet]: (state, payload) => ({
            ...state,
            future: {
                ...state.future,
                getDataListFetch: {
                    status: 'pending'
                }
            }
        }),
        [reminderGet.success]: (state, payload) => ({
            ...state,
            future: {
                ...state.future,
                getDataListFetch: {
                    status: 'success',
                    response: payload
                },
                dataList: payload.Data.ReminderList,
                totalSize: payload.Data.RecordCount
            }
        }),
        [reminderGet.error]: (state, payload) => ({
            ...state,
            future: {
                ...state.future,
                getDataListFetch: {
                    status: 'error'
                }
            }
        }),
        [reminderGetPast]: (state, payload) => ({
            ...state,
            past: {
                ...state.past,
                getDataListFetch: {
                    status: 'pending'
                }
            }
        }),
        [reminderGetPast.success]: (state, payload) => ({
            ...state,
            past: {
                ...state.past,
                getDataListFetch: {
                    status: 'success',
                    response: payload
                },
                dataList: payload.Data.ReminderList,
                totalSize: payload.Data.RecordCount
            }
        }),
        [reminderGetPast.error]: (state, payload) => ({
            ...state,
            past: {
                ...state.past,
                getDataListFetch: {
                    status: 'error'
                }
            }
        }),
        [deleteAlarm]: (state, payload) => ({
            ...state,
            deleteAlarmFetch: {
                status: 'pending'
            }
        }),
        [deleteAlarm.success]: (state, payload) => ({
            ...state,
            deleteAlarmFetch: {
                status: 'success',
                response: payload
            }
        }),
        [deleteAlarm.error]: (state, payload) => ({
            ...state,
            deleteAlarmFetch: {
                status: 'error',
                response: payload
            }
        }),
        [selectShowAlarmType]: (state, payload) => ({
            ...state,
            showAlarmType: payload.type
        }),
        [selectPage]: (state, payload) => (
            payload.type === 1 ? {
                ...state,
                future: {
                    ...state.future,
                    currentPage: payload.page
                }
            } : payload.type === 0 ? {
                ...state,
                past: {
                    ...state.past,
                    currentPage: payload.page
                }
            } : payload
        ),
        // 获取自定义提醒数量
        [getPersonalRemindCount]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getPersonalRemindCount.success]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'success',
                    response: payload
                },
                personalRemindCount: payload.Data.RemindCount
            };
        }),
        [getPersonalRemindCount.error]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [markHeaderAlarm]: merge((payload, state) => {
            return {
                markHeaderAlarmFetch: {
                    status: 'pending'
                }
            };
        }),
        [markHeaderAlarm.success]: merge((payload, state) => {
            return {
                markHeaderAlarmFetch: {
                    status: 'success',
                    response: payload
                }
            };

        }),
        [markHeaderAlarm.error]: merge((payload, state) => {
            return {
                markHeaderAlarmFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;