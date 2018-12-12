import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getSignList from 'ACTION/ExpCenter/SignList/getSignList';
import moment from 'moment';

const STATE_NAME = 'state_ec_signList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        signList: [],
        authHubID: -9999,
        queryParams: {
            StartDate: moment(),
            StopDate: moment(),
            UserName: undefined,
            Labor: {value: undefined, text: undefined},
            IDCardNum: undefined,
            // WhetherLabor: -9999,
            Recruit: {value: undefined, text: undefined}
            // CheckinRecruitID: undefined
        },
        otherParams: {
            LaborName: undefined,
            CheckinRecruitName: undefined
        },
        RecordListLoading: false,
        TotalChargeAmount: 0,
        TotalRefundAmount: 0,
        orderParams: [{Key: 'CheckinTime', Order: 1}],
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        getSignListFetch: {
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
                    authHubID: -9999,
                    queryParams: new InitialState().queryParams,
                    otherParams: new InitialState().otherParams
                };
            }
            return {};

        }),
        [getSignList]: merge((payload, state) => {
            return {
                getSignListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getSignList.success]: merge((payload, state) => {
            return {
                getSignListFetch: {
                    status: 'success',
                    response: payload
                },
                signList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0,
                TotalChargeAmount: payload.Data ? (payload.Data.TotalChargeAmount || 0) : 0,
                TotalRefundAmount: payload.Data ? (payload.Data.TotalRefundAmount || 0) : 0,
                RecordListLoading: false
            };
        }),
        [getSignList.error]: merge((payload, state) => {
            return {
                getSignListFetch: {
                    status: 'error',
                    response: payload
                },
                signList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;