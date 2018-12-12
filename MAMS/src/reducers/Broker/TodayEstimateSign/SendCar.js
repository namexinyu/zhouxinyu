import merge from '../../merge';
import getSendCarData from 'ACTION/Broker/TodayEstimateSign/SendCar';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetUserInforList from "ACTION/Broker/xddResetList";
const STATE_NAME = 'state_today_track_send_car';

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
        RecordCount: 0,
        UserInforList: [],
        // pageSize: 10,
        // currentPage: 1,
        RecordListLoading: false,
        otherParams: {
            RecruitTmp: ""
        },
        QueryParamsCar: {
            PreTime: {value: [null, null]},
            UserName: {value: ''},
            UserMobile: {value: ''},
            PickupStatus: {value: ''},
            PickupTargetAddrID: {value: ''},
            PickupStartAddr: {value: ''},
            PickupMode: {value: ''},
            RecordIndex: 0,
            RecordSize: 20
        },
        OrderParams: {
            Key: ["DispatchTime"],
            Order: 1
        },
        chooseTypes: [
            {
                name: "等待处理",
                chooseType: false
            },
            {
                name: "已处理",
                chooseType: false
            },
            {
                name: "已接到",
                chooseType: false
            },
            {
                name: "未接到",
                chooseType: false
            },
            {
                name: "已送达",
                chooseType: false
            }
        ],
        chooseAll: true
    };
};

const getSendCarList = {
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
        [getSendCarData]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                status: 'todayEstimateSign-pending'
            };
        }),
        [getSendCarData.success]: merge((payload, state) => {
            return {
                status: 'todayEstimateSign-success',
                RecordListLoading: false,
                RecordCount: payload.Data.RecordCount,
                UserInforList: payload.Data.UserInforList ? addKey(payload.Data.UserInforList) : []
            };
        }),
        [getSendCarData.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                status: 'todayEstimateSign-error'
            };
        }),
        [resetUserInforList]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    QueryParams: new InitialState().QueryParams,
                    otherParams: new InitialState().otherParams,
                    chooseTypes: new InitialState().chooseTypes,
                    chooseAll: true
                };
            }
        })
    }
};
export default getSendCarList;