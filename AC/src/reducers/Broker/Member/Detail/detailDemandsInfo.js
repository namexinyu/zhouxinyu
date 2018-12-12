import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberDemandsInfo from 'ACTION/Broker/MemberDetail/getMemberDemandsInfo';

const STATE_NAME = 'state_broker_member_detail_demands_info';

function InitialState() {
    return {
        demandsList: [],
        recordCount: 0,
        getMemberDemandsInfoFetch: {
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
        [getMemberDemandsInfo]: merge((payload, state) => {
            return {
                getMemberDemandsInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberDemandsInfo.success]: merge((payload, state) => {
            return {
                getMemberDemandsInfoFetch: {
                    status: 'success',
                    response: payload
                },
                recordCount: (payload.Data && payload.Data.RecordCount) || 0,
                demandsList: (payload.Data && payload.Data.RecordList) || []
            };
        }),
        [getMemberDemandsInfo.error]: merge((payload, state) => {
            return {
                getMemberDemandsInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
