import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';

import getMemberRecruitMatchInfo from 'ACTION/Broker/Recruit/getMemberRecruitMatchInfo';

const STATE_NAME = 'state_broker_recruitMatchPhone';

function InitialState() {
    return {
        MemberPhone: "", // 用于会员匹配工作标签
        MatchRes: undefined,
        getMemberRecruitMatchInfoFetch: {
            status: 'close',
            response: undefined
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
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
        // 请求Action三连发分割线
        [getMemberRecruitMatchInfo]: merge((payload, state) => {
            return {
                getMemberRecruitMatchInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberRecruitMatchInfo.success]: merge((payload, state) => {
            return {
                getMemberRecruitMatchInfoFetch: {
                    status: 'success',
                    response: payload
                },
                MatchRes: payload.Data
            };
        }),
        [getMemberRecruitMatchInfo.error]: merge((payload, state) => {
            return {
                getMemberRecruitMatchInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })

    }
};
export default Reducer;