import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberEnrollRecord from 'ACTION/Broker/MemberDetail/getMemberEnrollRecord';

const STATE_NAME = 'state_broker_member_detail_enroll_record';

function InitialState() {
    return {
        enrollRecordTotal: 0,
        enrollRecordList: [],
        pageSize: 20,
        page: 1,
        getMemberEnrollRecordFetch: {
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
        [getMemberEnrollRecord]: merge((payload, state) => {
            return {
                getMemberEnrollRecordFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberEnrollRecord.success]: merge((payload, state) => {
            return {
                getMemberEnrollRecordFetch: {
                    status: 'success',
                    response: payload
                },
                enrollRecordList: (payload.Data && payload.Data.RecordList) || [],
                enrollRecordTotal: (payload.Data && payload.Data.PageInfo.TotalCount) || 0

            };
        }),
        [getMemberEnrollRecord.error]: merge((payload, state) => {
            return {
                getMemberEnrollRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
