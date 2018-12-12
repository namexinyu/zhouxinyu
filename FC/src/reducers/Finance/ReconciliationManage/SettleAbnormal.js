import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {getAbnormalList} = ReconciliationManageAction;

const STATE_NAME = 'state_finance_settleAbnormal';

function InitialState() {
    return {
        queryParams: {
            Date: {value: []},
            Labor: {}, Recruit: {}, Mobile: {}, RealName: {},
            FinanceSettleStatus: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {},
        RecordCount: 0,
        RecordList: [],
        RecordSum: {},
        RecordListLoading: false,

        getAbnormalListFetch: {
            status: 'close',
            response: ''
        }
    };
}

const tableMoneyCol = ['LaborSubsidyAmount', 'LaborSubsidyAmountReal', 'UserSubsidyAmount'];

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
        [getAbnormalList]: merge((payload, state) => {
            return {
                getAbnormalListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getAbnormalList.success]: merge((payload, state) => {
            let RecordList = (payload.Data.RecordList || []).map(value => {
                let item = {...value};
                for (let value of tableMoneyCol) item[value] = Number.isInteger(item[value]) ? item[value] / 100 : '';

                item.FinanceSettleStatusStr = item.FinanceSettleStatus === 4 ? '少返' : '漏返';
                item.FinanceSettleStatusClass = item.FinanceSettleStatus === 4 ? 'color-orange' : 'color-red';

                let ct = moment(item.CheckInTime);
                item.CheckInTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.CheckInTime;
                return item;
            });
            RecordList.push({
                CheckInTimeStr: '总计',
                ...Object.entries(payload.Data.RecordSum).reduce((pre, cur) => {
                    pre[cur[0]] = Number.isInteger(cur[1]) ? cur[1] / 100 : cur[1];
                    return pre;
                }, {})
            });
            return {
                getAbnormalListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount || 0,
                RecordList, RecordSum: payload.Data.RecordSum || {},
                RecordListLoading: false
            };
        }),
        [getAbnormalList.error]: merge((payload, state) => {
            return {
                getAbnormalListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};