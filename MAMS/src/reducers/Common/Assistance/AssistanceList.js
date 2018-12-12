import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import GetDepartEntrustList from 'ACTION/Common/Assistance/GetDepartEntrustList';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import {Constant} from 'UTIL/constant/index';

const STATE_NAME = 'state_mams_assistanceList';
// 部门委托子标签['all','my'] 按当前平台权限，有接收权限默认all，有新建权限则my，皆无则空
const currentPlat = mams[CurrentPlatformCode];
const initTab = currentPlat.acceptAssistance ? 'all' : (currentPlat.buildAssistance ? 'my' : '');


function InitialState() {
    return {
        state_name: STATE_NAME,
        assistanceList: [],
        currentTab: initTab,
        queryParams: {
            StartDate: {value: undefined},
            StopDate: {value: undefined},
            SourceDepartID: {value: '-9999'},
            SourceEmployeeName: {value: {value: '', text: ''}},
            HandleEmployeeName: {value: {value: '', text: ''}},
            HandleEmployeeID: {value: undefined},
            EntrustStatus: {value: '-9999'},
            CloseStatus: {value: '-9999'},
            Grade: {value: '-9999'}
        },
        // orderParams: {Key: 'Checkin', Order: 1},
        currentPage: 1,
        pageSize: Constant.pageSize,
        totalSize: 0,
        GetDepartEntrustListFetch: {
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
        [GetDepartEntrustList]: merge((payload, state) => {
            return {
                GetDepartEntrustListFetch: {
                    status: 'pending'
                },
                needRefresh: false
            };
        }),
        [GetDepartEntrustList.success]: merge((payload, state) => {
            return {
                GetDepartEntrustListFetch: {
                    status: 'success',
                    response: payload
                },
                assistanceList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index + 1;
                    return item;
                }),
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [GetDepartEntrustList.error]: merge((payload, state) => {
            return {
                GetDepartEntrustListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;