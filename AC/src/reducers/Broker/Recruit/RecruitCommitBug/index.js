import merge from 'REDUCER/merge';
import commitRecruitBug from 'ACTION/Broker/Recruit/commitRecruitBug';
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_broker_recruitCommitBug';

function InitialState() {
    return {
        RecruitData: undefined,
        Content: '',
        TargetDepartID: 1,
        commitRecruitBugFetch: {
            status: 'close',
            response: ''
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
        // 请求Action三连发分割线
        [commitRecruitBug]: merge((payload, state) => {
            return {
                commitRecruitBugFetch: {
                    status: 'pending'
                }
            };
        }),
        [commitRecruitBug.success]: merge((payload, state) => {
            return {
                commitRecruitBugFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [commitRecruitBug.error]: merge((payload, state) => {
            return {
                commitRecruitBugFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;