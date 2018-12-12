import merge from '../merge';
import getEmpHubList from 'ACTION/WorkBoard/getEmpHubList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_empHubList';

function InitialState() {
    return {
        getEmpHubListFetch: {
            status: 'pending',
            response: ''
        },
        HubList: []
    };
}

const getEmpHubListList = {
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
        [getEmpHubList]: merge((payload, state) => {
            return {
                getEmpHubListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEmpHubList.success]: merge((payload, state) => {
            return {
                getEmpHubListFetch: {
                    status: 'success',
                    response: payload
                },
                HubList: payload.Data.HubList ? payload.Data.HubList : []
            };
        }),
        [getEmpHubList.error]: merge((payload, state) => {
            return {
                getEmpHubListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getEmpHubListList;