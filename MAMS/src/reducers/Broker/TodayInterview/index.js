import merge from '../../merge';
import getInterviewData from 'ACTION/Broker/TodayInterview/Interview';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetUserInforList from "ACTION/Broker/xddResetList";
import {Constant} from 'UTIL/constant/index';
const STATE_NAME = 'state_today_Interview';
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
        RecordList: [],
        pageSize: Constant.pageSize,
        currentPage: 1,
        otherParams: {
            RecruitTmp: ""
        },
        OrderParams: [{
            Key: 'CheckinDate',
            Order: 1
        }],
        RecordListLoading: false,
        QueryParams: {
            Time: {value: [null, null]},
            InterviewStatus: {value: ""},
            BrokerInterviewStatus: {value: ""},
            CheckinRecruitID: {value: {value: null, text: ''}},
            CountdownStatus: {value: ""},
            JFFInterviewStatus: {value: ""},
            UserMobile: {value: ""},
            UserName: {value: ""},
            WorkCardStatus: {value: ""},
            ZxxType: {
                value: []
            },
            RecordIndex: 0,
            RecordSize: Constant.pageSize
        }

    };
}

const getInterviewList = {
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
        [getInterviewData]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                status: 'todayInterview-pending'
            };
        }),
        [getInterviewData.success]: merge((payload, state) => {
            return {
                status: 'todayInterview-success',
                RecordListLoading: false,
                RecordCount: payload.Data.RecordCount,
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getInterviewData.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                status: 'todayInterview-error'
            };
        }),
        [resetUserInforList]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    QueryParams: new InitialState().QueryParams,
                    otherParams: new InitialState().otherParams
                };
            }
        })
    }
};
export default getInterviewList;