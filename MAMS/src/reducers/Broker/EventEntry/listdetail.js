import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import Eventdetail from 'ACTION/Broker/EventEntry/eventdetail';

const STATE_NAME = 'state_broker_eventquerydetail';
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
        EventEntryFetch: {
            status: 'close',
            response: ''
        },
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
        // 修改回答
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
        })

    }
};
export default Reducer;