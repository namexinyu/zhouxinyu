import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import EverysignviewList from 'ACTION/Common/Assistance/Everysign';

const STATE_NAME = 'state_ac_everysign';
const Id = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
const datement = new Date();

function addKey(a) {
    for(var i = 0; i < a.length; i++) {
          a[i].key = (i + 1).toString();
    }
    return a;
} 

function InitialState() {
    return {
        state_name: STATE_NAME,
        Date: moment(datement).format('YYYY-MM'),
        DepartID: 0,
        EmployeeID: Id,
        GroupID: 0,
        RecordCount: 0,
        currentPage: 1,
        pageSize: 80,
        RecordList: [],
        RecordListLoading: false,
        everysignListFetch: {
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
        [EverysignviewList]: merge((payload, state) => {
            return {
                everysignListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [EverysignviewList.success]: merge((payload, state) => {
            return {
                everysignListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? addKey(payload.Data.RecordList) || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [EverysignviewList.error]: merge((payload, state) => {
            return {
                everysignListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;