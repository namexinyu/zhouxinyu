import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';

const STATE_NAME = 'state_broker_member_detail_status_record';

function InitialState() {
    return {
        followedList: [],
        recordIndex: 0,
        pageSize: 20,
        getMemberStatusRecordFetch: {
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
        [getMemberStatusRecord]: merge((payload, state) => {
            return {
                getMemberStatusRecordFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberStatusRecord.success]: merge((payload, state) => {
            return {
                getMemberStatusRecordFetch: {
                    status: 'success',
                    response: payload
                },
                followedList: (payload.Data && payload.Data.RecordList) || []
            };
        }),
        [getMemberStatusRecord.error]: merge((payload, state) => {
            return {
                getMemberStatusRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;