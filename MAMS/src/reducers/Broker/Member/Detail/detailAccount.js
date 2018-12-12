import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberAccountRecord from 'ACTION/Broker/MemberDetail/getMemberAccountRecord';

const STATE_NAME = 'state_broker_member_detail_account';

function InitialState() {
    return {
        recordList: [],
        totalAmount: '',
        getMemberAccountRecordFetch: {
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
        [getMemberAccountRecord]: merge((payload, state) => {
            return {
                getMemberAccountRecordFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberAccountRecord.success]: merge((payload, state) => {
            return {
                getMemberAccountRecordFetch: {
                    status: 'success',
                    response: payload
                },
                totalAmount: (payload.Data && payload.Data.TotalAmount) || 0,
                recordList: (payload.Data && payload.Data.AccountRecords) || []
            };
        }),
        [getMemberAccountRecord.error]: merge((payload, state) => {
            return {
                getMemberAccountRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;