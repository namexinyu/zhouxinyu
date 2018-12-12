import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';

const {
    createCompanyInfo,
    getLaborBossContactInfo
} = ActionCompany;

const STATE_NAME = 'state_servicer_labor_company_create';

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
        createCompanyInfoFetch: {
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
        [createCompanyInfo]: merge((payload, state) => {
            return ({
                createCompanyInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [createCompanyInfo.success]: merge((payload, state) => {
            return ({
                createCompanyInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [createCompanyInfo.error]: merge((payload, state) => {
            return ({
                createCompanyInfoFetch: {
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

