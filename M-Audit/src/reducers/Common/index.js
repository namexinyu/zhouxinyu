import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CommonAction from 'ACTION/Common';

const {
    getEmployeeList,
    getEnterpriseSimpleList,
    getCommonEnumMapping,
    getRecruitSimpleList,
    getIndustryList
} = CommonAction;

const STATE_NAME = 'state_common';

function InitialState() {
    return {
        EmployeeList: [],
        EnterpriseSimpleList: [],
        EnumMappingList: [],
        EnumCount: 0,
        RecruitSimpleList: [],
        IndustryList: []
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
        }),
        [getCommonEnumMapping]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCommonEnumMapping.success]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
                    status: 'success',
                    response: payload
                },
                EnumMappingList: payload.Data.EnmuList,
                EnumCount: payload.Data.Count
            };
        }),
        [getCommonEnumMapping.error]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
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
                RecruitSimpleList: payload.Data ? payload.Data.RecordList || [] : []
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
        [getIndustryList]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getIndustryList.success]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'success',
                    response: payload
                },
                IndustryList: payload.Data.RecordList
            };
        }),
        [getIndustryList.error]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;