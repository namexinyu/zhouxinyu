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

const {interviewFeeList} = FeeAction;

import {AuditStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const STATE_NAME = 'state_finance_trade_fee_detail';

function InitialState() {
    return {
        tabKey: 'tab1',

        queryParams: {
            CheckInTime: {},
            RealName: {},
            Mobile: {},
            ChargeHub: {},
            RefundHub: {},
            RefundTime: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {},
        RecordCount: 0,
        RecordList: [],
        RecordSum: {},
        selectedRowKeys: [], selectedRowSum: {},
        RecordListLoading: false,

        interviewFeeListFetch: {
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
        [interviewFeeList]: merge((payload, state) => {
            return {
                interviewFeeListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [interviewFeeList.success]: merge((payload, state) => {
            return {
                interviewFeeListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount, RecordSum: payload.Data.RecordSum || {},
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.PayUserTypeStr = item.PayUserType === 1 ? '虚拟账户扣款' :
                        item.PayUserType === 2 ? '现金' : item.PayUserType;
                    item.PayTypeRefundStr = item.PayTypeRefund === 1 ? '虚拟账户扣款' :
                        item.PayTypeRefund === 2 ? '现金' : item.PayTypeRefund;
                    item.RefundAmountStr = Number.isInteger(item.RefundAmount) ? item.RefundAmount / 100 : item.RefundAmount;
                    item.ChargeAmountStr = Number.isInteger(item.ChargeAmount) ? item.ChargeAmount / 100 : item.ChargeAmount;
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [interviewFeeList.error]: merge((payload, state) => {
            return {
                interviewFeeListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};