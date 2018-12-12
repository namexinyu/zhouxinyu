import merge from '../../merge';
import getDepartAllEmpName from 'ACTION/ExpCenter/GetCommonData/getDepartAllEmpName';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_departAllEmpName';
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
        getDepartAllEmpNameFetch: {
            status: 'pending',
            response: ''
        },
        DepartAllName: []
    };
}

const getDepartAllEmpNameList = {
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
        [getDepartAllEmpName]: merge((payload, state) => {
            return {
                getDepartAllEmpNameFetch: {
                    status: 'pending'
                }
            };
        }),
        [getDepartAllEmpName.success]: merge((payload, state) => {
            return {
                getDepartAllEmpNameFetch: {
                    status: 'success',
                    response: payload
                },
                DepartAllName: payload.Data.DepartAllName ? payload.Data.DepartAllName : []
            };
        }),
        [getDepartAllEmpName.error]: merge((payload, state) => {
            return {
                getDepartAllEmpNameFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getDepartAllEmpNameList;