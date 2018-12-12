import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';

const {
    editCompanyInfo,
    getCompanyDetail,
    getCheckCompanyDetail,
    editCheckCompanyInfo,
    getCompanyAccountInfo,
    getLaborBossContactInfo
} = ActionCompany;

const STATE_NAME = 'state_servicer_labor_company_edit';

function InitialState() {
    return {
        companyShortName: {},
        companyName: {},
        laborBossId: {},
        contactName: {},
        contactMobile: {},
        percentTag: {},
        defaultCreditPoint: {},
        email: {},
        areaCode: {},
        address: {},
        cooperStatus: {},
        companyBL: [],
        companyLogo: [],
        companyOther: [],
        useLaborBossContactCheck: false,
        static_defaultCreditPoint: '',
        static_accountAmount: '',
        static_accountDisableAmount: '',
        static_accountEnableAmount: '',
        static_accountStatus: '',
        companyAccountInfo: '',
        editCompanyInfoFetch: {
            status: 'close',
            response: ''
        },
        getCompanyDetailFetch: {
            status: 'close',
            response: ''
        },
        getCheckCompanyDetailFetch: {
            status: 'close',
            response: ''
        },
        editCheckCompanyInfoFetch: {
            status: 'close',
            response: ''
        },
        getCompanyAccountInfoFetch: {
            status: 'close',
            response: ''
        },
        getLaborBossContactInfoFetch: {
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
        [editCompanyInfo]: merge((payload, state) => {
            return ({
                editCompanyInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [editCompanyInfo.success]: merge((payload, state) => {
            return ({
                editCompanyInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [editCompanyInfo.error]: merge((payload, state) => {
            return ({
                editCompanyInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [getCompanyDetail]: merge((payload, state) => {
            return ({
                getCompanyDetailFetch: {
                    status: 'pending'
                }
            });
        }),
        [getCompanyDetail.success]: merge((payload, state) => {
            return ({
                getCompanyDetailFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [getCompanyDetail.error]: merge((payload, state) => {
            return ({
                getCompanyDetailFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [getCheckCompanyDetail]: merge((payload, state) => {
            return ({
                getCheckCompanyDetailFetch: {
                    status: 'pending'
                }
            });
        }),
        [getCheckCompanyDetail.success]: merge((payload, state) => {
            return ({
                getCheckCompanyDetailFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [getCheckCompanyDetail.error]: merge((payload, state) => {
            return ({
                getCheckCompanyDetailFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [editCheckCompanyInfo]: merge((payload, state) => {
            return ({
                editCheckCompanyInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [editCheckCompanyInfo.success]: merge((payload, state) => {
            return ({
                editCheckCompanyInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [editCheckCompanyInfo.error]: merge((payload, state) => {
            return ({
                editCheckCompanyInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [getCompanyAccountInfo]: merge((payload, state) => {
            return ({
                getCompanyAccountInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [getCompanyAccountInfo.success]: merge((payload, state) => {
            return ({
                getCompanyAccountInfoFetch: {
                    status: 'success',
                    response: payload
                },
                companyAccountInfo: payload.Data
            });
        }),
        [getCompanyAccountInfo.error]: merge((payload, state) => {
            return ({
                getCompanyAccountInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [getLaborBossContactInfo]: merge((payload, state) => {
            return ({
                getLaborBossContactInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [getLaborBossContactInfo.success]: merge((payload, state) => {
            return ({
                getLaborBossContactInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [getLaborBossContactInfo.error]: merge((payload, state) => {
            return ({
                getLaborBossContactInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

