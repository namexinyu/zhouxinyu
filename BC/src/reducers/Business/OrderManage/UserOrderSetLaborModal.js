import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';

const {
    getLaborList
} = LaborAction;
const {
    setOrderLabor
} = UserOrderAction;

const STATE_NAME = 'state_business_userorder_setlabor_modal';

// 用户订单弹窗数据
function InitialState() {
    return {
        Visible: false,
        queryParams: {
            LaborName: {}, // 劳务公司名称或简称
            LaborBoss: {}
        },

        RecordList: [],
        RecordListLoading: false,
        RecordCount: 0,
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        getLaborListFetch: {
            status: 'close',
            response: ''
        },
        setOrderLaborFetch: {
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
                return {queryParams: init.queryParams};
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
        [getLaborList]: merge((payload, state) => {
            return {
                getLaborListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborList.success]: merge((payload, state) => {
            return {
                getLaborListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false,
                selectedRowKeys: []
            };
        }),
        [getLaborList.error]: merge((payload, state) => {
            return {
                getLaborListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [setOrderLabor]: merge((payload, state) => {
            return {
                setOrderLaborFetch: {
                    status: 'pending'
                }
            };
        }),
        [setOrderLabor.success]: merge((payload, state) => {
            return {
                setOrderLaborFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setOrderLabor.error]: merge((payload, state) => {
            return {
                setOrderLaborFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;