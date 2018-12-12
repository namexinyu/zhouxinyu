import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getBirthDayRemindList from 'ACTION/Broker/Remind/getBirthDayRemindList';

const STATE_NAME = 'state_broker_birthdayRemind';

function InitialState() {
    return {
        birthdayRemindList: [],
        // orderParams: [{Key: 'iUserID', Order: 1}],
        queryParams: {},
        currentPage: 1,
        pageSize: 5,
        totalSize: 0,
        getBirthDayRemindListFetch: {
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
        [getBirthDayRemindList]: merge((payload, state) => {
            return {
                getBirthDayRemindListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBirthDayRemindList.success]: merge((payload, state) => {
            return {
                getBirthDayRemindListFetch: {
                    status: 'success',
                    response: payload
                },
                birthdayRemindList: payload.Data.Brithdaytemp || [],
                totalSize: payload.Data.RecordCount || 0
            };
        }),
        [getBirthDayRemindList.error]: merge((payload, state) => {
            return {
                getBirthDayRemindListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;