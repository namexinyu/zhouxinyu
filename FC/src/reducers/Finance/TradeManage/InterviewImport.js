import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import InterviewImportAction from 'ACTION/Finance/TradeManage/InterviewImportAction';

const {
    saveLaborSettle,
    importLaborSettle
} = InterviewImportAction;
const STATE_NAME = 'state_finance_interview_import';

const RED = 2;

function InitialState() {
    return {
        laborImportInterviewList: [],

        RecordList: [],
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
        selectedRowSum: {},
        RowSum: {},
        importLaborSettleFetch: {
            status: 'close',
            response: ''
        },
        saveLaborSettleFetch: {
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
        [importLaborSettle]: merge((payload, state) => {
            return payload.red == RED ? {
                red: payload.red,
                importLaborSettleFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [],
                RowSum: {},
                selectedRows: [],
                selectedRowSum: {},
                FileMd5: ''
            } : {};
        }),
        [importLaborSettle.success]: merge((payload, state) => {
            let RowSum = {Count: 0, Amount: 0, DisabledCount: 0, EnableCount: 0, DisabledAmount: 0, EnableAmount: 0};

            let RecordList = (payload.Data.RecordList || []).map((item, index) => {
                RowSum.Count++;
                RowSum.Amount += item.LaborSubsidyAmountReal;
                if (item.InterviewID) {
                    RowSum.EnableAmount += item.LaborSubsidyAmountReal;
                    RowSum.EnableCount++;
                } else {
                    RowSum.DisabledAmount += item.LaborSubsidyAmountReal;
                    RowSum.DisabledCount++;
                }
                item.rowKey = index + 1;
                item.LaborSubsidyAmountRealStr = Number.isInteger(item.LaborSubsidyAmountReal) ? item.LaborSubsidyAmountReal / 100 : '-';
                return item;
            });
            return state.red == RED ? {
                red: 0,
                importLaborSettleFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList, RowSum,
                RecordListLoading: false, FileMd5: payload.Data.FileMd5
            } : {};
        }),
        [importLaborSettle.error]: merge((payload, state) => {
            return state.red == RED ? {
                red: 0,
                importLaborSettleFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            } : {};
        }),
        [saveLaborSettle]: merge((payload, state) => {
            return payload.red == RED ? {
                red: payload.red,
                saveLaborSettleFetch: {
                    status: 'pending'
                }
            } : {};
        }),
        [saveLaborSettle.success]: merge((payload, state) => {
            return state.red == RED ? {
                red: 0,
                saveLaborSettleFetch: {
                    status: 'success',
                    response: payload
                }
            } : {};
        }),
        [saveLaborSettle.error]: merge((payload, state) => {
            return state.red == RED ? {
                red: 0,
                saveLaborSettleFetch: {
                    status: 'error',
                    response: payload
                }
            } : {};
        })
    }
};
export default Reducer;