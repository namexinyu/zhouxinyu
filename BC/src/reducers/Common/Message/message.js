import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import GetDepartEntrustList from 'ACTION/Common/Management/eventdetail';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import {CONFIG} from 'mams-com';
import Message from "ACTION/Common/Message/message";
import Messagemodal from "ACTION/Common/Message/messagemodal";
import moment from 'moment';

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
        visible: false,
        StartTime: moment().format('YYYY-MM-DD'),
        EndTime: moment().format('YYYY-MM-DD'),
        NotifyType: 0,
        Message: [],
        Messagestatus: true,
        EmployeeType: '',
        imgs: [],
        MessageFetch: {
            status: 'close',
            response: ''
        },
        MessagemodalFetch: {
            status: 'close',
            response: ''
        },
        Messagemodalstatus: true,
        pageQueryParams: {
            MessageDate: {
                value: [moment(), moment()]
            },
            MessageType: {
                value: '0'
            },
            RecordIndex: 0,
            RecordSize: 40
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
     [Message]: merge((payload, state) => {
        return {
            MessageFetch: {
                status: 'pending'
            },
            Messagestatus: true
        };
    }),
    [Message.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            MessageFetch: {
                status: 'success',
                response: payload
            },
            Message: arrkey((payload.Data || {}).NotifyInfo || []),
            totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
            Messagestatus: false
        };
    }),
    [Message.error]: merge((payload, state) => {
        return {
            MessageFetch: {
                status: 'error',
                response: payload
            },
            Messagestatus: false
        };
    }),
    // 弹窗
     [Messagemodal]: merge((payload, state) => {
        return {
            MessagemodalFetch: {
                status: 'pending'
            },
            Messagemodalstatus: true
        };
    }),
    [Messagemodal.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            MessagemodalFetch: {
                status: 'success',
                response: payload
            },
            Messagemodal: payload['Data'] ? payload['Data'] : [],
            totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
            Messagemodalstatus: false
        };
    }),
    [Messagemodal.error]: merge((payload, state) => {
        return {
            MessagemodalFetch: {
                status: 'error',
                response: payload
            },
            Messagemodalstatus: false
        };
    })
    }
};
export default Reducer;