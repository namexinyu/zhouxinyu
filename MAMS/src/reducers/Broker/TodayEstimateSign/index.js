import merge from '../../merge';
import getEstimateSignData from 'ACTION/Broker/TodayEstimateSign/EstimateSign';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetUserInforList from "ACTION/Broker/xddResetList";
import {Constant} from 'UTIL/constant/index';
const STATE_NAME = 'state_today_track_estimate_sign';

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
        otherParams: {
            RecruitTmp: ""
        },
        showWindow: false,
        RecordListLoading: false,
        setPick: {},
        QueryParams: {
            PreTime: {value: [null, null]},
            UserName: {value: ''},
            UserMobile: {value: ''},
            PreCheckinRecruitID: {value: {value: null, text: ''}},
            PreCheckinAddrID: {value: ''},
            PreVisitStatus: { value: '-1'},
            IsSign: {value: '-1'},
            RecordIndex: 0,
            RecordSize: Constant.pageSize
        },
        OrderParams: {
            Key: ["UpdateTime"],
            Order: 0
        },
        record: {},
        clickActive: 0
    };
};

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
        [getEstimateSignData]: merge((payload, state) => {
            return {
                status: 'todayEstimateSign-pending',
                RecordListLoading: true
            };
        }),
        [getEstimateSignData.success]: merge((payload, state) => {
            return {
                status: 'todayEstimateSign-success',
                RecordCount: ((payload.Data || {}).PageInfo || {}).TotalCount || 0,
                UserInforList: (payload.Data || {}).RecordList || [],
                RecordListLoading: false
                // RecordCount: payload.Data.RecordCount,
                // UserInforList: payload.Data.UserInforList ? addKey(payload.Data.UserInforList) : [],
                // RecordListLoading: false
            };
        }),
        [getEstimateSignData.error]: merge((payload, state) => {
            return {
                status: 'todayEstimateSign-error',
                RecordCount: 0,
                UserInforList: [],
                RecordListLoading: false
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
