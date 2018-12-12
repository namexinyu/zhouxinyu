import merge from '../../merge';
import getTodayTrackData from 'ACTION/Broker/WorkBoard/getTodayTrack';
import getTodayTrackSignData from 'ACTION/Broker/WorkBoard/getTodayTrackSign';
import getWeekData from 'ACTION/Broker/WorkBoard/getWeekData';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import {Constant} from 'UTIL/constant/index';
const STATE_NAME = 'state_broker_workBoard_list';

function InitialState() {
    return {
        todayTrack: {},
        todayTrackSign: {},
        weekData: {}
    };
}

const getTodayTrackList = {
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
        [getTodayTrackData]: merge((payload, state) => {
            return {state: "todayTrack-pending"};
        }),
        [getTodayTrackData.success]: merge((payload, state) => {
            return {
                state: "todayTrack-success",
                todayTrack: payload
            };
        }),
        [getTodayTrackData.error]: merge((payload, state) => {
            return {state: "todayTrack-error", response: payload};
        }),
        [getTodayTrackSignData]: merge((payload, state) => {
            return {state: "todayTrackSign-pending"};
        }),
        [getTodayTrackSignData.success]: merge((payload, state) => {
            return {
                state: "todayTrackSign-success",
                todayTrackSign: payload
            };
        }),
        [getTodayTrackSignData.error]: merge((payload, state) => {
            return {state: "todayTrackSign-error", response: payload};
        }),
        [getWeekData]: merge((payload, state) => {
            return {state: "weekData-pending"};
        }),
        [getWeekData.success]: merge((payload, state) => {
            return {
                state: "weekData-success",
                weekData: payload
            };
        }),
        [getWeekData.error]: merge((payload, state) => {
            return {state: "weekData-error", response: payload};
        })
    }
};
export default getTodayTrackList;