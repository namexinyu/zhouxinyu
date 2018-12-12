import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getDispatchHistoryList from 'ACTION/ExpCenter/DispatchTrack/getDispatchHistoryList';

const STATE_NAME = 'state_ec_dispatchTrackHistory';

function InitialState() {
    return {
        state_name: STATE_NAME,
        dispatchList: [],
        authHubID: -9999,
        queryParams: {
            Driver: undefined,
            BrokerID: undefined,
            PhoneNumber: undefined,
            Start: undefined,
            Status: undefined,
            UserName: undefined,
            StartDateTime: undefined,
            EndDateTime: undefined,
            CheckIn: -9999,
            Type: -9999
        },
        Ordered: 0,
        otherParams: {
            BrokerTmp: undefined,
            DriverTmp: undefined
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        RecordListLoading: false,
        getDispatchHistoryListFetch: {
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
        [getDispatchHistoryList]: merge((payload, state) => {
            return {
                getDispatchHistoryListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getDispatchHistoryList.success]: merge((payload, state) => {
            return {
                getDispatchHistoryListFetch: {
                    status: 'success',
                    response: payload
                },
                dispatchList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                // ClaimCount: payload.Data ? payload.Data.ClaimCount || 0 : 0,
                // ClaimSum: payload.Data ? payload.Data.ClaimSum || 0 : 0,
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0,
                RecordListLoading: false
            };
        }),
        [getDispatchHistoryList.error]: merge((payload, state) => {
            return {
                getDispatchHistoryListFetch: {
                    status: 'error',
                    response: payload
                },
                dispatchList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;