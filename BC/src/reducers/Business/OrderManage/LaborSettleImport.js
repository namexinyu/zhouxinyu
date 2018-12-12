import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborSettleImportAction from 'ACTION/Business/OrderManage/LaborSettleImportAction';

const {
    saveLaborSettle,
    importLaborSettle
} = LaborSettleImportAction;
const STATE_NAME = 'state_business_labororder_settle_import';

function InitialState() {
    return {
        laborSettleList: [],

        RecordList: [],
        importLaborSettleFetch: {
            status: 'close',
            response: ''
        },
        saveRecordList: [],
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
            return {
                importLaborSettleFetch: {
                    status: 'pending'
                }
            };
        }),
        [importLaborSettle.success]: merge((payload, state) => {
            return {
                importLaborSettleFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList
            };
        }),
        [importLaborSettle.error]: merge((payload, state) => {
            return {
                importLaborSettleFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [saveLaborSettle]: merge((payload, state) => {
            return {
                saveLaborSettleFetch: {
                    status: 'pending'
                }
            };
        }),
        [saveLaborSettle.success]: merge((payload, state) => {
            return {
                saveLaborSettleFetch: {
                    status: 'success',
                    response: payload
                },
                saveRecordList: payload.Data.RecordList
            };
        }),
        [saveLaborSettle.error]: merge((payload, state) => {
            return {
                saveLaborSettleFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;