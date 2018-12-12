import merge from '../../merge';
import getRecruitBasicData from 'ACTION/Broker/BagList/RecruitBasic';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_broker_recruit_basic';

function InitialState() {
    return {
        getRecruitBasicFetch: {
            status: 'pending',
            response: ''
        },
        DayDealCnt: 0,
        TodayEnrolCnt: 0,
        TommrowEnrolCnt: 0
    };
}

const getRecruitBasicList = {
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
        [getRecruitBasicData]: merge((payload, state) => {
            return {
                getRecruitBasicFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitBasicData.success]: merge((payload, state) => {
            return {
                getRecruitBasicFetch: {
                    status: 'success',
                    response: payload
                },
                DayDealCnt: payload.Data.DayDealCnt,
                TodayEnrolCnt: payload.Data.TodayEnrolCnt,
                TommrowEnrolCnt: payload.Data.TommrowEnrolCnt
            };
        }),
        [getRecruitBasicData.error]: merge((payload, state) => {
            return {
                getRecruitBasicFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getRecruitBasicList;