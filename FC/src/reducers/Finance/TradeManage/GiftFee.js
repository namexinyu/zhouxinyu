import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import GiftfeeAction from 'ACTION/Finance/TradeManage/GiftfeeAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {getGiftFeeList, exportGiftFeeList} = GiftfeeAction;
const STATE_NAME = 'state_finance_trade_giftfee';

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
        filterParam: {
            GetType: []
        },
        // tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRowTotal: 0,
        modalVisible: false,

        getGiftFeeListFetch: {
            status: 'close',
            response: ''
        },
        exportGiftFeeListFetch: {
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
        [getGiftFeeList]: merge((payload, state) => {
            return {
                getGiftFeeListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getGiftFeeList.success]: merge((payload, state) => {
            return {
                getGiftFeeListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getGiftFeeList.error]: merge((payload, state) => {
            return {
                getGiftFeeListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [exportGiftFeeList]: merge((payload, state) => {
            return {
                exportGiftFeeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportGiftFeeList.success]: merge((payload, state) => {
            return {
                exportGiftFeeListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportGiftFeeList.error]: merge((payload, state) => {
            return {
                exportGiftFeeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;