import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import BankbackAction from 'ACTION/Finance/AccountManage/BankbackAction';
import {AuditStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {queryBankBackList} = BankbackAction;


const STATE_NAME = 'state_finance_bank_back';

function InitialState() {
    return {
        queryParams: {
            AuditTime: {value: []},
            BankBackTime: {value: []},
            UserName: {},
            IDCardNum: {}
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
        selectedRowKeys: [],
        selectedRowSum: {},
        RecordListLoading: false,

        queryBankBackListFetch: {
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
        [queryBankBackList]: merge((payload, state) => {
            return {
                queryBankBackListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true, selectedRowSum: {}, selectedRowKeys: []
            };
        }),
        [queryBankBackList.success]: merge((payload, state) => {
            return {
                queryBankBackListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount,
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.AmountStr = Number.isInteger(item.Amount) ? item.Amount / 100 : item.Amount;

                    let ct = moment(item.AuditTime);
                    item.AuditTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.AuditTime;

                    ct = moment(item.BankBackTime);
                    item.BankBackTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.BankBackTime;
                    ct = moment(item.AgainPayTime);
                    item.AgainPayTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.AgainPayTime;

                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [queryBankBackList.error]: merge((payload, state) => {
            return {
                queryBankBackListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};