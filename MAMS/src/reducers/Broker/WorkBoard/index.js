import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getTodayTrackData from 'ACTION/Broker/WorkBoard/getTodayTrack';
import getTodayTrackSignData from 'ACTION/Broker/WorkBoard/getTodayTrackSign';
import getWeekData from 'ACTION/Broker/WorkBoard/getWeekData';

const STATE_NAME = 'state_broker_workBoard';

function InitialState() {
    return {
        todayTrack: {},
        todayTrackSign: {},
        weekData: {
            LastWeekEntryCount: 0,
            MonthEntryCount: 0,
            WeekEntryCount: 0,
            WeekEntryList: []
        },

        getWeekDataFetch: {
            status: 'close',
            response: ''
        },
        getTodayTrackSignDataFetch: {
            status: 'close',
            response: ''
        },
        getTodayTrackDataFetch: {
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

        [getWeekData]: merge((payload, state) => {
            return {
                getWeekDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [getWeekData.success]: merge((payload, state) => {
            return {
                getWeekDataFetch: {
                    status: 'success',
                    response: payload
                },
                weekData: payload.Data || {}
            };
        }),
        [getWeekData.error]: merge((payload, state) => {
            return {
                getWeekDataFetch: {
                    status: 'error',
                    response: payload.Data
                }
            };
        }),

        [getTodayTrackSignData]: merge((payload, state) => {
            return {
                getTodayTrackSignDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTodayTrackSignData.success]: merge((payload, state) => {
            return {
                getTodayTrackSignDataFetch: {
                    status: 'success',
                    response: payload
                },
                todayTrackSign: payload.Data || {}
            };
        }),
        [getTodayTrackSignData.error]: merge((payload, state) => {
            return {
                getTodayTrackSignDataFetch: {
                    status: 'error',
                    response: payload.Data
                }
            };
        }),

        [getTodayTrackData]: merge((payload, state) => {
            return {
                getTodayTrackDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTodayTrackData.success]: merge((payload, state) => {
            return {
                getTodayTrackDataFetch: {
                    status: 'success',
                    response: payload
                },
                todayTrack: payload.Data || {}
            };
        }),
        [getTodayTrackData.error]: merge((payload, state) => {
            return {
                getTodayTrackDataFetch: {
                    status: 'error',
                    response: payload.Data
                }
            };
        })
    }
};
export default Reducer;