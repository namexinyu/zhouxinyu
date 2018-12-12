import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ReplyDepartEntrust from 'ACTION/Common/Assistance/ReplyDepartEntrust';
import EvaluateDepartEntrust from 'ACTION/Common/Assistance/EvaluateDepartEntrust';
import CloseDepartEntrust from 'ACTION/Common/Assistance/CloseDepartEntrust';

const STATE_NAME = 'state_mams_assistanceDetail';

function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        Data: undefined,
        ReplyList: [],
        ReplyData: {
            Content: '',
            PicUrls: []
        },
        GradeData: {
            Grade: '-9999',
            GradeComment: ''
        },
        ReplyDepartEntrustFetch: {
            status: 'close',
            response: ''
        },
        EvaluateDepartEntrustFetch: {
            status: 'close',
            response: ''
        },
        CloseDepartEntrustFetch: {
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
        [ReplyDepartEntrust]: merge((payload, state) => {
            return {
                ReplyDepartEntrustFetch: {
                    status: 'pending'
                }
            };
        }),
        [ReplyDepartEntrust.success]: merge((payload, state) => {
            return {
                ReplyDepartEntrustFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [ReplyDepartEntrust.error]: merge((payload, state) => {
            return {
                ReplyDepartEntrustFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [EvaluateDepartEntrust]: merge((payload, state) => {
            return {
                EvaluateDepartEntrustFetch: {
                    status: 'pending'
                }
            };
        }),
        [EvaluateDepartEntrust.success]: merge((payload, state) => {
            return {
                EvaluateDepartEntrustFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [EvaluateDepartEntrust.error]: merge((payload, state) => {
            return {
                EvaluateDepartEntrustFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [CloseDepartEntrust]: merge((payload, state) => {
            return {
                CloseDepartEntrustFetch: {
                    status: 'pending'
                }
            };
        }),
        [CloseDepartEntrust.success]: merge((payload, state) => {
            return {
                CloseDepartEntrustFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [CloseDepartEntrust.error]: merge((payload, state) => {
            return {
                CloseDepartEntrustFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;