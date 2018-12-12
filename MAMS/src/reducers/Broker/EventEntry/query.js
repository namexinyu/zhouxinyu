import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import Eventquery from 'ACTION/Broker/EventEntry/eventquery';

const STATE_NAME = 'state_broker_eventquery';
function arrkey(arr) {
    for(var i = 0; i < arr.length; i++) {
       arr[i].key = (i + 1).toString();
    }
    return arr;
}
function InitialState() {
    return {
        BrokerName: '',
        DealStatus: [],
        DiplomatID: 0,
        DiplomatName: '',
        EventID: 0,
        EventSubType: 0,
        EventType: 0,
        EventNature: 0,
        InterviewDate: '',
        QueryEndDate: '',
        QueryStartDate: '',
        RecruitTmpID: 0,
        Satisfaction: 0,
        UserName: '',
        UserMobile: '',
        pageSize: 40,
        currentPage: 1,
        totalSize: 0,
        Eventquery: [],
        EventEntryFetch: {
            status: 'close',
            response: ''
        },
        EventEntrystatus: false
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
        [Eventquery]: merge((payload, state) => {
            return {
                EventEntryFetch: {
                    status: 'pending'
                },
                EventEntrystatus: true
            };
        }),
        [Eventquery.success]: merge((payload, state) => {
            let list = payload.Data || {};
            return {
                EventEntryFetch: {
                    status: 'success',
                    response: payload
                },
                Eventquery: payload['Data']['RecordList'] ? arrkey(payload['Data']['RecordList']) : [],
                totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
                EventEntrystatus: false
            };
        }),
        [Eventquery.error]: merge((payload, state) => {
            return {
                EventEntryFetch: {
                    status: 'error',
                    response: payload
                },
                Eventquery: [],
                EventEntrystatus: false
            };
        })

    }
};
export default Reducer;