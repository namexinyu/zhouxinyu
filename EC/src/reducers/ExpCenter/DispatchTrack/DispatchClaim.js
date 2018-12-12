import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import addDispatchClaim from 'ACTION/ExpCenter/DispatchTrack/addDispatchClaim';

const STATE_NAME = 'state_ec_dispatchClaim';

function InitialState() {
    return {
        state_name: STATE_NAME,
        DispatchID: undefined,
        DispatchData: undefined,
        ClaimData: {
            // URL: "ExpCenter/20171128/f482c9d2-6823-45dc-b5c0-d42a7b229e6f.jpg",
            URL: undefined,
            Method: 2,
            Money: undefined
        },
        addDispatchClaimFetch: {
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
                console.log('resetState', STATE_NAME);
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
        [addDispatchClaim]: merge((payload, state) => {
            return {
                addDispatchClaimFetch: {
                    status: 'pending'
                }
            };
        }),
        [addDispatchClaim.success]: merge((payload, state) => {
            return {
                addDispatchClaimFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [addDispatchClaim.error]: merge((payload, state) => {
            return {
                addDispatchClaimFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;