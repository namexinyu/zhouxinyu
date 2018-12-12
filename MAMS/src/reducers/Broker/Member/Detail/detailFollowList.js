import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberFollowedRecruitList from 'ACTION/Broker/MemberDetail/getMemberFollowedRecruitList';

const STATE_NAME = 'state_broker_member_detail_follow_list';

function InitialState() {
    return {
        followedList: [],
        getMemberFollowedRecruitListFetch: {
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
        [getMemberFollowedRecruitList]: merge((payload, state) => {
            return {
                getMemberFollowedRecruitListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberFollowedRecruitList.success]: merge((payload, state) => {
            return {
                getMemberFollowedRecruitListFetch: {
                    status: 'success',
                    response: payload
                },
                followedList: (payload.Data && payload.Data.RecruitInfos) || []
            };
        }),
        [getMemberFollowedRecruitList.error]: merge((payload, state) => {
            return {
                getMemberFollowedRecruitListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;