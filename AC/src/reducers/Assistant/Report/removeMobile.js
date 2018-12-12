import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import removeMobile from 'ACTION/Assistant/removeMobile';

const STATE_NAME = 'removeMobile';

const {
    getMoveNullNumberApplyList
} = removeMobile;

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            Date: {value: moment()},
            DepartID: {value: '-9999'},
            StartDate: {value: moment()},
            EndDate: {value: moment()},
            RenterName: {value: [-9999]},
            BrokerName: {value: ""},
            SettleStatus: {value: ""}
        },
        pageParam: {
            RecordIndex: 1,
            RecordSize: 10
        },
        BrokerAccount: {},
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
        [getMoveNullNumberApplyList]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getMoveNullNumberApplyList.success]: merge((payload, state) => {
            let BrokerAccountlist = {};
            if (payload.Data.RecordList) {
                
                BrokerAccountlist = {BrokerAccount: "总计", BrokerName: "", DepartName: "", GroupName: "", NotNullNumber: payload.Data.TotalCount.NotNullNumber, NullNumber: payload.Data.TotalCount.NullNumber, ApplyNum: payload.Data.TotalCount.ApplyNum};
            }
            return {
                getAuRoleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                BrokerAccount: BrokerAccountlist
            };
        }),
        [getMoveNullNumberApplyList.error]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        })
    }
};
export default Reducer;