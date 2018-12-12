import merge from '../../merge';
import getPreCount from 'ACTION/ExpCenter/PreCount';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_preCount';
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
        getPreCountFetch: {
            status: 'pending',
            response: ''
        },
        NotReceivedTotalNum: 0,
        PreSignTotalNum: 0,
        ReceivedTotalNum: 0,
        RecordCount: 0,
        RecordList: [],
        otherParams: {
            RecruitName: undefined
        },
        Parms: {
            HubIDList: [],
            PreCheckinDate: '',
            RecruitID: -9999
        }
    };
}

const getPreCountList = {
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
        [getPreCount]: merge((payload, state) => {
            return {
                getPreCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPreCount.success]: merge((payload, state) => {
            return {
                getPreCountFetch: {
                    status: 'success',
                    response: payload
                },
                NotReceivedTotalNum: payload.Data.NotReceivedTotalNum,
                PreSignTotalNum: payload.Data.PreSignTotalNum,
                ReceivedTotalNum: payload.Data.ReceivedTotalNum,
                RecordCount: payload.Data.RecordCount,
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getPreCount.error]: merge((payload, state) => {
            return {
                getPreCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getPreCountList;