import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborOrderAction from 'ACTION/Finance/TradeManage/LaborOrderAction';

const {
    getLaborUserOrderDetail,
    auditLaborOrder
} = LaborOrderAction;
const STATE_NAME = 'state_finance_trade_labor_info';

function InitialState() {
    return {
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        filterParam: {
            OrderStep: []
        },
        getLaborUserOrderDetailFetch: {
            status: 'close',
            response: ''
        },
        LaborSubsidyCount: 0,
        ServiceSubsidyCount: 0,
        UserSubsidyCount: 0,

        auditModal: {},
        auditLaborOrderFetch: {
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
        [getLaborUserOrderDetail]: merge((payload, state) => {
            return {
                getLaborUserOrderDetailFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborUserOrderDetail.success]: merge((payload, state) => {
            return {
                getLaborUserOrderDetailFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.LaborUserList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false,
                LaborSubsidyCount: payload.Data.LaborSubsidyCount || 0,
                ServiceSubsidyCount: payload.Data.ServiceSubsidyCount || 0,
                UserSubsidyCount: payload.Data.UserSubsidyCount || 0
            };
        }),
        [getLaborUserOrderDetail.error]: merge((payload, state) => {
            return {
                getLaborUserOrderDetailFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [auditLaborOrder]: merge((payload, state) => {
            return {
                auditLaborOrderFetch: {
                    status: 'pending'
                }
            };
        }),
        [auditLaborOrder.success]: merge((payload, state) => {
            return {
                auditLaborOrderFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditLaborOrder.error]: merge((payload, state) => {
            return {
                auditLaborOrderFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;