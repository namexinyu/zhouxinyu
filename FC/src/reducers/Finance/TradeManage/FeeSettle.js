import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {userOrderSettleList} = FeeAction;

import {AuditStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const STATE_NAME = 'state_finance_trade_fee_settle';

function InitialState() {
    return {
        queryParams: {
            CheckInTime: {},
            Labor: {},
            Recruit: {},
            SettleStatus: {value: '-9999'},
            SettleTime: {},
            Payment: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        RecordCount: 0,
        RecordList: [],
        RecordSum: {},
        selectedRowKeys: [],
        selectedRows: [],
        selectedRowSum: {},
        RecordListLoading: false,

        userOrderSettleListFetch: {
            status: 'close',
            response: ''
        }
    };
}

export default {
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
                let initState = new InitialState();
                if (payload.fieldName) {
                    return {[payload.fieldName]: initState[payload.fieldName]};
                }
                return initState;
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
        [userOrderSettleList]: merge((payload, state) => {
            return {
                userOrderSettleListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [], selectedRowSum: {}, selectedRows: []
            };
        }),
        [userOrderSettleList.success]: merge((payload, state) => {
            let {currentPage, pageSize} = state.pageParam;
            return {
                userOrderSettleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount, RecordSum: payload.Data.RecordSum || {},
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.rowKey = index + 1 + (currentPage - 1) * pageSize;
                    item.LaborChargeSettleStatusStr =
                        item.LaborChargeSettleStatus === 1 ? '未结' :
                            item.LaborChargeSettleStatus === 2 ? '已结' : item.LaborChargeSettleStatus;
                    item.LaborChargePaymentStr =
                        item.LaborChargePayment === 1 ? '打款' :
                            item.LaborChargePayment === 2 ? '转充值' : item.LaborChargePayment;
                    item.LaborChargeAmountStr =
                        Number.isInteger(item.LaborChargeAmount) ? item.LaborChargeAmount / 100 : item.LaborChargeAmount;
                    item.WodaChargeAmountStr =
                        Number.isInteger(item.WodaChargeAmount) ? item.WodaChargeAmount / 100 : item.WodaChargeAmount;


                    let ct = moment(item.CheckInTime);
                    item.CheckInTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.CheckInTime;
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [userOrderSettleList.error]: merge((payload, state) => {
            return {
                userOrderSettleListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};