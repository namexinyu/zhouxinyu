import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import UserOrderAction from 'ACTION/Finance/TradeManage/UserOrderAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getOrderList
} = UserOrderAction;
const STATE_NAME = 'state_finance_trade_user';

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
            Order: false
        },
        RecordList: [],
        RecordListLoading: false,
        RecordCount: 0,

        getOrderListFetch: {
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
        [getOrderList]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getOrderList.success]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.UserList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getOrderList.error]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        })
    }
};
export default Reducer;