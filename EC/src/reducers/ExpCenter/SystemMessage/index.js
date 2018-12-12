import merge from '../../merge';
import getSystemMsg from 'ACTION/ExpCenter/SystemMessage';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_systemMsg';
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
        getSystemMsgFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLoading: false,
        RecordList: []
    };
}

const getSystemMsgList = {
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
        [getSystemMsg]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getSystemMsgFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSystemMsg.success]: merge((payload, state) => {
            return {
                getSystemMsgFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getSystemMsg.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getSystemMsgFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getSystemMsgList;