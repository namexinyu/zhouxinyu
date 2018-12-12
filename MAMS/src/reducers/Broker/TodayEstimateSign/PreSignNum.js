import merge from '../../merge';
import getPreSignNumData from 'ACTION/Broker/TodayEstimateSign/PreSignNum';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_today_track_pre_signNum';

function InitialState() {
    return {
        TodayNum: 0,
        TomorrowNum: 0
    };
};

const getPreSignNum = {
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
        [getPreSignNumData]: merge((payload, state) => {
            return {
                status: 'PreSignNum-pending'
            };
        }),
        [getPreSignNumData.success]: merge((payload, state) => {
            return {
                status: 'PreSignNum-success',
                TodayNum: payload.Data.TodayNum,
                TomorrowNum: payload.Data.TomorrowNum
            };
        }),
        [getPreSignNumData.error]: merge((payload, state) => {
            return {
                status: 'PreSignNum-error'
            };
        })
    }
};
export default getPreSignNum;