import merge from '../../merge';
import getNeedToDoData from 'ACTION/Broker/NeedToDo/NeedToDoData';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import alreadyInfoList from "ACTION/Broker/NeedToDo/NeedAready";
import getPouredResouceList from "ACTION/Broker/NeedToDo/getPouredResource";
import {Constant} from 'UTIL/constant/index';
import moment from 'moment';
import { format } from 'util';
const STATE_NAME = 'state_need_to_do_data';
function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = i.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}

function InitialState() {
    return {
        StarTime: moment(new Date(new Date().getTime() - 7776000000)).format('YYYY-MM-DD'),
        EndTime: moment(new Date()).format('YYYY-MM-DD'),
        Phone: '',
        RecordIndex: 0,
        RecordSize: 20,
        totalSizes: 0,
        UserName: '',
        WaitTypelist: null,
        currentPages: 1,
        pageSizes: 20,
        getNeedListFetch: {
            status: 'pending',
            response: ''
        },
        totalSize: 0,
        pageSize: 20,
        currentPage: 1,
        getNeedToDoData: [],
        alreadyInfoListFetch: {
            status: 'pending',
            response: ''
        },
        alreadyInfoList: [],
        alreadyInfoRecordCount: 0,
        donePageQueryParams: {
            CreatedTime: {
                value: [moment(new Date(new Date().getTime() - 7776000000)), moment()]
            },
            Name: {
                value: ''
            },
            Mobile: {
                value: ''
            },
            RecordIndex: 0,
            RecordSize: 20
        },
        getPouredResouceListFetch: {
            status: 'pending',
            response: ''
        },
        pouredResourceList: [],
        pouredResourceRecordCount: 0,
        pouredPageQueryParams: {
            RecordIndex: 0,
            RecordSize: 20
        }
    };
}

const getNeedToDoList = {
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
        [getNeedToDoData]: merge((payload, state) => {
            return {
                getNeedListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getNeedToDoData.success]: merge((payload, state) => {
            return {
                getNeedListFetch: {
                    status: 'success',
                    response: payload
                },
                getNeedToDoData: payload.Data ? addKey(payload.Data.RecordList) : [],
                totalSize: payload.Data.RecordCount ? payload.Data.RecordCount : 0
            };
        }),
        [getNeedToDoData.error]: merge((payload, state) => {
            return {
                getNeedListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [alreadyInfoList]: merge((payload, state) => {
            return {
                alreadyInfoListFetch: {
                    status: 'pending'
                }
            };
        }),
        [alreadyInfoList.success]: merge((payload, state) => {
            return {
                alreadyInfoListFetch: {
                    status: 'success',  
                    response: payload
                },
                alreadyInfoList: (payload.Data || {}).RecordDone || [],
                alreadyInfoRecordCount: +((payload.Data || {}).RecordCount || 0)
            };
        }),
        [alreadyInfoList.error]: merge((payload, state) => {
            return {
                alreadyInfoListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getPouredResouceList]: merge((payload, state) => {
            return {
                getPouredResouceListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPouredResouceList.success]: merge((payload, state) => {
            return {
                getPouredResouceListFetch: {
                    status: 'success',  
                    response: payload
                },
                pouredResourceList: (payload.Data || {}).RecordList || [],
                pouredResourceRecordCount: +((payload.Data || {}).RecordCount || 0)
            };
        }),
        [getPouredResouceList.error]: merge((payload, state) => {
            return {
                getPouredResouceListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getNeedToDoList;