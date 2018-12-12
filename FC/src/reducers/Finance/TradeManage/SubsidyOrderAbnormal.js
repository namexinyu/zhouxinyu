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
    getSpecialPermitList, setSpecialPermit
} = InterviewSubsidyAction;
const STATE_NAME = 'state_finance_trade_subsidy_order_abnormal';

function InitialState() {
    return {
        queryParams: {
            Date: {value: []},
            // AuditDate: {value: [moment().subtract(1, 'year'), moment()]},
            AuditDate: {value: []},
            RealName: {},
            PayType: {value: '-9999'},
            Recruit: {},
            Mobile: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        SubsidyStatusTagParam: [],
        SpecialPermitTagParam: [],
        PayStatusTagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [], selectedRowSum: {},

        getSpecialPermitListFetch: {
            status: 'close',
            response: ''
        },
        setSpecialPermitFetch: {
            status: 'close',
            response: ''
        },

        SetSpecialPermitModalItem: {
            SpecialPermit: {}
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
        [getSpecialPermitList]: merge((payload, state) => {
            return {
                getSpecialPermitListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true, selectedRowKeys: [], selectedRowSum: {}
            };
        }),
        [getSpecialPermitList.success]: merge((payload, state) => {
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

                ct = moment(item.SpecialPermitTime);
                item.SpecialPermitTimeStr = ct.isValid() ? ct.format('MM-DD HH:mm:ss') : item.SpecialPermitTime;
                ct = moment(item.CreateTime);
                item.CreateTimeStr = ct.isValid() ? ct.format('MM-DD HH:mm:ss') : item.CreateTime;
                return item;
            });
            return {
                getSpecialPermitListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList,
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getSpecialPermitList.error]: merge((payload, state) => {
            return {
                getSpecialPermitListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [setSpecialPermit]: merge((payload, state) => {
            return {
                setSpecialPermitFetch: {
                    status: 'pending'
                }
            };
        }),
        [setSpecialPermit.success]: merge((payload, state) => {
            return {
                setSpecialPermitFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setSpecialPermit.error]: merge((payload, state) => {
            return {
                setSpecialPermitFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;