import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';


const {importSettleLaborCharge, saveSettleLaborCharge} = FeeAction;

const STATE_NAME = 'state_finance_labor_charge_import';

function InitialState() {
    return {
        ImportExcelList: [],

        RecordList: [],
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
        importSettleLaborChargeFetch: {
            status: 'close',
            response: ''
        },
        saveSettleLaborChargeFetch: {
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
        [importSettleLaborCharge]: merge((payload, state) => {
            return {
                importSettleLaborChargeFetch: {
                    status: 'pending'
                },
                RecordListLoading: true, selectedRowKeys: [], selectedRows: [], FileMd5: ''
            };
        }),
        [importSettleLaborCharge.success]: merge((payload, state) => {
            return {
                importSettleLaborChargeFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.rowKey = index + 1;
                    item.LaborChargeAmountRealStr = Number.isInteger(item.LaborChargeAmountReal) ? item.LaborChargeAmountReal / 100 : '-';
                    item.LaborChargePaymentStr = item.LaborChargePayment === 1 ? '打款' : item.LaborChargePayment === 2 ? '转充值' : item.LaborChargePayment;
                    return item;
                }),
                RecordListLoading: false, FileMd5: payload.Data.FileMd5
            };
        }),
        [importSettleLaborCharge.error]: merge((payload, state) => {
            return {
                importSettleLaborChargeFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            };
        }),
        [saveSettleLaborCharge]: merge((payload, state) => {
            return {
                saveSettleLaborChargeFetch: {
                    status: 'pending'
                }
            };
        }),
        [saveSettleLaborCharge.success]: merge((payload, state) => {
            return {
                saveSettleLaborChargeFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [saveSettleLaborCharge.error]: merge((payload, state) => {
            return {
                saveSettleLaborChargeFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;