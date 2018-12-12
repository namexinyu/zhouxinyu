import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getDispatchTrackList from 'ACTION/ExpCenter/DispatchTrack/getDispatchTrackList';
// import 'LESS/components/selectable-input.less';

const STATE_NAME = 'state_ec_dispatchTrackToday';

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
            UserName: undefined
        },
        Ordered: 0,
        otherParams: {
            DriverTmp: undefined,
            BrokerTmp: undefined
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        RecordListLoading: false,
        getDispatchListFetch: {
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
        [getDispatchTrackList]: merge((payload, state) => {
            return {
                getDispatchListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getDispatchTrackList.success]: merge((payload, state) => {
            return {
                getDispatchListFetch: {
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
        [getDispatchTrackList.error]: merge((payload, state) => {
            return {
                getDispatchListFetch: {
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