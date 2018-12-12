import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import FinanceAction from 'ACTION/Broker/Finance/FinanceAction';
import {Constant} from 'UTIL/constant/index';
import moment from 'moment';

const {
    GetFinanceRecommendationList
} = FinanceAction;

const STATE_NAME = 'state_broker_recommendationList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            // InviteDate: {value: [moment().add(-90, 'days'), moment()]},
            InviteDate: {value: [null, null]},
            InviteName: {value: ''},
            InvitePhone: {value: ''},
            InvitedName: {value: ''},
            InvitedPhone: {value: ''},
            FinanceDisposingState: {value: '-9999'},
            ApplyStatus: {value: '-9999'},
            EnrolState: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: Constant.pageSize
        },
        RecordListLoading: false,
        RecordList: [],
        RecordCount: 0,
        EmployeeSimpleList: [],
        GetFinanceRecommendationListFetch: {
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
        [GetFinanceRecommendationList]: merge((payload, state) => {
            return {
                GetFinanceRecommendationListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [GetFinanceRecommendationList.success]: merge((payload, state) => {
            return {
                GetFinanceRecommendationListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetFinanceRecommendationList.error]: merge((payload, state) => {
            return {
                GetFinanceRecommendationListFetch: {
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
