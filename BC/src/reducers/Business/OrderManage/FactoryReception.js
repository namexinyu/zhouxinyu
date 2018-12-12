import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import FactoryReceptionAction from 'ACTION/Business/OrderManage/FactoryReceptionAction';
import moment from 'moment';

const {
    getList,
    setLabor,
    exportList,
    updateInfo
} = FactoryReceptionAction;
const STATE_NAME = 'state_business_factory';

function InitialState() {
    return {
        CheckInDate: {value: moment()},
        UserName: '',
        MobileNumber: '',
        IDCardNumber: '',
        EnterpriseName: '',
        ProcessStatus: {value: '0'},
        selectedRowKeys: [],
        FactoryEntrancePickIDs: {},
        
        ModalItems: {
            Visible: false,
            confirmLoading: false,
            LaborID: ''
        },

        FactoryModalItems: {
            Visible: false,
            record: {}
        },

        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCreateTime: false,
            OrderByPromiseSettleDate: false
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        getListFetch: {
            status: 'close',
            response: ''
        },
        ExecuteCount: 0,
        FinishedCount: 0,
        NoExecuteCount: 0,
        TotalCount: 0,

        setLaborFetch: {
            status: 'close',
            response: ''
        },
        
        exportListFetch: {
            status: 'close',
            response: ''
        },
        updateInfoFetch: {
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
        [getList]: merge((payload, state) => {
            return {
                getListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getList.success]: merge((payload, state) => {
            return {
                getListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getList.error]: merge((payload, state) => {
            return {
                getListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),

        [setLabor]: merge((payload, state) => {
            return {
                setLaborFetch: {
                    status: 'pending'
                }
            };
        }),

        [setLabor.success]: merge((payload, state) => {
            return {
                setLaborFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setLabor.error]: merge((payload, state) => {
            return {
                setLaborFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [exportList]: merge((payload, state) => {
            return {
                exportListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportList.success]: merge((payload, state) => {
            return {
                exportListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportList.error]: merge((payload, state) => {
            return {
                exportListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [updateInfo]: merge((payload, state) => {
            return {
                updateInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [updateInfo.success]: merge((payload, state) => {
            return {
                updateInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [updateInfo.error]: merge((payload, state) => {
            return {
                updateInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;