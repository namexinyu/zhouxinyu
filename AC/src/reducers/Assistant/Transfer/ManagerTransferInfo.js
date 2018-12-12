import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ManagerTransferAction from 'ACTION/Assistant/ManagerTransferAction';

const {
    mtGetCurrentBroker,
    mtChangeBroker
} = ManagerTransferAction;

const STATE_NAME = 'state_ac_managerTransferInfo';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            Name: {value: ''},
            Mobile: {value: ''},
            IDCardNum: {value: ''}
        },
        ChangeData: {
            Reason: {value: ''},
            BrokerNum: {value: ''}
        },
        Result: undefined,
        mtGetCurrentBrokerFetch: {
            status: 'close',
            response: ''
        },
        mtChangeBrokerFetch: {
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
        [mtGetCurrentBroker]: merge((payload, state) => {
            return {
                mtGetCurrentBrokerFetch: {
                    status: 'pending'
                }
            };
        }),
        [mtGetCurrentBroker.success]: merge((payload, state) => {
            return {
                mtGetCurrentBrokerFetch: {
                    status: 'success',
                    response: payload
                },
                Result: payload.Data
            };
        }),
        [mtGetCurrentBroker.error]: merge((payload, state) => {
            return {
                mtGetCurrentBrokerFetch: {
                    status: 'error',
                    response: payload
                },
                Result: undefined
            };
        }),
        [mtChangeBroker]: merge((payload, state) => {
            return {
                mtChangeBrokerFetch: {
                    status: 'pending'
                }
            };
        }),
        [mtChangeBroker.success]: merge((payload, state) => {
            return {
                mtChangeBrokerFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [mtChangeBroker.error]: merge((payload, state) => {
            console.log('mtChangeBroker.error', payload);
            return {
                mtChangeBrokerFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;