import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import ResourceAction from 'ACTION/Broker/Header/Resource';
import {RegexRule, Constant} from 'UTIL/constant/index';

const {
    GetNoHandleList,
    getHandledList,
    getAvaCount,
    resourceApply
} = ResourceAction;

const STATE_NAME = 'state_broker_header_resource';

function InitialState() {
    return {
        DayRest: 0,
        HourRest: 0,
        ApplyStatus: 0,
        getAvaCountFetch: {
            status: 'close',
            response: ''
        },
        resourceApplyFetch: {
            status: 'close',
            response: ''
        },

        tabKey: 'tab1',
        q_Date: {value: [moment().subtract(1, 'month'), moment()]},
        q_GetSource: {value: '-9999'},
        q_UserName: {},
        q_Phone: {},

        pageParam: {
            currentPage: 1,
            pageSize: Constant.pageSize
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        getHandledListFetch: {
            status: 'close',
            response: ''
        },

        noHandleDataList: [],
        noHandleDataListLoading: false,
        GetNoHandleListFetch: {
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
                init.q_Date = {};
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
        [getHandledList]: merge((payload, state) => {
            return {
                getHandledListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getHandledList.success]: merge((payload, state) => {
            return {
                getHandledListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.ResourceList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getHandledList.error]: merge((payload, state) => {
            return {
                getHandledListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [GetNoHandleList]: merge((payload, state) => {
            return {
                GetNoHandleListFetch: {
                    status: 'pending'
                },
                noHandleDataListLoading: true
            };
        }),
        [GetNoHandleList.success]: merge((payload, state) => {
            return {
                GetNoHandleListFetch: {
                    status: 'success',
                    response: payload
                },
                noHandleDataList: payload.Data.ResourceList || [],
                noHandleDataListLoading: false
            };
        }),
        [GetNoHandleList.error]: merge((payload, state) => {
            return {
                GetNoHandleListFetch: {
                    status: 'error',
                    response: payload
                },
                noHandleDataList: [],
                noHandleDataListLoading: false
            };
        }),
        [getAvaCount]: merge((payload, state) => {
            return {
                getAvaCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAvaCount.success]: merge((payload, state) => {
            return {
                getAvaCountFetch: {
                    status: 'success',
                    response: payload
                },
                ApplyStatus: payload.Data.ApplyStatus,
                HourRest: payload.Data.HourRest,
                DayRest: payload.Data.DayRest
            };
        }),
        [getAvaCount.error]: merge((payload, state) => {
            return {
                getAvaCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [resourceApply]: merge((payload, state) => {
            return {
                resourceApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [resourceApply.success]: merge((payload, state) => {
            return {
                resourceApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [resourceApply.error]: merge((payload, state) => {
            return {
                resourceApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
