import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import ComplainOrderAction from 'ACTION/Finance/TradeManage/ComplainOrderAction';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {
    getComplainRecordList, exportComplainRecordList
} = ComplainOrderAction;
const STATE_NAME = 'state_finance_trade_complain_labor';

function InitialState() {
    return {
        q_Date: {value: [moment().subtract(1, 'week'), moment()]},
        q_UserName: {},
        q_Labor: {},

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            CreateTimeOrder: false
        },
        // tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        getComplainRecordListFetch: {
            status: 'close',
            response: ''
        },
        exportComplainRecordListFetch: {
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
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
                // return init.queryParams;
            }
            return {};
        }),
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return new InitialState();
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
        [getComplainRecordList]: merge((payload, state) => {
            return {
                getComplainRecordListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getComplainRecordList.success]: merge((payload, state) => {
            return {
                getComplainRecordListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getComplainRecordList.error]: merge((payload, state) => {
            return {
                getComplainRecordListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [exportComplainRecordList]: merge((payload, state) => {
            return {
                exportComplainRecordListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportComplainRecordList.success]: merge((payload, state) => {
            return {
                exportComplainRecordListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportComplainRecordList.error]: merge((payload, state) => {
            return {
                exportComplainRecordListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;