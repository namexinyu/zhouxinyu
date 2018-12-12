import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CommonAction from 'ACTION/Finance/Common';

const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getEmployeeList,
    getEnterpriseSimpleList,
    getHubList
} = CommonAction;

const STATE_NAME = 'state_finance_common';

function InitialState() {
    return {
        RecruitSimpleList: [],
        LaborBossSimpleList: [],
        LaborSimpleList: [],
        EmployeeList: [],
        EnterpriseSimpleList: [],
        HubList: []
    };
}

const Reducer = {
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
        [getLaborBossSimpleList]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborBossSimpleList.success]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                LaborBossSimpleList: payload.Data.RecordList
            };
        }),
        [getLaborBossSimpleList.error]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getRecruitSimpleList]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitSimpleList.success]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecruitSimpleList: payload.Data.RecordList
            };
        }),
        [getRecruitSimpleList.error]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getLaborSimpleList]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborSimpleList.success]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                LaborSimpleList: payload.Data.RecordList
            };
        }),
        [getLaborSimpleList.error]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEmployeeList]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEmployeeList.success]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'success',
                    response: payload
                },
                EmployeeList: payload.Data.RecordList
            };
        }),
        [getEmployeeList.error]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getHubList]: merge((payload, state) => {
            return {
                getHubListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getHubList.success]: merge((payload, state) => {
            return {
                getHubListFetch: {
                    status: 'success',
                    response: payload
                },
                HubList: payload.Data.HubList || []
            };
        }),
        [getHubList.error]: merge((payload, state) => {
            return {
                getHubListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEnterpriseSimpleList]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEnterpriseSimpleList.success]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                EnterpriseSimpleList: payload.Data.RecordList
            };
        }),
        [getEnterpriseSimpleList.error]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;