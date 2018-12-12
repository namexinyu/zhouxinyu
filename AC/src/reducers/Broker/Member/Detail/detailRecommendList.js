import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberRecommendList from 'ACTION/Broker/MemberDetail/getMemberRecommendList';
import helpMemberRecommend from 'ACTION/Broker/MemberDetail/helpMemberRecommend';

const STATE_NAME = 'state_broker_member_detail_recommend_list';

function InitialState() {
    return {
        recommendList: [],
        createRecommendUserID: {},
        createRecommendName: {},
        createRecommendPhone: {},
        searchKey: {},
        getMemberRecommendListFetch: {
            status: 'close',
            response: ''
        },
        helpMemberRecommendFetch: {
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
        [getMemberRecommendList]: merge((payload, state) => {
            return {
                getMemberRecommendListFetch: {
                    status: 'pending'
                }

            };
        }),
        [getMemberRecommendList.success]: merge((payload, state) => {
            return {
                getMemberRecommendListFetch: {
                    status: 'success',
                    response: payload
                },
                recommendList: (payload.Data && payload.Data.RecommendRecords) || []
            };
        }),
        [getMemberRecommendList.error]: merge((payload, state) => {
            return {
                getMemberRecommendListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [helpMemberRecommend]: merge((payload, state) => {
            return {
                helpMemberRecommendFetch: {
                    status: 'pending'
                }

            };
        }),
        [helpMemberRecommend.success]: merge((payload, state) => {
            return {
                helpMemberRecommendFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [helpMemberRecommend.error]: merge((payload, state) => {
            return {
                helpMemberRecommendFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;