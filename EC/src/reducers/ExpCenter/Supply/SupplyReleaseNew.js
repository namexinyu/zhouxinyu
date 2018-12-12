import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import addSupplyReleaseData from 'ACTION/ExpCenter/Supply/addSupplyReleaseData';
import getUserSignGiftList from 'ACTION/ExpCenter/Supply/getUserSignGiftList';

const STATE_NAME = 'state_ec_supplyReleaseNew';

function InitialState() {
    return {
        state_name: STATE_NAME,
        // SupplyReleaseID: undefined,
        authHubID: -9999,
        userSignGiftList: [],
        UserName: undefined,
        SupplyReleaseData: {},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        // returnData: {
        //     Type: undefined,
        //     WorkCardPath: undefined
        // },
        addSupplyReleaseDataFetch: {
            status: 'close',
            response: ''
        },
        getUserSignGiftListFetch: {
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
                let s = new InitialState();
                s.authHubID = state.authHubID;
                return s;
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
        [addSupplyReleaseData]: merge((payload, state) => {
            return {
                addSupplyReleaseDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [addSupplyReleaseData.success]: merge((payload, state) => {
            return {
                addSupplyReleaseDataFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [addSupplyReleaseData.error]: merge((payload, state) => {
            return {
                addSupplyReleaseDataFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [getUserSignGiftList]: merge((payload, state) => {
            return {
                getUserSignGiftListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getUserSignGiftList.success]: merge((payload, state) => {
            return {
                getUserSignGiftListFetch: {
                    status: 'success',
                    response: payload
                },
                userSignGiftList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getUserSignGiftList.error]: merge((payload, state) => {
            return {
                getUserSignGiftListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;