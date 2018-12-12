import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import GetDepartEntrustList from 'ACTION/Common/Management/eventdetail';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

import Eventdetail from "ACTION/Common/Management/eventdetail";
import Eventalter from "ACTION/Common/Management/eventgetReplyEvent";
import eventarrange from "ACTION/Common/Management/eventarrange";

const STATE_NAME = 'state_mams_eventdetail';

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
        EventID: 0,
        EventDetail: {},
        EventHistory: [],
        Eventalter: {},
        EventEntryFetch: {
            status: 'close',
            response: ''
        },
        EventalterFetch: {
            status: 'close',
            response: ''
        },
        eventarrangeFetch: {
            status: 'close',
            response: ''
        },
        eventarrange: [],
        Eventdetailstatus: false
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
     [Eventdetail]: merge((payload, state) => {
        return {
            EventEntryFetch: {
                status: 'pending'
            },
            Eventdetailstatus: true
        };
    }),
    [Eventdetail.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            EventEntryFetch: {
                status: 'success',
                response: payload
            },
            EventDetail: payload['Data']['Detail'] ? payload['Data']['Detail'] : {},
            EventHistory: payload['Data']['History'] ? arrkey(payload['Data']['History']) : [],
            totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
            EventEntrystatus: false
        };
    }),
    [Eventdetail.error]: merge((payload, state) => {
        return {
            EventEntryFetch: {
                status: 'error',
                response: payload
            },
            Eventdetailstatus: false
        };
    }),
        // 操作回复
    [Eventalter]: merge((payload, state) => {
        return {
            EventalterFetch: {
                status: 'pending'
            },
            Eventalterstatus: true
        };
    }),
    [Eventalter.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            EventalterFetch: {
                status: 'success',
                response: payload
            },
            Eventalter: payload,
            Eventalterstatus: false
        };
    }),
    [Eventalter.error]: merge((payload, state) => {
        return {
            EventalterFetch: {
                status: 'error',
                response: payload
            },
            Eventalterstatus: false
        };
    }),
    // 外交官 变更
    [eventarrange]: merge((payload, state) => {
        return {
            eventarrangeFetch: {
                status: 'pending'
            },
            eventarrangestatus: true
        };
    }),
    [eventarrange.success]: merge((payload, state) => {
        let list = payload.Data || {};
        return {
            eventarrangeFetch: {
                status: 'success',
                response: payload
            },
            eventarrange: payload['Data']['RecordList'] ? arrkey(payload['Data']['RecordList']) : [],
            eventarrangestatus: false
        };
    }),
    [eventarrange.error]: merge((payload, state) => {
        return {
            eventarrangeFetch: {
                status: 'error',
                response: payload
            },
            eventarrangestatus: false
        };
    })
    }
};
export default Reducer;