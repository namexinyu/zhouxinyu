import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborOrderAction from 'ACTION/Business/OrderManage/LaborOrderAction';
import moment from 'moment';

const {
    getLaborOrderList,
    getLaborOrderTotal,
    laborOrderListExport
} = LaborOrderAction;
const STATE_NAME = 'state_business_labororder';

function InitialState() {
    return {
        q_CheckInTime: {value: ''},
        q_PromiseSettleDate: {value: ''},
        q_LaborOrderStatus: {value: '-9999'},
        q_PayType: {value: '-9999'},
        q_Labor: {},
        q_LaborBoss: {},

        LaborSettleStatus: 0, // 状态
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false,
            OrderByPromiseSettleDate: false
        },
        RecordList: [],
        RecordCount: 0,
        LatestCalculationTime: "",
        RecordListLoading: false,

        getLaborOrderListFetch: {
            status: 'close',
            response: ''
        },
        ExecuteCount: 0,
        FinishedCount: 0,
        NoExecuteCount: 0,
        TotalCount: 0,
        getLaborOrderTotalFetch: {
            status: 'close',
            response: ''
        },
        
        LaborId: '',
        LaborOrderID: '',

        ModalVisible: false,
       
        laborOrderListExportFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
                // return init.queryParams;
            }
            return {};
        }),
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
        [getLaborOrderList]: merge((payload, state) => {
            return {
                getLaborOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborOrderList.success]: merge((payload, state) => {
            return {
                getLaborOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                LatestCalculationTime: payload.Data.LatestCalculationTime,
                RecordListLoading: false
            };
        }),
        [getLaborOrderList.error]: merge((payload, state) => {
            return {
                getLaborOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [getLaborOrderTotal]: merge((payload, state) => {
            return {
                getLaborOrderTotalFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborOrderTotal.success]: merge((payload, state) => {
            return {
                getLaborOrderTotalFetch: {
                    status: 'success',
                    response: payload
                },
                ExecuteCount: payload.Data.ExecuteCount,
                FinishedCount: payload.Data.FinishedCount,
                NoExecuteCount: payload.Data.NoExecuteCount,
                TotalCount: payload.Data.Count
            };
        }),
        [getLaborOrderTotal.error]: merge((payload, state) => {
            return {
                getLaborOrderTotalFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [laborOrderListExport]: merge((payload, state) => {
            return {
                laborOrderListExportFetch: {
                    status: 'pending'
                }
            };
        }),
        [laborOrderListExport.success]: merge((payload, state) => {
            return {
                laborOrderListExportFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [laborOrderListExport.error]: merge((payload, state) => {
            return {
                laborOrderListExportFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;