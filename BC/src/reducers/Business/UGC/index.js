import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import UGCAction from 'ACTION/Business/UGC';

const {getUGCList} = UGCAction;
const STATE_NAME = 'state_business_ugc';

function InitialState() {
    return {
        queryParams: {
            AuditStatus: {value: '0'},
            CreateTimeStart: {},
            CreateTimeEnd: {},
            EnterpriseName: {},
            UGCType: {value: '0'},
            UserName: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByAuditTime: false,
            OrderByCreateTime: false
        },
        RecordList: [],
        RecordListLoading: false,
        RecordCount: 0,

        getUGCListFetch: {
            status: 'close',
            response: ''
        }
    };
}

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
        [getUGCList]: merge((payload, state) => {
            return {
                getUGCListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getUGCList.success]: merge((payload, state) => {
            return {
                getUGCListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getUGCList.error]: merge((payload, state) => {
            return {
                getUGCListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        })
    }
};