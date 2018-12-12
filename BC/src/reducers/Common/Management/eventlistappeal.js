import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import eventlistappealList from 'ACTION/Common/Management/eventlistappeal';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

const STATE_NAME = 'state_broker_eventlistappeal';

// 部门委托子标签['all','my'] 按当前平台权限，有接收权限默认all，有新建权限则my，皆无则空
const currentPlat = mams[CurrentPlatformCode];
const initTab = currentPlat.acceptAssistance ? 'all' : (currentPlat.buildAssistance ? 'my' : '');

function arrkey(arr) {
    for(var i = 0; i < arr.length; i++) {
       arr[i].key = (i + 1).toString();
    }
    return arr;
} 

function InitialState() {
    return {
        state_name: STATE_NAME,
        currentPage: 1,
        pageSize: 40,
        totalSize: 0,
        eventlistappeal: [],
        eventlistappealFetch: {
            status: 'close',
            response: ''
        },
        eventlistappealstatus: true
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
        [eventlistappealList]: merge((payload, state) => {
            return {
                eventlistappealFetch: {
                    status: 'pending'
                },
                eventlistappealstatus: true
            };
        }),
        [eventlistappealList.success]: merge((payload, state) => {
            return {
                eventlistappealFetch: {
                    status: 'success',
                    response: payload
                },
                eventlistappeal: payload['Data']['RecordList'] ? arrkey(payload['Data']['RecordList']) : [],
                totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
                eventlistappealstatus: false
            };
        }),
        [eventlistappealList.error]: merge((payload, state) => {
            return {
                eventlistappealFetch: {
                    status: 'error',
                    response: payload,
                    eventlistappealstatus: false
                }
            };
        })
    }
};
export default Reducer;