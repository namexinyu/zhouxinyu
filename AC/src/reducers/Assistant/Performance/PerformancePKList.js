import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import BrokerAction from 'ACTION/Assistant/BrokerAction';

const STATE_NAME = 'state_ac_performancePKList';

const {
    GetPerformancePKList
} = BrokerAction;

function addKey(a) {
    for(var i = 0; i < a.length; i++) {
          a[i].key = (i + 1).toString();
    }
    return a;
} 
function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: undefined,
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: 40
        },
        orderParams: 1,
        RecordList: [],
        RecordCount: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        GetPerformancePKListFetch: {
            status: 'close',
            response: ''
        },
        setCallbackEntryDataFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                return {queryParams: init.queryParams};
            }
            return {};
        }),
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
        [GetPerformancePKList]: merge((payload, state) => {
            return {
                GetPerformancePKListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [GetPerformancePKList.success]: merge((payload, state) => {
            return {
                GetPerformancePKListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? addKey(payload.Data.RecordList) || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetPerformancePKList.error]: merge((payload, state) => {
            return {
                GetPerformancePKListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;