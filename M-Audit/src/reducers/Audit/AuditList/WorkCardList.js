import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AuditListAction from 'ACTION/Audit/AuditListAction';
import moment from 'moment';

const {
    getWorkCardList
} = AuditListAction;
const STATE_NAME = 'state_audit_workCardList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            StartDate: {value: undefined},
            StopDate: {value: undefined},
            UserName: {value: ''},
            Mobile: {value: ''},
            IDCardNum: {value: ''},
            AuditStatus: {value: '-9999'},
            JobNum: {value: ''},
            Enterprise: {value: {value: '', text: ''}}
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
        getWorkCardListFetch: {
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
        [getWorkCardList]: merge((payload, state) => {
            return {
                getWorkCardListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getWorkCardList.success]: merge((payload, state) => {
            return {
                getWorkCardListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [getWorkCardList.error]: merge((payload, state) => {
            return {
                getWorkCardListFetch: {
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