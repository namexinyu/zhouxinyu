import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberInterviewRecord from 'ACTION/Broker/MemberDetail/getMemberInterviewRecord';

const STATE_NAME = 'state_broker_member_detail_interview_record';

function InitialState() {
    return {
        interviewRecordTotal: 0,
        interviewRecordList: [],
        pageSize: 20,
        page: 1,
        getMemberInterviewRecordFetch: {
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
        [getMemberInterviewRecord]: merge((payload, state) => {
            return {
                getMemberInterviewRecordFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberInterviewRecord.success]: merge((payload, state) => {
            return {
                getMemberInterviewRecordFetch: {
                    status: 'success',
                    response: payload
                },
                interviewRecordList: (payload.Data && payload.Data.RecordList) || [],
                interviewRecordTotal: (payload.Data && payload.Data.PageInfo.TotalCount) || 0

            };
        }),
        [getMemberInterviewRecord.error]: merge((payload, state) => {
            return {
                getMemberInterviewRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
