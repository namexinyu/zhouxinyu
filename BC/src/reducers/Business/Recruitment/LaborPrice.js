import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';
import LaborAction from 'ACTION/Business/Labor/LaborAction';

const {
    getLaborPriceList,
    exportLaborPriceList,
    modifyLaborPriceList,
    resetSetPriceModal
} = LaborAction;
const STATE_NAME = 'state_recruitment_labor_price';
import moment from 'moment';

function InitialState() {
    return {
        q_Recruit: {},
        q_Labor: {},
        q_Employee: {},
        q_NeedFee: {value: '-9999'},
        q_AuditStatus: {value: '-9999'},
        q_Date: {value: [moment(), moment()]},
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            CreateDate: false,
            OrderDate: false
        },
        RecordList: [],
        RecordListLoading: false,

        RecordCount: 0,

        getLaborPriceListFetch: {
            status: 'close',
            response: ''
        },

        exportLaborPriceListFetch: {
            status: 'close',
            response: ''
        },
        modifyLaborPriceListFetch: {
            status: 'close',
            response: ''
        },

        // 弹窗数据
        priceModal: {
            Visible: false,
            record: {},
            SubsidyList: [],
            EnrollFeeList: [],
            Remark: ''
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
        [getLaborPriceList]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborPriceList.success]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getLaborPriceList.error]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [exportLaborPriceList]: merge((payload, state) => {
            return {
                exportLaborPriceListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportLaborPriceList.success]: merge((payload, state) => {
            return {
                exportLaborPriceListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportLaborPriceList.error]: merge((payload, state) => {
            return {
                exportLaborPriceListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [modifyLaborPriceList]: merge((payload, state) => {
            return {
                modifyLaborPriceListFetch: {
                    status: 'pending'
                }
            };
        }),
        [modifyLaborPriceList.success]: merge((payload, state) => {
            return {
                modifyLaborPriceListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modifyLaborPriceList.error]: merge((payload, state) => {
            return {
                modifyLaborPriceListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [resetSetPriceModal]: (state, payload) => {
            return {...state, priceModal: new InitialState().priceModal};
        }
    }
};
export default Reducer;