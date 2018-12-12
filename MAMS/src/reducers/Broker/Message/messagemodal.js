import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import messagemodal from 'ACTION/Common/Message/messagemodal';

const STATE_NAME = 'state_mams_message';

function arrkey(arr) {
    for(var i = 0; i < arr.length; i++) {
       arr[i].key = (i + 1).toString();
    }
    return arr;
}

function InitialState() {
    return {
        pageSize: 40,
        currentPage: 1,
        totalSize: 0,
        messagemodal: [],
        messagemodalstatus: true,
        imgs: [],
        messagemodalFetch: {
            status: 'close',
            response: ''
        }
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
     // 详情页
     [messagemodal]: merge((payload, state) => {
        return {
            messagemodalFetch: {
                status: 'pending'
            },
            messagemodalstatus: true
        };
    }),
    [messagemodal.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            messagemodalFetch: {
                status: 'success',
                response: payload
            },
            messagemodal: payload['Data']['NotifyInfo'] ? messagemodal.concat(payload['Data']['NotifyInfo']) : messagemodal,
            totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
            Messagestatus: false
        };
    }),
    [messagemodal.error]: merge((payload, state) => {
        return {
            messagemodalFetch: {
                status: 'error',
                response: payload
            },
            messagemodalstatus: false
        };
    })
    }
};
export default Reducer;