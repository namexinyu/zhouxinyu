import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import returnSupplyDeposit from 'ACTION/ExpCenter/Supply/returnSupplyDeposit';

const STATE_NAME = 'state_ec_supplyReleaseDetail';

function InitialState() {
    return {
        state_name: STATE_NAME,
        SupplyReleaseID: undefined,
        SupplyReleaseData: undefined,
        SupplyReleaseDataOri: undefined,
        returnData: {
            PayType: 2,
            // WorkCardPath: "ExpCenter/20171128/f482c9d2-6823-45dc-b5c0-d42a7b229e6f.jpg"
            WorkCardPath: undefined
        },
        returnSupplyDepositFetch: {
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
        [returnSupplyDeposit]: merge((payload, state) => {
            return {
                returnSupplyDepositFetch: {
                    status: 'pending'
                }
            };
        }),
        [returnSupplyDeposit.success]: merge((payload, state) => {
            return {
                returnSupplyDepositFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [returnSupplyDeposit.error]: merge((payload, state) => {
            return {
                returnSupplyDepositFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;