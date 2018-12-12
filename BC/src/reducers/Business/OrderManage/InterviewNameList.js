import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';

import InterviewNameListAction from 'ACTION/Business/OrderManage/InterviewNameListAction';

const {
    getInterviewList,
    BindSubsidy,
    ListSubsidy
} = InterviewNameListAction;

const STATE_NAME = 'state_business_interview_namelist';

function InitialState() {
    return {
        tabKey: 'tab1',
        queryParams: {
            Date: {value: moment()},
            Labor: {},
            Recruit: {},
            RealName: {},
            Mobile: {},
            PayType: {value: '-9999'},
            SettleStatus: {value: '0'},
            BindRecruitSubsidy: {value: '-9999'}
        },
        recruitType: '',
        pageParam: {
            currentPage: 1,
            pageSize: 100
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        tagParam: [],
        RecordList: [],
        RecordLists: [],
        RecordListLoading: false,
        RecordCount: 0,
        selectedRowKeys: [],
        selectedRowBind: 0,
        selectedRowUnBind: 0,
        bindSubsidyRecruitTmp: {},

        getInterviewListFetch: {
            status: 'close',
            response: ''
        },
        BindSubsidyFetch: {
            status: 'close',
            response: ''
        },
        ListSubsidyFetch: {
            status: 'close',
            response: ''
        },

        BindSubsidyModalItem: {
            RecruitList: [],
            InterviewID: [], // 选中的
            selectedRecruit: {}
        },
        ConfirmSubsidyModalItem: {
            // AssignDesc: {}
            InterviewID: [] // 选中的
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
        [getInterviewList]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getInterviewList.success]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                UnbindSubsidyCount: payload.Data.UnbindSubsidyCount,
                RecordListLoading: false
            };
        }),
        [getInterviewList.error]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: [],
                UnbindSubsidyCount: 0
            };
        }),
        [BindSubsidy]: merge((payload, state) => {
            return {
                BindSubsidyFetch: {
                    status: 'pending'
                }
            };
        }),
        [BindSubsidy.success]: merge((payload, state) => {
            return {
                BindSubsidyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [BindSubsidy.error]: merge((payload, state) => {
            return {
                BindSubsidyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [ListSubsidy]: merge((payload, state) => {
            return {
                ListSubsidyFetch: {
                    status: 'pending'
                }
            };
        }),
        [ListSubsidy.success]: merge((payload, state) => {
            return {
                ListSubsidyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [ListSubsidy.error]: merge((payload, state) => {
            return {
                ListSubsidyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;