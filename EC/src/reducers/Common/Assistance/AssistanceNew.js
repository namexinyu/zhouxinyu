import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import BuildDepartEntrust from 'ACTION/Common/Assistance/BuildDepartEntrust';

const STATE_NAME = 'state_mams_assistanceNew';

function InitialState() {
    return {
        state_name: STATE_NAME,
        showModal: false,
        PicUrls: [],
        Data: {
            Content: {value: ''},
            TargetDepartID: {value: '-9999'}
        },
        BuildDepartEntrustFetch: {
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
        [BuildDepartEntrust]: merge((payload, state) => {
            return {
                BuildDepartEntrustFetch: {
                    status: 'pending'
                }
            };
        }),
        [BuildDepartEntrust.success]: merge((payload, state) => {
            return {
                BuildDepartEntrustFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [BuildDepartEntrust.error]: merge((payload, state) => {
            return {
                BuildDepartEntrustFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;