import merge from '../../merge';
import getAccountChangeList from 'ACTION/ExpCenter/GetCommonData/getAccountChangeList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_accountChangeList';
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
        getAccountChangeListFetch: {
            status: 'pending',
            response: ''
        },
        ChangeList: []
    };
}

const getAccountChangeListList = {
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
        [getAccountChangeList]: merge((payload, state) => {
            return {
                getAccountChangeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAccountChangeList.success]: merge((payload, state) => {
            return {
                getAccountChangeListFetch: {
                    status: 'success',
                    response: payload
                },
                ChangeList: payload.Data.ChangeList ? addKey(payload.Data.ChangeList) : []
            };
        }),
        [getAccountChangeList.error]: merge((payload, state) => {
            return {
                getAccountChangeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getAccountChangeListList;