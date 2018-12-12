import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AuditListAction from 'ACTION/Audit/AuditListAction';
import moment from 'moment';

const {
    getBankCardList
} = AuditListAction;
const STATE_NAME = 'state_audit_bankCardList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            DateBegin: {value: undefined},
            DateEnd: {value: undefined},
            RealName: {value: ''},
            Mobile: {value: ''},
            AccountNum: {value: ''},
            IDCardNum: {value: ''},
            IsOCR: {value: '-9999'},
            AuditStatus: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        getBankCardListFetch: {
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
                return {queryParams: init.queryParams};
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
        [getBankCardList]: merge((payload, state) => {
            return {
                getBankCardListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getBankCardList.success]: merge((payload, state) => {
            return {
                getBankCardListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [getBankCardList.error]: merge((payload, state) => {
            return {
                getBankCardListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;