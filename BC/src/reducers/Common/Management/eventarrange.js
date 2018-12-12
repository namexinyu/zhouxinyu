import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import eventarrange from "ACTION/Common/Management/eventarrange";
import eventarrangechange from "ACTION/Common/Management/eventarrangechange";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

const STATE_NAME = 'state_broker_eventarrange';

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
        pageSize: 20,
        totalSize: 0,
        eventarrange: [],
        pageQueryParams: {
            DiplomatName: {
              value: ''
            },
            DiplomatNick: {
              value: ''
            },
            Depart: {
              value: ""
            },
            currentPage: 1,
            pageSize: 10
          },
        eventarrangestatus: true,
        eventarrangechange: {},
        eventarrangeFetch: {
            status: 'close',
            response: ''
        },
        eventarrangechangeFetch: {
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
        [eventarrange]: merge((payload, state) => {
            return {
                eventarrangeFetch: {
                    status: 'pending'
                },
                eventarrangestatus: true
            };
        }),
        [eventarrange.success]: merge((payload, state) => {
            return {
                eventarrangeFetch: {
                    status: 'success',
                    response: payload
                },
                eventarrangestatus: false,
                eventarrange: payload['Data']['RecordList'] ? arrkey(payload['Data']['RecordList']) : [],
                totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0
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
        }),
        [eventarrangechange]: merge((payload, state) => {
            return {
                eventarrangechangeFetch: {
                    status: 'pending'
                },
                eventarrangechangestatus: true
            };
        }),
        [eventarrangechange.success]: merge((payload, state) => {
            return {
                eventarrangechangeFetch: {
                    status: 'success',
                    response: payload
                },
                eventarrangechangestatus: false,
                eventarrangechange: payload
            };
        }),
        [eventarrangechange.error]: merge((payload, state) => {
            return {
                eventarrangechangeFetch: {
                    status: 'error',
                    response: payload
                },
                eventarrangechangestatus: false
            };
        })
    }
};
export default Reducer;