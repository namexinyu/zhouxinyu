import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import MemberAction from 'ACTION/Assistant/MemberAction';

const STATE_NAME = 'state_ac_memberList';

const {
    GetMemberList
} = MemberAction;

function addKey(a) {
    for(var i = 0; i < a.length; i++) {
          a[i].key = (i + 1).toString();
    }
    return a;
}

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: undefined,
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: 40
        },
        orderParams: 0,
        RecordList: [],
        RecordCount: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        GetMemberListFetch: {
            status: 'close',
            response: ''
        },
        setCallbackEntryDataFetch: {
            status: 'close',
            response: ''
        },
        orderInfo: {
            key: 'RegTime',
            order: 0
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
        [GetMemberList]: merge((payload, state) => {
            let queryParams = state.queryParams;
            const dateVal = ((queryParams || {}).RangeDate || {}).value || [undefined, undefined];
            if (dateVal[0] || dateVal[1]) {
                const {UserName, UserMobile, WeChat, QQ} = (queryParams || {});
                if ((UserName || {}).value || (UserMobile || {}).value || (WeChat || {}).value || (QQ || {}).value) {
                    queryParams.RangeDate = {value: [undefined, undefined]};
                }
            }
            return {
                queryParams: queryParams,
                GetMemberListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [GetMemberList.success]: merge((payload, state) => {
            return {
                GetMemberListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? addKey(payload.Data.RecordList) || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetMemberList.error]: merge((payload, state) => {
            return {
                GetMemberListFetch: {
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