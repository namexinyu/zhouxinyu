import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import TodaySignAction from 'ACTION/Business/TodaySign';

const {
    getReportList,
    getStatisticInfo
} = TodaySignAction;

const STATE_NAME = 'state_business_todaySign';

function InitialState() {
    return {
        q_Date: {value: moment()},
        q_Recruit: {},
        q_RecruitType: {value: '-9999'},

        pageParam: {
            currentPage: 1,
            pageSize: 2
        },

        RecordList: [],
        RecordCount: 0,

        getReportListFetch: {
            status: 'close',
            response: ''
        },
        LaborCount: 0,
        RecruitCount: 0,
        SignInCount: 0,
        getStatisticInfoFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
                // return init.queryParams;
            }
            return {};
        }),
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
        [getReportList]: merge((payload, state) => {
            return {
                getReportListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getReportList.success]: merge((payload, state) => {
            return {
                getReportListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount
            };
        }),
        [getReportList.error]: merge((payload, state) => {
            return {
                getReportListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getStatisticInfo]: merge((payload, state) => {
            return {
                getStatisticInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getStatisticInfo.success]: merge((payload, state) => {
            return {
                getStatisticInfoFetch: {
                    status: 'success',
                    response: payload
                },
                LaborCount: payload.Data.LaborCount,
                RecruitCount: payload.Data.RecruitCount,
                SignInCount: payload.Data.SignInCount
            };
        }),
        [getStatisticInfo.error]: merge((payload, state) => {
            return {
                getStatisticInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;