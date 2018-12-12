import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getSupplyReleaseList from 'ACTION/ExpCenter/Supply/getSupplyReleaseList';
import moment from 'moment';

const STATE_NAME = 'state_ec_supplyReleaseList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        showModal: false,
        authHubID: -9999,
        supplyReleaseList: [],
        queryParams: {
            HubID: -9999,
            StartDate: moment(),
            StopDate: moment(),
            UserName: undefined,
            Recruit: {value: undefined, text: undefined},
            IDCardNum: undefined,
            GetType: -9999
        },
        otherParams: {
            RecruitName: undefined
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        RecordListLoading: false,
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        totalAmount: 0,
        getSupplyReleaseListFetch: {
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
        [getSupplyReleaseList]: merge((payload, state) => {
            return {
                getSupplyReleaseListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getSupplyReleaseList.success]: merge((payload, state) => {
            return {
                getSupplyReleaseListFetch: {
                    status: 'success',
                    response: payload
                },
                supplyReleaseList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0,
                totalAmount: payload.Data ? (payload.Data.TotalAmount || 0) : 0,
                TotalRefundAmount: payload.Data ? (payload.Data.TotalRefundAmount || 0) : 0,
                RecordListLoading: false
            };
        }),
        [getSupplyReleaseList.error]: merge((payload, state) => {
            return {
                getSupplyReleaseListFetch: {
                    status: 'error',
                    response: payload
                },
                supplyReleaseList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;