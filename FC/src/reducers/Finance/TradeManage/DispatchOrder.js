import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import DispatchOrderAction from 'ACTION/Finance/TradeManage/DispatchOrderAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {getDispatchOrderList, exportDispatchOrderList} = DispatchOrderAction;
const STATE_NAME = 'state_finance_trade_dispatch';

function InitialState() {
    return {
        q_Date: {value: [moment().subtract(1, 'week'), moment()]},
        q_Merchant: {},
        q_Customer: {},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            SequenceCreateTime: false
        },
        // tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        dispatchModal: {
            Visible: false
        },

        getDispatchOrderListFetch: {
            status: 'close',
            response: ''
        },
        exportDispatchOrderListFetch: {
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
        [getDispatchOrderList]: merge((payload, state) => {
            return {
                getDispatchOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getDispatchOrderList.success]: merge((payload, state) => {
            return {
                getDispatchOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getDispatchOrderList.error]: merge((payload, state) => {
            return {
                getDispatchOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [exportDispatchOrderList]: merge((payload, state) => {
            return {
                exportDispatchOrderListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportDispatchOrderList.success]: merge((payload, state) => {
            return {
                exportDispatchOrderListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportDispatchOrderList.error]: merge((payload, state) => {
            return {
                exportDispatchOrderListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;