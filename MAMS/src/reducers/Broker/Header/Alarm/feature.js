import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AlarmAction from 'ACTION/Broker/Header/Alarm';

const {
    reminderGet,
    deleteAlarm
} = AlarmAction;

const STATE_NAME = 'state_broker_header_alarm_feature';

function InitialState() {
    return {
        q_Date: {},
        q_UserName: {},
        q_Content: {},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [],

        reminderGetFetch: {
            status: 'close',
            response: ''
        },
        deleteAlarmFetch: {
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
        [reminderGet]: merge((payload, state) => {
            return {
                reminderGetFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [reminderGet.success]: merge((payload, state) => {
            return {
                reminderGetFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.ReminderList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [reminderGet.error]: merge((payload, state) => {
            return {
                reminderGetFetch: {
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
        })
    }
};
export default Reducer;