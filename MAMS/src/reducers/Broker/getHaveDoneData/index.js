import merge from '../../merge';
import getHaveDoneData from 'ACTION/Broker/HaveDone/HaveDoneData';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetUserInforList from "ACTION/Broker/xddResetList";
import {Constant} from 'UTIL/constant/index';
const STATE_NAME = 'state_broker_have_done';

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
        RecordDone: [],
        // pageSize: 10,
        // currentPage: 1,
        QueryParams: {
            StarTime: "2013-01-01",
            EndTime: getTime(new Date()),
            UserName: "",
            Phone: "",
            WaitTypelist: [],
            RecordIndex: 0,
            RecordSize: Constant.pageSize
        },
        chooseTypes: [{
                name: "一键导航",
                chooseType: false
            },
            {
                name: "明日签到",
                chooseType: false
            },
            {
                name: "报名",
                chooseType: false
            },
            {
                name: "关注",
                chooseType: false
            },
            {
                name: "提问",
                chooseType: false
            },
            {
                name: "反馈",
                chooseType: false
            },
            {
                name: "求助",
                chooseType: false
            },
            {
                name: "提醒打卡",
                chooseType: false
            }
        ],
        chooseAll: true
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
        [getHaveDoneData]: merge((payload, state) => {
            return {
                state: "todayTrack-pending"
            };
        }),
        [getHaveDoneData.success]: merge((payload, state) => {
            return {
                state: "todayTrack-success",
                RecordCount: Number(payload.Data.RecordCount),
                RecordDone: payload.Data.RecordDone ? addKey(payload.Data.RecordDone) : []
            };
        }),
        [getHaveDoneData.error]: merge((payload, state) => {
            return {
                state: "todayTrack-error",
                response: payload
            };
        }),
        [resetUserInforList]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    QueryParams: new InitialState().QueryParams,
                    chooseTypes: new InitialState().chooseTypes,
                    chooseAll: true
                };
            }
        })
    }
};
export default getNeedToDoList;