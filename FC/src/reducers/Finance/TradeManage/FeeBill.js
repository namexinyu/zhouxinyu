import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';

const {feeTotalBillList} = FeeAction;
const STATE_NAME = 'state_finance_trade_fee_bill';

function InitialState() {
    return {
        queryParams: {
            BillDay: {},
            FinanceAudit: {},
            Hub: {}
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

        feeTotalBillListFetch: {
            status: 'close',
            response: ''
        }
    };
}

const tableMoneyCol = ['Amount', 'AmountReal', 'RefundAmount', 'RefundAmountReal', 'PayWeiXin', 'PayZhiFuBao', 'PayCash', 'PayBank', 'Gap'];

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
        [feeTotalBillList]: merge((payload, state) => {
            return {
                feeTotalBillListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [feeTotalBillList.success]: merge((payload, state) => {
            let {currentPage, pageSize} = state.pageParam;
            return {
                feeTotalBillListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount, RecordSum: payload.Data.RecordSum || {},
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.rowKey = index + 1 + (currentPage - 1) * pageSize;
                    item.FinanceAuditStatusStr =
                        item.FinanceAuditStatus === 1 ? '待审核' :
                            item.FinanceAuditStatus === 2 ? '审核通过' :
                                item.FinanceAuditStatus === 3 ? '审核拒绝' : item.FinanceAuditStatus;
                    for (let value of tableMoneyCol) item[value + 'Str'] = Number.isInteger(item[value]) ? item[value] / 100 : item[value];
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [feeTotalBillList.error]: merge((payload, state) => {
            return {
                feeTotalBillListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};