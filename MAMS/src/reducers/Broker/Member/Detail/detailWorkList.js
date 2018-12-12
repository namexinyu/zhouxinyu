import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberWorkHistory from 'ACTION/Broker/MemberDetail/getMemberWorkHistory';

const STATE_NAME = 'state_broker_member_detail_work_list';

function InitialState() {
    return {
        historyList: [],
        getMemberWorkHistoryFetch: {
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
        [getMemberWorkHistory]: merge((payload, state) => {
            return {
                getMemberWorkHistoryFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberWorkHistory.success]: merge((payload, state) => {
            return {
                getMemberWorkHistoryFetch: {
                    status: 'success',
                    response: payload
                },
                historyList: (payload.Data && payload.Data.CareerList) || []
            };
        }),
        [getMemberWorkHistory.error]: merge((payload, state) => {
            return {
                getMemberWorkHistoryFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;