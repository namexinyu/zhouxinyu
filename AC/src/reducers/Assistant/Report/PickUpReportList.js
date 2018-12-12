import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import ReportAction from 'ACTION/Assistant/ReportAction';

const STATE_NAME = 'state_ac_pickUpReportList';

const {
    RptGetPickUpList
} = ReportAction;

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
        PreCheckinAddrTotal: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        RptGetPickUpListFetch: {
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
        [RptGetPickUpList]: merge((payload, state) => {
            return {
                RptGetPickUpListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [RptGetPickUpList.success]: merge((payload, state) => {
            const d_d_r = (payload.Data || {}).RecordList || [];
            const d_d = {
                GroupList: [],
                GroupCount: 0,
                BrokerTotal: 0,
                PreCheckinAddrTotal: 0
            };
            for (let item of d_d_r) {
                d_d.GroupList = d_d.GroupList.concat(item.GroupList);
                d_d.GroupCount += item.GroupCount;
                d_d.BrokerTotal += item.BrokerTotal;
                d_d.PreCheckinAddrTotal += item.PreCheckinAddrTotal;
            }
            return {
                RptGetPickUpListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: d_d.GroupList,
                RecordCount: d_d.GroupCount,
                BrokerTotal: d_d.BrokerTotal,
                PreCheckinAddrTotal: d_d.PreCheckinAddrTotal,
                RecordListLoading: false
            };
        }),
        [RptGetPickUpList.error]: merge((payload, state) => {
            return {
                RptGetPickUpListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                BrokerTotal: 0,
                PreCheckinAddrTotal: 0,
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;