import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborInterviewImportAction from 'ACTION/Business/OrderManage/LaborInterviewImportAction';

const {
    saveLaborInterview,
    importLaborInterview
} = LaborInterviewImportAction;
const STATE_NAME = 'state_business_labororder_interview_import';

function InitialState() {
    return {
        laborInterviewList: [],

        RecordList: [],
        importLaborInterviewFetch: {
            status: 'close',
            response: ''
        },
        saveRecordList: [],
        saveLaborInterviewFetch: {
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
        [importLaborInterview]: merge((payload, state) => {
            return {
                importLaborInterviewFetch: {
                    status: 'pending'
                }
            };
        }),
        [importLaborInterview.success]: merge((payload, state) => {
            return {
                importLaborInterviewFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList
            };
        }),
        [importLaborInterview.error]: merge((payload, state) => {
            return {
                importLaborInterviewFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [saveLaborInterview]: merge((payload, state) => {
            return {
                saveLaborInterviewFetch: {
                    status: 'pending'
                }
            };
        }),
        [saveLaborInterview.success]: merge((payload, state) => {
            return {
                saveLaborInterviewFetch: {
                    status: 'success',
                    response: payload
                },
                saveRecordList: payload.Data.RecordList
            };
        }),
        [saveLaborInterview.error]: merge((payload, state) => {
            return {
                saveLaborInterviewFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;