import merge from '../../merge';
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
// import resetUserInforList from "ACTION/Broker/xddResetList";

const STATE_NAME = 'state_ac_needDoList';

const getNeedToDoData = BrokerAction.GetNeedDoList;

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
        getNeedListFetch: {
            status: 'pending',
            response: ''
        },
        WaitList: [],
        QueryParams: {
            WaitTypelist: []
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
                WaitList: payload.Data ? addKey(payload.Data.WaitList) : payload.WaitList ? addKey(payload.WaitList) : []
            };
        }),
        [getNeedToDoData.error]: merge((payload, state) => {
            return {
                getNeedListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
        // [resetUserInforList]: merge((payload, state) => {
        //     if (payload.stateName === STATE_NAME) {
        //         return {
        //             chooseTypes: new InitialState().chooseTypes,
        //             chooseAll: true
        //         };
        //     }
        // })
    }
};
export default getNeedToDoList;