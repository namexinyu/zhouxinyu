import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionEnterprise from 'ACTION/Business/Enterprise/ActionEnterprise';

const {
    getEntSummaryList,
    exportEntList
} = ActionEnterprise;

const STATE_NAME = 'state_servicer_enterprise_list';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        categoryList: [],
        categoryEnum: {},
        currentEnterprise: '',
        q_entShortName: undefined,
        q_categoryId: {},
        q_areaCode: undefined,
        q_createTime: undefined,
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        currentEnt: '',
        showMap: false,
        getEntSummaryListFetch: {
            status: 'close',
            response: ''
        },
        exportEntListFetch: {
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
        [getEntSummaryList]: merge((payload, state) => {
            return {
                getEntSummaryListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEntSummaryList.success]: merge((payload, state) => {
            return {
                getEntSummaryListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList || [],
                recordCount: payload.Data.RecordCount
            };
        }),
        [getEntSummaryList.error]: merge((payload, state) => {
            return {
                getEntSummaryListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [exportEntList]: merge((payload, state) => {
            return {
                exportEntListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportEntList.success]: merge((payload, state) => {
            return {
                exportEntListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportEntList.error]: merge((payload, state) => {
            return {
                exportEntListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

