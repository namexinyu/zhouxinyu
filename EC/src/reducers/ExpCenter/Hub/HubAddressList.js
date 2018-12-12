import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getHubInfoList from 'ACTION/ExpCenter/Hub/getHubInfoList';

const STATE_NAME = 'state_ec_hubAddressList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        hubInfoList: [],
        queryParams: {
            Name: undefined,
            EnableStatus: 0
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        getHubInfoListFetch: {
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
        [getHubInfoList]: merge((payload, state) => {
            return {
                getHubInfoListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHubInfoList.success]: merge((payload, state) => {
            return {
                getHubInfoListFetch: {
                    status: 'success',
                    response: payload
                },
                hubInfoList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getHubInfoList.error]: merge((payload, state) => {
            return {
                getHubInfoListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;