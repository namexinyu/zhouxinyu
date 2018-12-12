import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {getBillDetailList} = ReconciliationManageAction;

const STATE_NAME = 'state_finance_serviceBillDetail';

function InitialState() {
    return {
        queryParams: {
            Date: {value: moment()},
            Labor: {}, Recruit: {}, Mobile: {}, RealName: {}
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

        getBillDetailListFetch: {
            status: 'close',
            response: ''
        }
    };
}

const tableMoneyCol = ['LaborSubsidyAmountReal', 'UserSubsidyAmount', 'UserSubsidyAmountReal', 'RemainAmount'];

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
        [getBillDetailList]: merge((payload, state) => {
            return {
                getBillDetailListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getBillDetailList.success]: merge((payload, state) => {
            let RecordList = (payload.Data.RecordList || []).map(value => {
                let item = {...value};
                for (let value of tableMoneyCol) item[value] = Number.isInteger(item[value]) ? item[value] / 100 : '';

                let ct = moment(item.CheckInTime);
                item.CheckInTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.CheckInTime;

                ct = moment(item.FinanceTime);
                item.FinanceTimeStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.FinanceTime;
                ct = moment(item.UserSubsidyAmountPay);
                item.UserSubsidyAmountPayStr = ct.isValid() ? ct.format('YYYY-MM-DD') : item.UserSubsidyAmountPay;
                return item;
            });

            let RecordSum = payload.Data.RecordSum || {};
            return {
                getBillDetailListFetch: {
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
        [getBillDetailList.error]: merge((payload, state) => {
            return {
                getBillDetailListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};