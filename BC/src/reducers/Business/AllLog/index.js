import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ActionLog from 'ACTION/Business/AllLog';
import resetQueryParams from 'ACTION/resetQueryParams';

const {
    getOperateLog,
    exportOperateLog
} = ActionLog;

const STATE_NAME = 'state_business_log';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        q_operateTime: {},
        q_operateType: {value: ''},
        q_operatePeople: {},
        q_operateContent: {},
        o_createTimeOrder: false,
        getOperateLogFetch: {
            status: 'close',
            response: ''
        },
        exportOperateLogFetch: {
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
        [getOperateLog]: merge((payload, state) => {
            return {
                getOperateLogFetch: {
                    status: 'pending'
                }
            };
        }),
        [getOperateLog.success]: merge((payload, state) => {
            return {
                getOperateLogFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount
            };
        }),
        [getOperateLog.error]: merge((payload, state) => {
            return {
                getOperateLogFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [exportOperateLog]: merge((payload, state) => {
            return {
                exportOperateLogFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportOperateLog.success]: merge((payload, state) => {
            return {
                exportOperateLogFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportOperateLog.error]: merge((payload, state) => {
            return {
                exportOperateLogFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;