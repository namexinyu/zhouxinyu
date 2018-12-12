import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import BrokerAction from 'ACTION/Assistant/BrokerAction';

const STATE_NAME = 'state_ac_attendanceList';

const {
    GetAttendanceList,
    CreateAttendanceData
} = BrokerAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            Date: {value: moment()},
            DepartID: {value: '-9999'},
            HubName: {value: ''}
        },
        Editing: false,
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        OriRecordList: [],
        orderParams: 2,
        RecordCount: 0,
        RecordListLoading: false,
        GetAttendanceListFetch: {
            status: 'close',
            response: ''
        },
        CreateAttendanceDataFetch: {
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
                // let init = new InitialState();
                return {queryParams: Object.assign({}, state.queryParams, {Date: {value: moment()}, DepartID: {value: '-9999'},
                HubName: {value: ''}})};
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
        [GetAttendanceList]: merge((payload, state) => {
            return {
                GetAttendanceListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                Editing: false,
                RecordList: [].concat(state.OriRecordList || []),
                tmpObj: {}
            };
        }),
        [GetAttendanceList.success]: merge((payload, state) => {
            let BrokerDepartAttendance = (payload.Data || {}).BrokerDepartAttendance || {};
            return {
                GetAttendanceListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: BrokerDepartAttendance.RecordList || [],
                OriRecordList: BrokerDepartAttendance.RecordList || [],
                RecordListLoading: false
            };
        }),
        [GetAttendanceList.error]: merge((payload, state) => {
            return {
                GetAttendanceListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                OriRecordList: [],
                RecordListLoading: false
            };
        }),
        // CreateAttendanceData
        [CreateAttendanceData]: merge((payload, state) => {
            return {
                CreateAttendanceDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [CreateAttendanceData.success]: merge((payload, state) => {
            return {
                CreateAttendanceDataFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [CreateAttendanceData.error]: merge((payload, state) => {
            return {
                CreateAttendanceDataFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;