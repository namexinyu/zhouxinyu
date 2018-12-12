import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getPickUpList from 'ACTION/ExpCenter/Labor/getPickUpList';
import moment from 'moment';

const STATE_NAME = 'state_ec_pickUpList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        pickUpList: [],
        authHubID: -9999,
        queryParams: {
            StartDate: moment(),
            StopDate: moment(),
            UserName: undefined,
            RecruitID: undefined,
            LaborID: undefined
        },
        otherParams: {
            RecruitName: undefined,
            LaborName: undefined
        },
        RecordListLoading: false,
        orderParams: [{Key: 'LaborCheckinTime', Order: 1}],
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        getPickUpListFetch: {
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
        [getPickUpList]: merge((payload, state) => {
            return {
                getPickUpListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getPickUpList.success]: merge((payload, state) => {
            return {
                getPickUpListFetch: {
                    status: 'success',
                    response: payload
                },
                pickUpList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0,
                RecordListLoading: false
            };
        }),
        [getPickUpList.error]: merge((payload, state) => {
            return {
                getPickUpListFetch: {
                    status: 'error',
                    response: payload
                },
                pickUpList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;