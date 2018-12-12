import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

import getPerformance from 'ACTION/Broker/Career/getPerformance';

const STATE_NAME = 'state_broker_career_performance';

function InitialState() {
    let date = new Date();
    return {
        selectMonth: date.getMonth() + 1,
        selectYear: date.getFullYear(),
        performances: {},
        getPerformanceFetch: {
            status: 'pending',
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
        [getPerformance]: merge((payload, state) => {
            return {
                getPerformanceFetch: {
                    status: 'pending'
                },
                performances: null
            };
        }),
        [getPerformance.success]: merge((payload, state) => {
            return {
                getPerformanceFetch: {
                    status: 'success',
                    response: payload
                },
                performances: payload.Data || {}
            };
        }),
        [getPerformance.error]: merge((payload, state) => {
            return {
                getPerformanceFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;