import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import 'moment/locale/zh-cn';
import EnterpriseAction from 'ACTION/Business/Recruit/Enterprise';
import {Gender, ValuateUnit} from "CONFIG/EnumerateLib/Mapping_Recruit";

const {getEntList} = EnterpriseAction;

moment.locale('zh-cn');

const STATE_NAME = 'state_business_recruitment_ent';

function InitialState() {
    return {
        queryParams: {
            Date: {},
            EntType: {value: '-9999'},
            EntShortName: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordCount: 0,
        RecordList: [],
        RecordListLoading: false,
        getEntListFetch: {status: 'close', response: ''}
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
        [getEntList]: merge((payload, state) => {
            return {
                getEntListFetch: {status: 'pending'},
                RecordListLoading: true
            };
        }),
        [getEntList.success]: merge((payload, state) => {
            return {
                getEntListFetch: {status: 'success', response: payload},
                RecordCount: payload.Data.RecordCount,
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.SalaryStr = `${item.MinSalary / 100}元-${item.MaxSalary / 100}元`;
                    if (item.LabourCostList && item.LabourCostList.length) {
                        item.SalaryStr += item.LabourCostList.map(i => `\n${Gender[i.Gender]}${i.UnitPay / 100 + (i.SubsidyUnitPay ? '+' + i.SubsidyUnitPay / 100 : '')}元/${ValuateUnit[i.ValuateUnit]}`);
                    }

                    let GenderRatioMaleStr = `男：${item.MaleMinAge || 0}-${item.MaleMaxAge || 0}`;
                    let GenderRatioFeMaleStr = `女：${item.FeMaleMinAge || 0}-${item.FeMaleMaxAge || 0}`;

                    let GenderRatioMale = 0;
                    let GenderRatioFeMale = 0;
                    if (item.GenderRatio) {
                        let GenderRatio = item.GenderRatio.split(':');
                        try {
                            GenderRatioMale = Number.parseInt(GenderRatio[0], 10);
                            GenderRatioFeMale = Number.parseInt(GenderRatio[1], 10);
                        } catch (ignore) {
                        }
                        if (!Number.isInteger(GenderRatioMale)) GenderRatioMale = 0;
                        if (!Number.isInteger(GenderRatioFeMale)) GenderRatioFeMale = 0;
                    }
                    if ((GenderRatioMale === 0 && GenderRatioFeMale === 0) || (GenderRatioMale > 0 && GenderRatioFeMale > 0)) {
                        item.GenderRatioStr = `${GenderRatioMaleStr}\n${GenderRatioFeMaleStr}\n男女比例：${GenderRatioMale > 0 ? GenderRatioMale + ':' + GenderRatioFeMale : '不限'}`;
                    } else if (GenderRatioMale) {
                        item.GenderRatioStr = `${GenderRatioMaleStr}\n男女比例：只招男的`;
                    } else if (GenderRatioFeMale) {
                        item.GenderRatioStr = `${GenderRatioFeMaleStr}\n男女比例：只招女的`;
                    }
                    return item;
                }),
                RecordListLoading: false
            };
        }),
        [getEntList.error]: merge((payload, state) => {
            return {
                getEntListFetch: {status: 'error', response: payload},
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};