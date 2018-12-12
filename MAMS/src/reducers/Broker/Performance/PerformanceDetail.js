import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import PerformanceAction from 'ACTION/Broker/Performance/PerformanceAction';

const STATE_NAME = 'state_ac_performanceDetail';

const {
    GetPerformanceDetailZxxMD,
    GetPerformanceDetailZxx90,
    GetPerformanceDetailZxx150,
    GetPerformanceDetailZxxLz,
    GetPerformanceDetailWD,
    GetPerformanceDetailBJS
} = PerformanceAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        type: '',
        queryParams: {
            RealName: {value: ''}
        },
        Param: undefined,
        CurrentTab: 'listZxxMD',
        listZxxMD: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailZxxMDFetch: {
                status: 'close',
                response: ''
            }
        },
        listZxx90: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailZxx90Fetch: {
                status: 'close',
                response: ''
            }
        },
        listZxx150: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailZxx150Fetch: {
                status: 'close',
                response: ''
            }
        },
        listZxxLz: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailZxxLzFetch: {
                status: 'close',
                response: ''
            }
        },
        listWD: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailZxxWDFetch: {
                status: 'close',
                response: ''
            }
        },
        listBJS: {
            RecordList: [],
            RecordCount: 0,
            RecordListLoading: false,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            },
            GetPerformanceDetailBJSFetch: {
                status: 'close',
                response: ''
            }
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
        [GetPerformanceDetailZxxMD]: merge((payload, state) => {
            return {
                listZxxMD: Object.assign({}, state.listZxxMD, {
                    GetPerformanceDetailZxxMDFetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailZxxMD.success]: merge((payload, state) => {
            return {
                listZxxMD: Object.assign({}, state.listZxxMD, {
                    GetPerformanceDetailZxxMDFetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailZxxMD.error]: merge((payload, state) => {
            return {
                listZxxMD: Object.assign({}, state.listZxxMD, {
                    GetPerformanceDetailZxxMDFetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        }),
        // 华丽的三连请求ACTION分割线
        [GetPerformanceDetailZxx90]: merge((payload, state) => {
            return {
                listZxx90: Object.assign({}, state.listZxx90, {
                    GetPerformanceDetailZxx90Fetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailZxx90.success]: merge((payload, state) => {
            return {
                listZxx90: Object.assign({}, state.listZxx90, {
                    GetPerformanceDetailZxx90Fetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailZxx90.error]: merge((payload, state) => {
            return {
                listZxx90: Object.assign({}, state.listZxx90, {
                    GetPerformanceDetailZxx90Fetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        }),
        // 华丽的三连请求ACTION分割线
        [GetPerformanceDetailZxx150]: merge((payload, state) => {
            return {
                listZxx150: Object.assign({}, state.listZxx150, {
                    GetPerformanceDetailZxx150Fetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailZxx150.success]: merge((payload, state) => {
            return {
                listZxx150: Object.assign({}, state.listZxx150, {
                    GetPerformanceDetailZxx150Fetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailZxx150.error]: merge((payload, state) => {
            return {
                listZxx150: Object.assign({}, state.listZxx150, {
                    GetPerformanceDetailZxx150Fetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        }),
        // 华丽的三连请求ACTION分割线
        [GetPerformanceDetailZxxLz]: merge((payload, state) => {
            return {
                listZxxLz: Object.assign({}, state.listZxxLz, {
                    GetPerformanceDetailZxxLzFetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailZxxLz.success]: merge((payload, state) => {
            return {
                listZxxLz: Object.assign({}, state.listZxxLz, {
                    GetPerformanceDetailZxxLzFetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailZxxLz.error]: merge((payload, state) => {
            return {
                listZxxLz: Object.assign({}, state.listZxxLz, {
                    GetPerformanceDetailZxxLzFetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        }),
        // 华丽的三连请求ACTION分割线
        [GetPerformanceDetailWD]: merge((payload, state) => {
            return {
                listWD: Object.assign({}, state.listWD, {
                    GetPerformanceDetailWDFetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailWD.success]: merge((payload, state) => {
            return {
                listWD: Object.assign({}, state.listWD, {
                    GetPerformanceDetailWDFetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailWD.error]: merge((payload, state) => {
            return {
                listWD: Object.assign({}, state.listWD, {
                    GetPerformanceDetailWDFetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        }),
        // 华丽的三连请求ACTION分割线
        [GetPerformanceDetailBJS]: merge((payload, state) => {
            return {
                listBJS: Object.assign({}, state.listBJS, {
                    GetPerformanceDetailBJSFetch: {
                        status: 'pending'
                    },
                    RecordListLoading: true
                })
            };
        }),
        [GetPerformanceDetailBJS.success]: merge((payload, state) => {
            return {
                listBJS: Object.assign({}, state.listBJS, {
                    GetPerformanceDetailBJSFetch: {
                        status: 'success',
                        response: payload
                    },
                    RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                    RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                    RecordListLoading: false
                })
            };
        }),
        [GetPerformanceDetailBJS.error]: merge((payload, state) => {
            return {
                listBJS: Object.assign({}, state.listBJS, {
                    GetPerformanceDetailBJSFetch: {
                        status: 'error',
                        response: payload
                    },
                    RecordList: [],
                    RecordCount: 0,
                    RecordListLoading: false
                })
            };
        })


    }
};
export default Reducer;