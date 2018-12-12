import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import ReportAction from 'ACTION/Assistant/ReportAction';

const STATE_NAME = 'state_ac_interviewReportList';

const {
    RptGetInterviewList
} = ReportAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            Date: {value: moment()},
            DepartID: {value: '-9999'}
        },
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParams: 0,
        RecordList: [],
        RecordCount: 0,
        BrokerTotal: 0,
        InterviewTotal: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        RptGetInterviewListFetch: {
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
                return {queryParams: Object.assign({}, state.queryParams, {Date: {value: moment()}})};
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
        [RptGetInterviewList]: merge((payload, state) => {
            return {
                RptGetInterviewListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [RptGetInterviewList.success]: merge((payload, state) => {
            const d_d_r = (payload.Data || {}).RecordList || [];
            const d_d = {
                GroupList: [],
                GroupCount: 0,
                BrokerTotal: 0,
                InterviewTotal: 0
            };
            for (let item of d_d_r) {
                d_d.GroupList = d_d.GroupList.concat(item.GroupList);
                d_d.GroupCount += item.GroupCount;
                d_d.BrokerTotal += item.BrokerTotal;
                d_d.InterviewTotal += item.InterviewTotal;
            }
            return {
                RptGetInterviewListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: d_d.GroupList,
                RecordCount: d_d.GroupCount,
                InterviewTotal: d_d.InterviewTotal,
                BrokerTotal: d_d.BrokerTotal,
                RecordListLoading: false
            };
        }),
        [RptGetInterviewList.error]: merge((payload, state) => {
            return {
                RptGetInterviewListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordCount: 0,
                InterviewTotal: 0,
                BrokerTotal: 0,
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;