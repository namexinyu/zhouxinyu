import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';

const {
    getOrderList,
    exportOrderList,
    setInterview
} = UserOrderAction;
const STATE_NAME = 'state_business_userorder';

function InitialState() {
    return {
        queryParams: {
            InterviewTime: {},
            JFFInterviewStatus: {value: '-9999'},
            PayType: {value: '-9999'},
            RealName: {},
            SettleStatus: {value: '-9999'},
            Recruit: {},
            Labor: {}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCheckInTime: false
        },
        RecordList: [],
        RecordListLoading: false,
        RecordCount: 0,

        getOrderListFetch: {
            status: 'close',
            response: ''
        },
        setInterviewFetch: {
            status: 'close',
            response: ''
        },
        exportOrderListFetch: {
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
        [getOrderList]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getOrderList.success]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.SequenceNumber = index + 1 + (state.pageParam.currentPage - 1) * state.pageParam.pageSize;
                    return item;
                }),
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getOrderList.error]: merge((payload, state) => {
            return {
                getOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [setInterview]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'pending'
                }
            };
        }),
        [setInterview.success]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setInterview.error]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [exportOrderList]: merge((payload, state) => {
            return {
                exportOrderListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportOrderList.success]: merge((payload, state) => {
            return {
                exportOrderListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportOrderList.error]: merge((payload, state) => {
            return {
                exportOrderListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;