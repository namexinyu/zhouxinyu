import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import ComplainOrderAction from 'ACTION/Finance/TradeManage/ComplainOrderAction';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getComplainOrderList, exportComplainOrderList,
    getComplainCheck, appealComplainOrder
} = ComplainOrderAction;
const STATE_NAME = 'state_finance_trade_complain';

function InitialState() {
    return {
        tabKey: 'tab1',
        q_Date: {value: [moment().subtract(1, 'week'), moment()]},
        q_UserName: {},
        q_Labor: {},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            ComplainTimeOrder: false
        },
        tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        checkinModal: {
            Visible: false
        },
        appealModal: {},

        getComplainOrderListFetch: {
            status: 'close',
            response: ''
        },
        exportComplainOrderListFetch: {
            status: 'close',
            response: ''
        },
        getComplainCheckFetch: {
            status: 'close',
            response: ''
        },
        appealComplainOrderFetch: {
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
        [getComplainOrderList]: merge((payload, state) => {
            return {
                getComplainOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getComplainOrderList.success]: merge((payload, state) => {
            return {
                getComplainOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.ComplainList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getComplainOrderList.error]: merge((payload, state) => {
            return {
                getComplainOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [exportComplainOrderList]: merge((payload, state) => {
            return {
                exportComplainOrderListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportComplainOrderList.success]: merge((payload, state) => {
            return {
                exportComplainOrderListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportComplainOrderList.error]: merge((payload, state) => {
            return {
                exportComplainOrderListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getComplainCheck]: merge((payload, state) => {
            return {
                getComplainCheckFetch: {
                    status: 'pending'
                }
            };
        }),
        [getComplainCheck.success]: merge((payload, state) => {
            return {
                getComplainCheckFetch: {
                    status: 'success',
                    response: payload.Data ? payload : {...payload, Data: {}}
                }
            };
        }),
        [getComplainCheck.error]: merge((payload, state) => {
            return {
                getComplainCheckFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [appealComplainOrder]: merge((payload, state) => {
            return {
                appealComplainOrderFetch: {
                    status: 'pending'
                }
            };
        }),
        [appealComplainOrder.success]: merge((payload, state) => {
            return {
                appealComplainOrderFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [appealComplainOrder.error]: merge((payload, state) => {
            return {
                appealComplainOrderFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;