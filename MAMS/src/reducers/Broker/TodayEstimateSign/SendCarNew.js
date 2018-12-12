import merge from '../../merge';
import getSendCarData from 'ACTION/Broker/TodayEstimateSign/SendCar';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import {Constant} from 'UTIL/constant/index';

const STATE_NAME = 'state_today_track_send_car_new';

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
        state_name: STATE_NAME,
        queryParams: undefined,
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: Constant.pageSize
        },
        orderParams: 1,
        RecordList: [],
        RecordCount: 0,
        NotDealNum: 0,
        RecordListLoading: false
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                return {queryParams: init.queryParams};
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
                RecordList: payload.Data.RecordList ? addKey(payload.Data.RecordList) : []
            };
        }),
        [getSendCarData.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                status: 'todayEstimateSign-error'
            };
        })
    }
};
export default getSendCarList;