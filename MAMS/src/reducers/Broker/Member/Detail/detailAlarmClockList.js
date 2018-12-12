import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberAlarmList from 'ACTION/Broker/MemberDetail/getMemberAlarmList';
import deleteAlarm from 'ACTION/Broker/MemberDetail/deleteAlarm';
import createAlarm from 'ACTION/Broker/MemberDetail/createAlarm';

const STATE_NAME = 'state_broker_member_detail_alarm_clock';

function InitialState() {
    return {
        showAlarmList: false,
        alarmClockList: [],
        showCreateBox: false,
        createAlarmDate: '',
        createAlarmTime: '',
        createAlarmContent: '',
        getMemberAlarmListFetch: {
            status: 'close',
            response: ''
        },
        deleteAlarmFetch: {
            status: 'close',
            response: ''
        },
        createAlarmFetch: {
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
                let temp = Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
                return temp;
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
        [getMemberAlarmList]: merge((payload, state) => {
            return {
                getMemberAlarmListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberAlarmList.success]: merge((payload, state) => {
            return {
                getMemberAlarmListFetch: {
                    status: 'success',
                    response: payload
                },
                alarmClockList: (payload.Data && payload.Data.ReminderList) || []
            };
        }),
        [getMemberAlarmList.error]: merge((payload, state) => {
            return {
                getMemberAlarmListFetch: {
                    status: 'error',
                    response: payload
                }
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
        [createAlarm]: merge((payload, state) => {
            return {
                createAlarmFetch: {
                    status: 'pending'
                }
            };
        }),
        [createAlarm.success]: merge((payload, state) => {
            return {
                createAlarmFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createAlarm.error]: merge((payload, state) => {
            return {
                createAlarmFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;