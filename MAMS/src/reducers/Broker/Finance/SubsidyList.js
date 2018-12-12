import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import FinanceAction from 'ACTION/Broker/Finance/FinanceAction';
import moment from 'moment';
import {Constant} from 'UTIL/constant/index';

const {
    GetFinanceSubsidyList
} = FinanceAction;

const STATE_NAME = 'state_broker_subsidyList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            CheckinTime: {value: [moment().add(-1, 'years'), moment()]},
            // CheckinTime: {value: [null, null]},
            RecruitName: {value: ''},
            UserName: {value: ''},
            Mobile: {value: ''},
            SettleStatus: {value: '-9999'},
            HireStatus: {value: '-9999'},
            RecruitType: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: Constant.pageSize
        },
        RecordListLoading: false,
        RecordList: [],
        RecordCount: 0,
        EmployeeSimpleList: [],
        GetFinanceSubsidyListFetch: {
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
        [GetFinanceSubsidyList]: merge((payload, state) => {
            return {
                GetFinanceSubsidyListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [GetFinanceSubsidyList.success]: merge((payload, state) => {
            return {
                GetFinanceSubsidyListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetFinanceSubsidyList.error]: merge((payload, state) => {
            return {
                GetFinanceSubsidyListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordCount: 0,
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;