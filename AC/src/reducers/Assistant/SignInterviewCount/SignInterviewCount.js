import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import BrokerAction from 'ACTION/Assistant/BrokerAction';

const STATE_NAME = 'state_ac_signInterviewCount';

const {
    GetSignInterviewCount
} = BrokerAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            Date: {value: moment()},
            DepartID: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParams: 0,
        RecordList: [],
        RecordCount: 0,
        BrokerTotal: 0,
        // InterviewCountToday: 0,
        // InterviewCountYesterday: 0,
        // PreCheckinAddrCountToday: 0,
        // PreCheckinAddrCountYesterday: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        GetSignInterviewCountFetch: {
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
        // [resetQueryParams]: merge((payload, state) => {
        //     if (payload.stateName === STATE_NAME) {
        //         let init = new InitialState();
        //         return {queryParams: init.queryParams};
        //     }
        //     return {};
        // }),
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
        [GetSignInterviewCount]: merge((payload, state) => {
            return {
                GetSignInterviewCountFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [GetSignInterviewCount.success]: merge((payload, state) => {
            const d_d = payload.Data || {};
            return {
                GetSignInterviewCountFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: d_d.GroupList || [],
                RecordCount: d_d.GroupCount || 0,
                BrokerTotal: d_d.BrokerTotal || 0,
                InterviewCountToday: d_d.InterviewCountToday || 0,
                InterviewCountYesterday: d_d.InterviewCountYesterday || 0,
                PreCheckinAddrCountToday: d_d.PreCheckinAddrCountToday || 0,
                PreCheckinAddrCountYesterday: d_d.PreCheckinAddrCountYesterday || 0,
                RecordListLoading: false
            };
        }),
        [GetSignInterviewCount.error]: merge((payload, state) => {
            return {
                GetSignInterviewCountFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                BrokerTotal: 0,
                InterviewCountToday: undefined,
                InterviewCountYesterday: undefined,
                PreCheckinAddrCountToday: undefined,
                PreCheckinAddrCountYesterday: undefined,
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;