import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberList from 'ACTION/Broker/Member/getMemberList';
import resetMemberListQueryParams from 'ACTION/Broker/Member/resetMemberListQueryParams';
import helpMemberRegister from "ACTION/Broker/Member/helpMemberRegister";
import {Constant} from 'UTIL/constant/index';

const STATE_NAME = 'state_broker_memberList';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: Constant.pageSize,
        recordList: [],
        q_Name: {},
        q_Phone: {},
        q_QQ: {},
        q_WeChat: {},
        q_RegStartDate: {},
        q_RegStopDate: {},
        q_InviteName: {},
        q_Status: {
            value: '-9999'
        },
        q_Source: {
            value: '-9999'
        },
        q_WorkState: {
            value: '-9999'
        },
        q_TimeInterval: {
            value: '-9999'
        },
        q_IsCert: {
            value: '-9999'
        },
        q_IsWeekPay: {
            value: '-9999'
        },
        q_IsPreOrder: {
            value: '-9999'
        },
        LastContactStartDate: {},
        LastContactStopDate: {},
        queryParams: {
            Name: '',
            Phone: '',
            QQ: '',
            WeChat: '',
            InviteName: '',
            RegStartDate: '',
            RegStopDate: '',
            Status: -9999,
            Source: -9999,
            WorkState: -9999,
            TimeInterval: -9999,
            IsCert: -9999,
            IsWeekPay: -9999,
            IsPreOrder: -9999
        },
        orderParams: {
            ContactTime: 1
        },
        getMemberListFetch: {
            status: 'close',
            response: ''
        },
        registerName: {},
        registerMobile: {},
        abnormalName: '',
        abnormalMobile: '',
        abnormalReason: '',
        banPostName: '',
        banPostMobile: '',
        banPostReason: '',
        helpMemberRegisterFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let temp = Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
                return temp;
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
        [resetMemberListQueryParams]: merge((payload, state) => {
            return {
                queryParams: new InitialState().queryParams
            };
        }),
        [getMemberList]: merge((payload, state) => {
            return {
                getMemberListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberList.success]: merge((payload, state) => {
            return {
                getMemberListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: (payload.Data && payload.Data.MemberList) ? payload.Data.MemberList : [],
                recordCount: (payload.Data && payload.Data.RecordCount) ? payload.Data.RecordCount : 0
            };
        }),
        [getMemberList.error]: merge((payload, state) => {
            return {
                getMemberListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [helpMemberRegister]: merge((payload, state) => {
            return {
                helpMemberRegisterFetch: {
                    status: 'pending'
                }
            };
        }),
        [helpMemberRegister.success]: merge((payload, state) => {
            return {
                helpMemberRegisterFetch: {
                    status: 'success',
                    response: payload
                },
                registerName: '',
                registerMobile: ''
            };
        }),
        [helpMemberRegister.error]: merge((payload, state) => {
            return {
                helpMemberRegisterFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;