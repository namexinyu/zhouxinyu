import merge from '../merge';
import getSevenDayInfo from 'ACTION/WorkBoard/getSevenDayInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_sevenDayInfo';
function getDate(index) {
    var date = new Date(); // 当前日期
    var newDate = new Date();
    newDate.setDate(date.getDate() + index);// 官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
    var time = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
    return time.slice(5);
}
function addTime(arr) {
    let setArr = arr;
    for (let i = 0; i < setArr.length; i++) {
        setArr[i].name = getDate(i - setArr.length);
    }
    return setArr;
}
function InitialState() {
    return {
        getSevenDayInfoFetch: {
            status: 'pending',
            response: ''
        },
        SevenDayList: []
    };
}

const getSevenDayInfoList = {
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
        [getSevenDayInfo]: merge((payload, state) => {
            return {
                getSevenDayInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSevenDayInfo.success]: merge((payload, state) => {
            return {
                getSevenDayInfoFetch: {
                    status: 'success',
                    response: payload
                },
                SevenDayList: payload.Data.SevenDayList ? addTime(payload.Data.SevenDayList.reverse()) : []
            };
        }),
        [getSevenDayInfo.error]: merge((payload, state) => {
            return {
                getSevenDayInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getSevenDayInfoList;