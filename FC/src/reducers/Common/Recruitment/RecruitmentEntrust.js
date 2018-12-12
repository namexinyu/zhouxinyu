import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const {
    BuildRecruitmentEntrust
} = ActionMAMSRecruitment;

const STATE_NAME = 'state_mams_recruitmentEntrust';

function InitialState() {
    return {
        state_name: STATE_NAME,
        Data: undefined,
        Content: undefined,
        PicUrls: [],
        BuildRecruitmentEntrustFetch: {
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
        [BuildRecruitmentEntrust]: merge((payload, state) => {
            return {
                BuildRecruitmentEntrustFetch: {
                    status: 'pending'
                }
            };
        }),
        [BuildRecruitmentEntrust.success]: merge((payload, state) => {
            return {
                BuildRecruitmentEntrustFetch: {
                    status: 'success',
                    response: payload
                },
                Data: undefined,
                Content: undefined,
                PicUrls: []
            };
        }),
        [BuildRecruitmentEntrust.error]: merge((payload, state) => {
            return {
                BuildRecruitmentEntrustFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;