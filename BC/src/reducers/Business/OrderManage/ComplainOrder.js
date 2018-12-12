import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ComplainOrderAction from 'ACTION/Business/OrderManage/ComplainOrderAction';

const {
    complainHandle,
    getComplainList,
    getComplainTotal,
    complainListExport
} = ComplainOrderAction;
const STATE_NAME = 'state_business_complainorder';

function InitialState() {
    return {
        q_CreateTime: {},
        q_Labor: {},
        q_OrderStep: {value: '-9999'},
        q_RealName: {},
        q_Recruit: {},

        AuditStatus: -9999, // 申诉状态
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCreateTime: false
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        getComplainListFetch: {
            status: 'close',
            response: ''
        },
        NoHandleCount: 0,
        PassCount: 0,
        RefuceCount: 0,
        getComplainTotalFetch: {
            status: 'close',
            response: ''
        },
        complainHandleFetch: {
            status: 'close',
            response: ''
        },
        complainListExportFetch: {
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
        [getComplainList]: merge((payload, state) => {
            return {
                getComplainListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getComplainList.success]: merge((payload, state) => {
            return {
                getComplainListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getComplainList.error]: merge((payload, state) => {
            return {
                getComplainListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [getComplainTotal]: merge((payload, state) => {
            return {
                getComplainTotalFetch: {
                    status: 'pending'
                }
            };
        }),
        [getComplainTotal.success]: merge((payload, state) => {
            return {
                getComplainTotalFetch: {
                    status: 'success',
                    response: payload
                },
                NoHandleCount: payload.Data.NoHandleCount,
                PassCount: payload.Data.PassCount,
                RefuceCount: payload.Data.RefuceCount
            };
        }),
        [getComplainTotal.error]: merge((payload, state) => {
            return {
                getComplainTotalFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [complainHandle]: merge((payload, state) => {
            return {
                complainHandleFetch: {
                    status: 'pending'
                }
            };
        }),
        [complainHandle.success]: merge((payload, state) => {
            return {
                complainHandleFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [complainHandle.error]: merge((payload, state) => {
            return {
                complainHandleFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [complainListExport]: merge((payload, state) => {
            return {
                complainListExportFetch: {
                    status: 'pending'
                }
            };
        }),
        [complainListExport.success]: merge((payload, state) => {
            return {
                complainListExportFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [complainListExport.error]: merge((payload, state) => {
            return {
                complainListExportFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;