import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import getChargeList from 'ACTION/ExpCenter/ChargeList/getChargeList';
import exportChargeList from "ACTION/ExpCenter/ChargeList/exportChargeList";
import moment from 'moment';

const STATE_NAME = 'state_ec_chargeList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        chargeList: [],
        authHubID: -9999,
        queryParams: {
            StartDate: moment(),
            StopDate: moment(),
            UserName: undefined,
            InterviewStatus: -9999,
            Labor: {value: undefined, text: undefined},
            Whether: -9999,
            // WhetherLabor: undefined,
            // LaborListStatus: undefined,
            Recruit: {value: undefined, text: undefined},
            IDCardNum: undefined
        },
        otherParams: {
            CheckinRecruitName: undefined,
            LaborName: undefined
        },
        orderParams: [{Key: 'CheckinTime', Order: 1}],
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        RecordListLoading: false,
        getChargeListFetch: {
            status: 'close',
            response: ''
        },
        exportChargeListFetch: {
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
        [getChargeList]: merge((payload, state) => {
            return {
                getChargeListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getChargeList.success]: merge((payload, state) => {
            return {
                getChargeListFetch: {
                    status: 'success',
                    response: payload
                },
                chargeList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0,
                RecordListLoading: false
            };
        }),
        [getChargeList.error]: merge((payload, state) => {
            return {
                getChargeListFetch: {
                    status: 'error',
                    response: payload
                },
                chargeList: [],
                RecordListLoading: false
            };
        }),
        // 华丽的请求三连ACTION分割线
        [exportChargeList]: merge((payload, state) => {
            return {
                exportChargeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportChargeList.success]: merge((payload, state) => {
            return {
                exportChargeListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportChargeList.error]: merge((payload, state) => {
            return {
                exportChargeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;