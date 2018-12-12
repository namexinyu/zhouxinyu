import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';

const {
    getCompanyCheckList,
    checkCompany,
    exportCompanyAuditList
} = ActionCompany;

const STATE_NAME = 'state_servicer_labor_company_check';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        currentCompany: '',
        noPassReason: '',
        companyBL: [],
        companyLogo: [],
        companyOther: [],
        AllAuditCount: 0,
        RejectCount: 0,
        UnAuditCount: 0,
        q_companyName: {},
        q_laborBossId: {
            value: ''
        },
        q_createTime: {},
        checkStatus: -9999,
        q_employeeId: {
            value: '-9999'
        },
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        checkPercentTag: {},
        checkCreditPoint: {},
        checkEmployee: {},
        getCompanyCheckListFetch: {
            status: 'close',
            response: ''
        },
        checkCompanyFetch: {
            status: 'close',
            response: ''
        },
        exportCompanyAuditListFetch: {
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
        [getCompanyCheckList]: merge((payload, state) => {
            return ({
                getCompanyCheckListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getCompanyCheckList.success]: merge((payload, state) => {
            return ({
                getCompanyCheckListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount,
                AllAuditCount: payload.Data.AllAuditCount,
                RejectCount: payload.Data.RejectCount,
                UnAuditCount: payload.Data.UnAuditCount
            });
        }),
        [getCompanyCheckList.error]: merge((payload, state) => {
            return ({
                getCompanyCheckListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [checkCompany]: merge((payload, state) => {
            return ({
                checkCompanyFetch: {
                    status: 'pending'
                }
            });
        }),
        [checkCompany.success]: merge((payload, state) => {
            return ({
                checkCompanyFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [checkCompany.error]: merge((payload, state) => {
            return ({
                checkCompanyFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [exportCompanyAuditList]: merge((payload, state) => {
            return ({
                exportCompanyAuditListFetch: {
                    status: 'pending'
                }
            });
        }),
        [exportCompanyAuditList.success]: merge((payload, state) => {
            return ({
                exportCompanyAuditListFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [exportCompanyAuditList.error]: merge((payload, state) => {
            return ({
                exportCompanyAuditListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

