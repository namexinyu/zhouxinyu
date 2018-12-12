import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborOrderAction from 'ACTION/Finance/TradeManage/LaborOrderAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getLaborOrderList,
    laborOrderListExport
} = LaborOrderAction;
const STATE_NAME = 'state_finance_trade_labor';

function InitialState() {
    return {
        q_Date: {value: [moment().subtract(1, 'week'), moment()]},
        q_Labor: {},
        q_LaborBoss: {},
        q_Recruit: {},
        q_UserName: {},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        getLaborOrderListFetch: {
            status: 'close',
            response: ''
        },

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
                RecordList: payload.Data.LaborList || [],
                RecordCount: payload.Data.RecordCount,
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