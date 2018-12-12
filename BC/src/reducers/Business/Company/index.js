import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';

const {
    getCompanyList,
    modifyCompanyTeamworkStatus,
    exportCompanyList
} = ActionCompany;

const STATE_NAME = 'state_servicer_labor_company_list';

function InitialState() {
    return {
        AuditCount: 0,
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        currentEnterprise: '',
        q_companyName: {},
        q_laborBossId: {
            value: ''
        },
        q_areaCode: {},
        q_createTime: {},
        q_accountStatus: {
            value: '-9999'
        },
        q_cooperStatus: {
            value: '-9999'
        },
        q_employeeId: {
            value: '-9999'
        },
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        getCompanyListFetch: {
            status: 'close',
            response: ''
        },
        modifyCompanyTeamworkStatusFetch: {
            status: 'close',
            response: ''
        },
        exportCompanyListFetch: {
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
                let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
                return temp;
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
        [getCompanyList]: merge((payload, state) => {
            return ({
                getCompanyListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getCompanyList.success]: merge((payload, state) => {
            return ({
                getCompanyListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount,
                AuditCount: payload.Data.AuditCount
            });
        }),
        [getCompanyList.error]: merge((payload, state) => {
            return ({
                getCompanyListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [modifyCompanyTeamworkStatus]: merge((payload, state) => {
            return ({
                modifyCompanyTeamworkStatusFetch: {
                    status: 'pending'
                }
            });
        }),
        [modifyCompanyTeamworkStatus.success]: merge((payload, state) => {
            return ({
                modifyCompanyTeamworkStatusFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [modifyCompanyTeamworkStatus.error]: merge((payload, state) => {
            return ({
                modifyCompanyTeamworkStatusFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [exportCompanyList]: merge((payload, state) => {
            return ({
                exportCompanyListFetch: {
                    status: 'pending'
                }
            });
        }),
        [exportCompanyList.success]: merge((payload, state) => {
            return ({
                exportCompanyListFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [exportCompanyList.error]: merge((payload, state) => {
            return ({
                exportCompanyListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

