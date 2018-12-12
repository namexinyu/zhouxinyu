import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const {
    GetMAMSRecruitmentRequireInfo
} = ActionMAMSRecruitment;

const STATE_NAME = 'state_mams_recruitmentRequireInfo';

function InitialState() {
    return {
        state_name: STATE_NAME,
        Data: undefined,
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        GetMAMSRecruitmentRequireInfoFetch: {
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
                return new InitialState();
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [GetMAMSRecruitmentRequireInfo]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentRequireInfoFetch: {
                    status: 'pending'
                },
                Data: undefined
            };
        }),
        [GetMAMSRecruitmentRequireInfo.success]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentRequireInfoFetch: {
                    status: 'success',
                    response: payload
                },
                Data: payload.Data || {}
            };
        }),
        [GetMAMSRecruitmentRequireInfo.error]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentRequireInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;