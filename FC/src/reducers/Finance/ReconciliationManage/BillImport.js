import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';

const {laborMonthBillImport, laborMonthBillSave} = ReconciliationManageAction;

const STATE_NAME = 'state_finance_bill_import';

function InitialState() {
    return {
        BillImportExcelList: [],

        RecordList: [],
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
        laborMonthBillImportFetch: {
            status: 'close',
            response: ''
        },
        laborMonthBillSaveFetch: {
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
        [laborMonthBillImport]: merge((payload, state) => {
            return {
                laborMonthBillImportFetch: {
                    status: 'pending'
                },
                RecordListLoading: true, selectedRowKeys: [], selectedRows: [], FileMd5: ''
            };
        }),
        [laborMonthBillImport.success]: merge((payload, state) => {
            return {
                laborMonthBillImportFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.rowKey = index + 1;
                    item.InvoiceAmountStr = Number.isInteger(item.InvoiceAmount) ? item.InvoiceAmount / 100 : '-';
                    return item;
                }),
                RecordListLoading: false, FileMd5: payload.Data.FileMd5
            };
        }),
        [laborMonthBillImport.error]: merge((payload, state) => {
            return {
                laborMonthBillImportFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            };
        }),
        [laborMonthBillSave]: merge((payload, state) => {
            return {
                laborMonthBillSaveFetch: {
                    status: 'pending'
                }
            };
        }),
        [laborMonthBillSave.success]: merge((payload, state) => {
            return {
                laborMonthBillSaveFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [laborMonthBillSave.error]: merge((payload, state) => {
            return {
                laborMonthBillSaveFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;