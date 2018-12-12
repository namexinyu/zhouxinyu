import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import overviewAction from 'ACTION/Finance/overviewAction';
import InterviewSubsidyAction from 'ACTION/Finance/TradeManage/InterviewSubsidyAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getUserSubsidyApplyList, auditSubsidyApply
} = InterviewSubsidyAction;
const STATE_NAME = 'state_finance_trade_subsidy_order';

function InitialState() {
    return {
        queryParams: {
            Date: {value: []},
            AuditDate: {value: []},
            RealName: {},
            PayType: {value: '-9999'},
            Recruit: {},
            Labor: {},
            Mobile: {},
            ZXXType: {value: "-9999"}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        SubsidyStatusTagParam: [],
        AuditStatusTagParam: [],
        PayStatusTagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [], selectedRowSum: {},

        AuditUserSubsidyModalItem: {
            orderStatus: {}
        },

        CheckInFlowModalItem: {
            record: null
        },

        getUserSubsidyApplyListFetch: {
            status: 'close',
            response: ''
        },

        auditSubsidyApplyFetch: {
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
                    if (payload.params.SubsidyStatusTagParam || payload.params.PayStatusTagParam || payload.params.AuditStatusTagParam) {
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
        [getUserSubsidyApplyList]: merge((payload, state) => {
            return {
                getUserSubsidyApplyListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true, selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [getUserSubsidyApplyList.success]: merge((payload, state) => {
            let RecordList = (payload.Data.RecordList || []).map(item => {
                if (item.Recruit && item.Recruit.RecruitSubsidys && item.Recruit.RecruitSubsidys.length) {
                    for (let data of item.Recruit.RecruitSubsidys) {
                        if ((item.MaleSubsidyAmount && data.Gender !== 2) || (item.FeMaleSubsidyAmount && data.Gender !== 1)) {
                            item.MaleSubsidyAmount = '数据异常';
                            item.FeMaleSubsidyAmount = '数据异常';
                            item.endDateStr = '数据异常';
                            break;
                        } else {
                            if (data.Gender === 0 || data.Gender === 1) {
                                item.MaleSubsidyAmount = data.SubsidyAmount;
                            }
                            if (data.Gender === 0 || data.Gender === 2) {
                                item.FeMaleSubsidyAmount = data.SubsidyAmount;
                            }
                            if (data.Gender === 0 || data.Gender === item.Gender) {
                                item.endDateStr = moment(item.CheckInTime, "YYYY-MM-DD HH:mm:ss").add(data.SubsidyDay, 'd').format('YYYY-MM-DD');
                            }
                        }
                    }
                }
                if (item.endDateStr) {
                    let ct = moment(item.endDateStr);
                    item.endDateStr = ct.isValid() ? ct.format('MM-DD') : item.endDateStr;
                }

                let ct = moment(item.CheckInTime);
                item.CheckInTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.CheckInTime;

                ct = moment(item.AuditTime);
                item.AuditTimeStr = ct.isValid() ? ct.format('MM-DD HH:mm:ss') : item.AuditTime;
                ct = moment(item.CreateTime);
                item.CreateTimeStr = ct.isValid() ? ct.format('MM-DD HH:mm:ss') : item.CreateTime;
                return item;
            });
            return {
                getUserSubsidyApplyListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList,
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getUserSubsidyApplyList.error]: merge((payload, state) => {
            return {
                getUserSubsidyApplyListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [auditSubsidyApply]: merge((payload, state) => {
            return {
                auditSubsidyApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [auditSubsidyApply.success]: merge((payload, state) => {
            return {
                auditSubsidyApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [auditSubsidyApply.error]: merge((payload, state) => {
            return {
                auditSubsidyApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [overviewAction]: (state, payload) => {
            let query = payload.query;
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                if (query.auditStatus === '3') { // 今日已审核
                    init.AuditStatusTagParam = [query.auditStatus];
                    init.queryParams.AuditDate = {value: [moment(), moment()]};
                } else if (query.auditStatus === '2') { // 今日待审核
                    init.AuditStatusTagParam = [query.auditStatus];
                    // init.queryParams.Date = {value: [moment(), moment()]};
                    //  今日待审核逻辑调整为显示当前待审核数量，去除今日
                    init.queryParams.AuditDate = {value: [undefined, undefined]};
                    init.queryParams.Date = {value: [undefined, undefined]};
                } else if (query.payStatus === '3') {
                    init.PayStatusTagParam = [query.payStatus];
                    init.queryParams.AuditDate = {value: [moment(), moment()]};
                }
                return init;
            }
            return state;
        }
    }
};
export default Reducer;