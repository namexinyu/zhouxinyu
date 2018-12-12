import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import InterviewSubsidyAction from 'ACTION/Finance/TradeManage/InterviewSubsidyAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getInterviewOrderList, setOrderSettle, setOrderStep
} = InterviewSubsidyAction;
const STATE_NAME = 'state_finance_trade_interview';

function InitialState() {
    return {
        tabKey: '0',
        queryParams: {
            Date: {value: []},
            RealName: {},
            LaborSettleStatus: {value: '-9999'},
            Labor: {},
            Recruit: {},
            Mobile: {},
            OutPromiseSettleDay: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 20
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        OrderStepTagParam: [],
        SettleStatusTagParam: [],
        JFFInterviewStatusTagParam: [],
        ServiceInterviewStatusTagParam: [],
        RecordList: [],
        RecordCount: 0,
        TotalLaborSubsidyAmount: 0,
        TotalLaborSubsidyAmountReal: 0,
        TotalUserSubsidyAmount: 0,
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
        selectedRowSum: {},


        IsSettleOrderModalItem: {
            SettleStatus: {value: '-9999'},
            Count: {}
        },
        SetOrderStatusModalItem: {
            OrderStep: {value: '-9999'},
            Reason: {value: ''},
            Visible: false
        },

        getInterviewOrderListFetch: {
            status: 'close',
            response: ''
        },
        setOrderSettleFetch: {
            status: 'close',
            response: ''
        },
        setOrderStepFetch: {
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
                    if (payload.params.SettleStatusTagParam || payload.params.OrderStepTagParam || payload.params.JFFInterviewStatusTagParam || payload.params.ServiceInterviewStatusTagParam) {
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
        [getInterviewOrderList]: merge((payload, state) => {
            return {
                getInterviewOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [],
                selectedRows: [],
                selectedRowSum: {}
            };
        }),
        [getInterviewOrderList.success]: merge((payload, state) => {
            return {
                getInterviewOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: (payload.Data.RecordList || []).map(item => {
                    let ct = moment(item.CheckInTime);
                    item.PayTypeStr = item.PayType === 0 ? '我打' : '周薪薪';
                    item.CheckInTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD HH:mm') : item.CheckInTime;
                    item.LaborSubsidyAmountStr = Number.isInteger(item.LaborSubsidyAmount) ? item.LaborSubsidyAmount / 100 : '-';
                    item.LaborSubsidyAmountRealStr = Number.isInteger(item.LaborSubsidyAmountReal) ? item.LaborSubsidyAmountReal / 100 : '-';
                    item.UserSubsidyAmountStr = Number.isInteger(item.UserSubsidyAmount) ? item.UserSubsidyAmount / 100 : '-';
                    return item;
                }),
                TotalLaborSubsidyAmount: payload.Data.TotalLaborSubsidyAmount,
                TotalLaborSubsidyAmountReal: payload.Data.TotalLaborSubsidyAmountReal,
                TotalUserSubsidyAmount: payload.Data.TotalUserSubsidyAmount,
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getInterviewOrderList.error]: merge((payload, state) => {
            return {
                getInterviewOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [setOrderSettle]: merge((payload, state) => {
            return {
                setOrderSettleFetch: {
                    status: 'pending'
                }
            };
        }),
        [setOrderSettle.success]: merge((payload, state) => {
            return {
                setOrderSettleFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setOrderSettle.error]: merge((payload, state) => {
            return {
                setOrderSettleFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setOrderStep]: merge((payload, state) => {
            return {
                setOrderStepFetch: {
                    status: 'pending'
                }
            };
        }),
        [setOrderStep.success]: merge((payload, state) => {
            return {
                setOrderStepFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setOrderStep.error]: merge((payload, state) => {
            return {
                setOrderStepFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};