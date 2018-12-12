import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import EventEntry from 'ACTION/Broker/EventEntry/evententry';

const STATE_NAME = 'state_broker_evententry';
function arrkey(arr) {
    for(var i = 0; i < arr.length; i++) {
       arr[i].key = (i + 1).toString();
    }
    return arr;
}
function InitialState() {
    return {
        EventEntry: {},
        PicUrls: [],
        types: 0,
        PicUrlsList: [],
        queryParams: {
            UserName: '',
            UserMobile: '',
            InterviewDate: undefined,
            RecruitName: {
                value: '',
                text: ''
            },
            InterviewStep: "", 
            EventType: "", 
            Department: "",
            QuestionRemark: '',
            UserAccount: "", 
            AbnormalType: "", 
            MoneyValue: "", 
            YearMonth: ""
        },
        UserID: 0,
        interviewList: [],
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
        [EventEntry]: merge((payload, state) => {
            return {
                EventEntryFetch: {
                    status: 'pending'
                },
                EventEntrystatus: true
            };
        }),
        [EventEntry.success]: merge((payload, state) => {
            let list = payload.Data || {};
            return {
                EventEntryFetch: {
                    status: 'success',
                    response: payload
                },
                EventEntry: payload || {},
                EventEntrystatus: false
               
            };
        }),
        [EventEntry.error]: merge((payload, state) => {
            return {
                EventEntryFetch: {
                    status: 'error',
                    response: payload
                },
                EventEntrystatus: false
            };
        })

    }
};
export default Reducer;