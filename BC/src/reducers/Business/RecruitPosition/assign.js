import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';

import CommonAction from 'ACTION/Business/Common';
import ActionRecruit from 'ACTION/Business/Recruit/ActionRecruit';

const {
    getRecruitSimpleList,
    getRecruitTags
} = CommonAction;
const {
    getLaborAssignList,
    exportLaborAssignList,
    setAssignDesc
} = ActionRecruit;

const STATE_NAME = 'state_business_recruit_assign';

function InitialState() {
    return {
        queryParams: {
            Date: {value: moment()},
            Recruit: {},
            Labor: {},
            HasLaborOrderFee: {value: '0'},
            HasLaborOrderSubsidy: {value: '0'}
        },
        recruitType: '',
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            // Order: false
        },
        RecordList: [],
        RecordLists: [],
        RecordListLoading: false,
        RecordCount: 0,
        TypeACount: 0,
        TypeBCount: 0,
        TypeCCount: 0,

        getLaborAssignListFetch: {
            status: 'close',
            response: ''
        },
        setAssignDescFetch: {
            status: 'close',
            response: ''
        },
        exportLaborAssignListFetch: {
            status: 'close',
            response: ''
        },

        AssignModalItem: {
            AssignDesc: {}
        }

    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                return {queryParams: init.queryParams};
            }
            return {};
        }),
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let initState = new InitialState();
                if (payload.fieldName) {
                    return {[payload.fieldName]: initState[payload.fieldName]};
                }
                return initState;
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
        [getLaborAssignList]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborAssignList.success]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                TypeACount: payload.Data.TypeACount || 0,
                TypeBCount: payload.Data.TypeBCount || 0,
                TypeCCount: payload.Data.TypeCCount || 0,
                RecordListLoading: false
            };
        }),
        [getLaborAssignList.error]: merge((payload, state) => {
            return {
                getLaborAssignListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [setAssignDesc]: merge((payload, state) => {
            return {
                setAssignDescFetch: {
                    status: 'pending'
                }
            };
        }),
        [setAssignDesc.success]: merge((payload, state) => {
            return {
                setAssignDescFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setAssignDesc.error]: merge((payload, state) => {
            return {
                setAssignDescFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [exportLaborAssignList]: merge((payload, state) => {
            return {
                exportLaborAssignListFetch: {
                    status: 'pending'
                }
            };
        }),
        [exportLaborAssignList.success]: merge((payload, state) => {
            return {
                exportLaborAssignListFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [exportLaborAssignList.error]: merge((payload, state) => {
            return {
                exportLaborAssignListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;