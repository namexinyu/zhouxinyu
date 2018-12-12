import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import RecruitMirrorAction from 'ACTION/Business/Recruit/RecruitMirrorAction';

const {getAuditQuoteList, auditQuote} = RecruitMirrorAction;
const STATE_NAME = 'state_business_subsidy_check';
import moment from 'moment';

function InitialState() {
    return {
        queryParams: {
            Date: {value: moment()},
            Recruit: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        tagParam: [],
        orderParam: {
            Order: false
        },
        RecordList: [],
        RecordListLoading: false,
        RecordCount: 0,

        auditQuoteFetch: {
            status: 'close',
            response: ''
        },
        getAuditQuoteListFetch: {
            status: 'close',
            response: ''
        },
        AuditQuoteModalItem: {
            AuditResult: {value: '2'},
            Remark: {}
        }
    };
}

const Reducer = {
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
        [getAuditQuoteList]: merge((payload, state) => {
            return {
                getAuditQuoteListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getAuditQuoteList.success]: merge((payload, state) => {
            return {
                getAuditQuoteListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getAuditQuoteList.error]: merge((payload, state) => {
            return {
                getAuditQuoteListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [auditQuote]: merge((payload, state) => {
            return {
                auditQuoteFetch: {
                    status: 'pending'
                },
                AuditQuoteModalItem: {...state.AuditQuoteModalItem, confirmLoading: true}
            };
        }),
        [auditQuote.success]: merge((payload, state) => {
            return {
                auditQuoteFetch: {
                    status: 'success',
                    response: payload
                },
                AuditQuoteModalItem: {...state.AuditQuoteModalItem, confirmLoading: false}
            };
        }),
        [auditQuote.error]: merge((payload, state) => {
            return {
                auditQuoteFetch: {
                    status: 'error',
                    response: payload
                },
                AuditQuoteModalItem: {...state.AuditQuoteModalItem, confirmLoading: false}
            };
        })
    }
};
export default Reducer;