import merge from '../../merge';
import getEmployeeList from 'ACTION/ExpCenter/EmployeeList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_employeeList';
function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = i.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}
function InitialState() {
    return {
        getEmployeeListFetch: {
            status: '',
            response: ''
        },
        RecordListLoading: false,
        EmployeeList: [],
        TotalCount: 0,
        parms: {
            HubIDList: [],
            RecordIndex: 0,
            RecordSize: 2000
        }
    };
}

const getEmployeeListList = {
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
        [getEmployeeList]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getEmployeeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEmployeeList.success]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                EmployeeList: payload.Data.EmployeeList ? addKey(payload.Data.EmployeeList) : [],
                TotalCount: payload.Data.TotalCount
            };
        }),
        [getEmployeeList.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getEmployeeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getEmployeeListList;