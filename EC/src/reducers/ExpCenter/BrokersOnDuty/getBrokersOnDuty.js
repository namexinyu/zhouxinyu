import merge from '../../merge';
import getBrokersOnDuty from 'ACTION/ExpCenter/BrokersOnDuty/getBrokersOnDuty';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_brokersOnDuty';
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
        getBrokersOnDutyFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLoading: false,
        RecordList: [],
        parms: {
            BrokerID: null,
            DateLowerBound: "",
            DateUpperBound: "",
            HubList: []
        }
    };
}

const getBrokersOnDutyList = {
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
        [getBrokersOnDuty]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getBrokersOnDutyFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBrokersOnDuty.success]: merge((payload, state) => {
            return {
                getBrokersOnDutyFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getBrokersOnDuty.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getBrokersOnDutyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getBrokersOnDutyList;