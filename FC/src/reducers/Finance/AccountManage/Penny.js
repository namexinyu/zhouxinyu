import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import OneCentTestAction from 'ACTION/Finance/AccountManage/OneCentTestAction';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {queryTestDetails} = OneCentTestAction;

import {AuditStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const STATE_NAME = 'state_finance_penny';

function InitialState() {
    return {
        queryParams: {
            Date: {},
            AuditStatus: {value: '0'},
            MoneyReceiveStatus: {value: '0'},
            Name: {},
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
        selectedRowKeys: [], selectedRowSum: {},
        RecordListLoading: false,

        queryTestDetailsFetch: {
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
        [queryTestDetails]: merge((payload, state) => {
            return {
                queryTestDetailsFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [queryTestDetails.success]: merge((payload, state) => {
            let {currentPage, pageSize} = state.pageParam;
            return {
                queryTestDetailsFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount,
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.AmountStr = Number.isInteger(item.Amount) ? item.Amount / 100 : '-';
                    item.rowKey = index + 1 + (currentPage - 1) * pageSize;
                    item.AuditStatusStr = AuditStatus[item.AuditStatus] || '-';
                    item.AuditStatusClass =
                        item.AuditStatus === 1 ? 'color-info' :
                            item.AuditStatus === 2 ? 'color-green' : 'color-red';

                    item.MoneyReceiveStatusStr =
                        item.MoneyReceiveStatus === 1 ? '未处理' :
                            item.MoneyReceiveStatus === 2 ? '到账成功' :
                                item.MoneyReceiveStatus === 3 ? '到账失败' : '-';
                    item.MoneyReceiveStatusClass =
                        item.MoneyReceiveStatus === 1 ? 'color-info' :
                            item.MoneyReceiveStatus === 2 ? 'color-green' : 'color-red';
                    item.TestResultStr =
                        item.TestResult === 1 ? '未测试' :
                            item.TestResult === 2 ? '调用银企直通接口测试成功' :
                                item.TestResult === 3 ? '测试失败' : '';
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [queryTestDetails.error]: merge((payload, state) => {
            return {
                queryTestDetailsFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};