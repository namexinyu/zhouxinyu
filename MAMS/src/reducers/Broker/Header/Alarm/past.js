import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import AlarmAction from 'ACTION/Broker/Header/Alarm';

const {
    reminderGetPast,
    deleteAlarm,
    reminderMarkAsRead
} = AlarmAction;
import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';

const STATE_NAME = 'state_broker_header_alarm_past';

function InitialState() {
    return {
        tabKey: 'tab1',

        q_Date: {},
        q_UserName: {},
        q_Content: {},
        q_Read: {value: '0'},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [],

        reminderGetPastFetch: {
            status: 'close',
            response: ''
        },
        deleteAlarmFetch: {
            status: 'close',
            response: ''
        },
        reminderMarkAsReadFetch: {
            status: 'close',
            response: ''
        },

        personalRemindCount: 0,
        getPersonalRemindCountFetch: {
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
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
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
        [reminderGetPast]: merge((payload, state) => {
            return {
                reminderGetPastFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [reminderGetPast.success]: merge((payload, state) => {
            return {
                reminderGetPastFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.ReminderList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [reminderGetPast.error]: merge((payload, state) => {
            return {
                reminderGetPastFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [deleteAlarm]: merge((payload, state) => {
            return {
                deleteAlarmFetch: {
                    status: 'pending'
                }
            };
        }),
        [deleteAlarm.success]: merge((payload, state) => {
            return {
                deleteAlarmFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [deleteAlarm.error]: merge((payload, state) => {
            return {
                deleteAlarmFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [reminderMarkAsRead]: merge((payload, state) => {
            return {
                reminderMarkAsReadFetch: {
                    status: 'pending'
                }
            };
        }),
        [reminderMarkAsRead.success]: merge((payload, state) => {
            return {
                reminderMarkAsReadFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [reminderMarkAsRead.error]: merge((payload, state) => {
            return {
                reminderMarkAsReadFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getPersonalRemindCount]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'pending'
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
        })
    }
};
export default Reducer;