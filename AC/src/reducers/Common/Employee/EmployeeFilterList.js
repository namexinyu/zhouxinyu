import merge from 'REDUCER/merge';

import GetMAMSEmployeeFilterList from 'ACTION/Common/Employee/GetMAMSEmployeeFilterList';
import getBrokerList from 'ACTION/Common/Employee/getBrokerList';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';


const STATE_NAME = 'state_mams_employeeFilterList';

function InitialState() {
    return {
        employeeFilterList: [],
        getBrokerListFetch: {
            status: 'pending',
            response: ''
        },
        brokerList: []
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
        [GetMAMSEmployeeFilterList]: (payload, state) => {
            return {employeeFilterList: []};
        },
        [GetMAMSEmployeeFilterList.success]: merge((payload, state) => {
            let list = payload.Data ? (payload.Data.EmployeeList || []) : [];
            return {employeeFilterList: list};
        }),
        [GetMAMSEmployeeFilterList.error]: (payload, state) => {
            return {employeeFilterList: []};
        },
        [getBrokerList]: merge((payload, state) => {
            return {
                getBrokerListFetch: {
                status: 'pending'
                }
            };
        }),
        [getBrokerList.success]: merge((payload, state) => {
            return {
              getBrokerListFetch: {
                status: 'success',
                response: payload
              },
              brokerList: (payload.Data || {}).BrokerList || []
            };
        }),
        [getBrokerList.error]: merge((payload, state) => {
            return {
              getBrokerListFetch: {
                status: 'error',
                response: payload
              },
              brokerList: []
            };
        })
    }
};
export default Reducer;