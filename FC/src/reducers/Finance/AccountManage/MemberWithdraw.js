import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';
import overviewAction from 'ACTION/Finance/overviewAction';

moment.locale('zh-cn');
import MemberWithdrawAction from 'ACTION/Finance/AccountManage/MemberWithdrawAction';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {queryWithdrawRecords} = MemberWithdrawAction;

import {AuditStatusNew} from 'CONFIG/EnumerateLib/Mapping_Order';

const STATE_NAME = 'state_finance_member_withdraw';

function InitialState() {
    return {
        queryParams: {
            CreateTime: {value: []},
            AuditTime: {value: []},
            PaymentTime: {value: []},
            BankBackTime: {value: []},
            Mobile: {},
            UserName: {},
            IDCardNum: {},
            Operator: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            Order: false
        },
        RecordCount: 0,
        TotalAmount: 0,
        TotalPassAuditAmount: 0,
        TotalRejectAuditAmount: 0,
        TotalWaitAuditAmount: 0,
        RecordList: [],
        selectedRowKeys: [],
        selectedRowSum: {},
        RecordListLoading: false,

        AuditStatusTagParam: [],
        DrawingStatusTagParam: [],

        queryWithdrawRecordsFetch: {
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
                if (payload.params)
                    if (payload.params.AuditStatusTagParam || payload.params.DrawingStatusTagParam) {
                        payload.params.pageParam = {...state.pageParam, ...payload.params.pageParam, currentPage: 1};
                    }
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
        [queryWithdrawRecords]: merge((payload, state) => {
            return {
                queryWithdrawRecordsFetch: {
                    status: 'pending'
                },
                RecordList: [],
                RecordListLoading: true,
                selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [queryWithdrawRecords.success]: merge((payload, state) => {
            return {
                queryWithdrawRecordsFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount,
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.AmountStr = Number.isInteger(item.Amount) ? item.Amount / 100 : '-';
                    item.AuditStatusStr =
                        item.AuditStatus === 1 ? '新建待审核' :
                            item.AuditStatus === 2 ? '待审核' :
                                item.AuditStatus === 3 ? '已通过' :
                                    item.AuditStatus === 4 ? '已拒绝' : '-';
                    item.AuditStatusClass =
                        item.AuditStatus === 2 ? 'color-orange' :
                            item.AuditStatus === 3 ? 'color-green' : 'color-red';

                    item.WithDrawStatusStr =
                        item.WithDrawStatus === 0 ? '未到账' :
                            item.WithDrawStatus === 1 ? '打款中' :
                                item.WithDrawStatus === 2 ? '已到账' :
                                    item.WithDrawStatus === 3 ? '打款失败' :
                                        item.WithDrawStatus === 4 ? '银行退回' :
                                            item.WithDrawStatus === 5 ? '银行退回已处理' : '-';
                    item.WithDrawStatusClass =
                        item.WithDrawStatus === 0 ? 'color-orange' :
                            item.WithDrawStatus === 1 || item.WithDrawStatus === 2 ? 'color-green' : 'color-red';

                    let ct = moment(item.BankBackTime);
                    item.BankBackTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.BankBackTime;
                    return item;
                }),
                TotalAmount: payload.Data.TotalAmount,
                TotalPassAuditAmount: payload.Data.TotalPassAuditAmount,
                TotalRejectAuditAmount: payload.Data.TotalRejectAuditAmount,
                TotalWaitAuditAmount: payload.Data.TotalWaitAuditAmount,
                RecordListLoading: false
            };
        }),
        [queryWithdrawRecords.error]: merge((payload, state) => {
            return {
                queryWithdrawRecordsFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [overviewAction]: (state, payload) => {
            let auditStatus = payload.query.toString();
            if (payload.stateName === STATE_NAME && (auditStatus === '2' || auditStatus === '3')) {
                let init = new InitialState();
                init.AuditStatusTagParam = [auditStatus];
                if (auditStatus === '3') { // 今日已审核
                    init.queryParams.AuditTime = {value: [moment(), moment()]};
                } else { // 今日待审核
                    // init.queryParams.CreateTime = {value: [moment(), moment()]};
                    init.queryParams.CreateTime = {value: [undefined, undefined]};
                }
                return init;
            }
            return state;
        }
    }
};