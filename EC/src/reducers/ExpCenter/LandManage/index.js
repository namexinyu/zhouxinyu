import merge from '../../merge';
import getLandManage from 'ACTION/ExpCenter/LandManage';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_land_manage';
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
        RecordListLoading: false,
        getLandManageFetch: {
            status: 'pending',
            response: ''
        },
        QueryParams: {
            HubID: 0,
            IDCardNum: '',
            Mobile: '',
            Name: '',
            ReceAccountName: ''
        },
        RecordCount: 0,
        RecordList: [],
        showModel: false,
        showModel2: false,
        record: null
    };
}

const getLandManageList = {
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
        [getLandManage]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getLandManageFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLandManage.success]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getLandManageFetch: {
                    status: 'success',
                    response: payload
                },
                RecordCount: payload.Data.RecordCount,
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getLandManage.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getLandManageFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getLandManageList;