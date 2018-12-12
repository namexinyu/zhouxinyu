import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DailyRecruitAction from 'ACTION/Business/Recruit/DailyRecruit';
import JumpAction from 'ACTION/Business/WorkBoard/JumpAction';
import {Gender, ValuateUnit} from "CONFIG/EnumerateLib/Mapping_Recruit";

const {getRecruitInfoList, getCurrentRecruitCount} = DailyRecruitAction;

moment.locale('zh-cn');

const STATE_NAME = 'state_business_recruitment_daily';

function InitialState() {
    return {
        queryParams: {
            RecruitDate: {value: moment()},
            Recruit: {},
            RecruitStatus: {value: '-9999'},
            HasSubsidy: {value: '-9999'},
            AcceptLaborOrderType: {value: '-9999'},
            PayType: {value: '-9999'},
            RecruitType: {value: '-9999'},
            MasterPush: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        defaultColumns: [
            "序号",
            "是否招聘",
            "是否主推",
            "企业简称",
            "企业类别",
            "已关联报价",
            "未关联报价",
            "综合薪资",
            "工价",
            "补贴",
            "补贴类型",
            "收费",
            "集合时间",
            "名额",
            "备注",
            "性别比例",
            "年龄",
            "民族",
            "身份证",
            "纹身",
            "烟疤",
            "操作"
        ],
        // RecruitType: -9999,
        RecordCount: 0,
        RecordList: [],
        RecordListLoading: false,
        getRecruitInfoListFetch: {status: 'close', response: ''},
        getCurrentRecruitCountFetch: {status: 'close', response: ''}
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
        [getRecruitInfoList]: merge((payload, state) => {
            return {
                getRecruitInfoListFetch: {status: 'pending'},
                RecordListLoading: true
            };
        }),
        [getRecruitInfoList.success]: merge((payload, state) => {
            let {currentPage, pageSize} = state.pageParam;
            return {
                getRecruitInfoListFetch: {status: 'success', response: payload},
                RecordCount: payload.Data.RecordCount,
                TypeACount: payload.Data.TypeACount,
                TypeBCount: payload.Data.TypeBCount,
                TypeCCount: payload.Data.TypeCCount,
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.rowKey = index + 1 + (currentPage - 1) * pageSize;
                    item.SalaryStr = `${item.MinSalary / 100}元-${item.MaxSalary / 100}元`;
                    item.RecruitTypeStr = item.RecruitType === 1 ? 'A类' : item.RecruitType === 2 ? 'B类' : item.RecruitType === 3 ? 'C类' : item.RecruitType;
                    item.LabourCostListStr = (item.LabourCostList || []).map(i => `\n${Gender[i.Gender]}${i.UnitPay / 100 + (i.SubsidyUnitPay ? '+' + i.SubsidyUnitPay / 100 : '')}元/${ValuateUnit[i.ValuateUnit]}`);

                    if ((item.MaleScale === 0 && item.FemaleScale === 0) || (item.MaleScale > 0 && item.FemaleScale > 0)) {
                        item.MaleScaleStr = item.FemaleScale > 0 ? item.MaleScale + '男' + item.FemaleScale + '女' : '男女不限';
                    } else if (item.MaleScale) {
                        item.MaleScaleStr = `只招男的`;
                    } else if (item.FemaleScale) {
                        item.MaleScaleStr = `只招女的`;
                    }
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [getRecruitInfoList.error]: merge((payload, state) => {
            return {
                getRecruitInfoListFetch: {status: 'error', response: payload},
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [getCurrentRecruitCount]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCurrentRecruitCount.success]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'success',
                    response: payload
                },
                NotLinkedCount: payload.Data.UnAcceptLaborOrderCount, // 未认可的劳务报价
                RecruitingCount: payload.Data.RecruitingCount, // 正在招聘中
                UnsetSubsidyCount: payload.Data.UnsetSubsidyCount, // 未设置补贴
                UnopenCount: payload.Data.UnopenCount // 未开启招聘
            };
        }),
        [getCurrentRecruitCount.error]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [JumpAction]: (state, payload) => {
            let RecruitType = Number(payload.query.toString());
            if (payload.stateName === STATE_NAME && RecruitType) {
                let init = new InitialState();
                return {RecruitType, queryParams: init.queryParams, pageParam: init.pageParam};
            }
            return state;
        }
    }
};