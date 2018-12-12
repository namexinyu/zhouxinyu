import merge from '../../merge';
import getSignData from 'ACTION/Broker/TodaySign/Sign';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetUserInforList from "ACTION/Broker/xddResetList";
import {Constant} from 'UTIL/constant/index';
const STATE_NAME = 'state_today_sign';

function getTime(time) {
    return time.getFullYear() + "-" + changeNumStyle(+time.getMonth() + 1) + "-" + changeNumStyle(time.getDate());
}
function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}
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
        pageSize: Constant.pageSize,
        currentPage: 1,
        RecordListLoading: false,
        otherParams: {
            RecruitTmp: ""
        },
        OrderParams: {
            Key: ["CheckinTime"],
            Order: 1
        },
        QueryParams: {
            Time: {value: [null, null]},
            UserName: {value: ''},
            UserMobile: {value: ''},
            CheckinRecruitID: {value: {value: null, text: ''}},
            CheckinHubID: {value: ''},
            RecordIndex: 0,
            RecordSize: 20,
            CheckinCloseStatus: {value: ''}
        },
        chooseTypes: [
            {
                name: "已签到未面试",
                chooseType: false
            },
            {
                name: "已去面试",
                chooseType: false
            },
            {
                name: "未面试",
                chooseType: false
            }
        ],
        chooseAll: true
    };
}

const getEstimateSignList = {
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
        [getSignData]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                status: 'todaySign-pending'
            };
        }),
        [getSignData.success]: merge((payload, state) => {
            return {
                status: 'todaySign-success',
                RecordListLoading: false,
                RecordCount: payload.Data.RecordCount,
                UserInforList: payload.Data.UserInforList ? addKey(payload.Data.UserInforList) : []
            };
        }),
        [getSignData.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                status: 'todaySign-error'
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
export default getEstimateSignList;