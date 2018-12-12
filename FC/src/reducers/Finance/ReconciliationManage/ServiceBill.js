import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getServiceBillList,
    invoiceHandle
} = ReconciliationManageAction;

import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const STATE_NAME = 'state_finance_serviceBill';

function InitialState() {
    return {
        queryParams: {
            Date: {value: moment()},
            InvoiceStatus: {value: '-9999'},
            Labor: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByInvoiceTime: false
        },
        RecordCount: 0,
        RecordList: [],
        RecordSum: {},
        RecordListLoading: false,

        IsSettleOrderModalItem: {
            SettleStatus: {value: '-9999'},
            Count: {}
        },
        SetOrderStatusModalItem: {
            OrderStep: {value: '-9999'}
        },

        getServiceBillListFetch: {
            status: 'close',
            response: ''
        }
    };
}

const tableMoneyCol = ['LaborSubsidyAmountReal', 'UserSubsidyAmount', 'UserSubsidyAmountReal', 'ExpectInvoiceAmount', 'InvoiceAmount', 'RemainInvoiceAmount'];

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
        [getServiceBillList]: merge((payload, state) => {
            return {
                getServiceBillListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getServiceBillList.success]: merge((payload, state) => {
            let RecordList = (payload.Data.RecordList || []).map(value => {
                let item = {...value};
                for (let value of tableMoneyCol) item[value] = Number.isInteger(item[value]) ? item[value] / 100 : '';
                item.InvoiceStatusClass = item.InvoiceStatus === 2 ? 'color-green' : 'color-red';
                item.InvoiceStatusStr = InvoiceStatus[item.InvoiceStatus];
                return item;
            });

            let RecordSum = payload.Data.RecordSum || {};
            return {
                getServiceBillListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount,
                RecordList, RecordSum: Object.keys(RecordSum).reduce((pre, cur) => {
                    pre[cur] = Number.isInteger(RecordSum[cur]) ? RecordSum[cur] / 100 : RecordSum[cur];
                    return pre;
                }, {}),
                RecordListLoading: false
            };
        }),
        [getServiceBillList.error]: merge((payload, state) => {
            return {
                getServiceBillListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};