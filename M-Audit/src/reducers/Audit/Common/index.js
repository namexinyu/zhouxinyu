import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CommonAction from 'ACTION/Audit/Common';

const {
    getEnterpriseSimpleList
} = CommonAction;

const STATE_NAME = 'state_audit_common';

function InitialState() {
    return {
        EnterpriseSimpleList: []
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
        [getEnterpriseSimpleList]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEnterpriseSimpleList.success]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                EnterpriseSimpleList: payload.Data ? (payload.Data.RecordList || []) : []
            };
        }),
        [getEnterpriseSimpleList.error]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;