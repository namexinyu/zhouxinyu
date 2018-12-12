import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import GetDepartEntrustListMy from 'ACTION/Common/Assistance/GetDepartEntrustListMy';

const STATE_NAME = 'state_mams_assistanceListMy';

function InitialState() {
    return {
        state_name: STATE_NAME,
        assistanceList: [],
        currentTab: 'all', // 部门委托子标签['all','my']
        queryParams: {
            StartDate: {value: undefined},
            StopDate: {value: undefined},
            // SourceDepartID: {value: '-9999'},
            TargetDepartID: {value: '-9999'},
            HandleEmployeeName: {value: ''},
            HandleEmployeeID: {value: undefined},
            EntrustStatus: {value: '-9999'},
            CloseStatus: {value: '-9999'},
            Grade: {value: '-9999'},
            Content: {value: undefined}
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        GetDepartEntrustListMyFetch: {
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [GetDepartEntrustListMy]: merge((payload, state) => {
            return {
                GetDepartEntrustListMyFetch: {
                    status: 'pending'
                }
            };
        }),
        [GetDepartEntrustListMy.success]: merge((payload, state) => {
            return {
                GetDepartEntrustListMyFetch: {
                    status: 'success',
                    response: payload
                },
                assistanceList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [GetDepartEntrustListMy.error]: merge((payload, state) => {
            return {
                GetDepartEntrustListMyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;