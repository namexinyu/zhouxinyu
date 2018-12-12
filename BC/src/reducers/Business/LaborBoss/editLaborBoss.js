import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';

const {
    editLaborBossInfo,
    getLaborBossCompanyList
} = LaborAction;

const STATE_NAME = 'state_servicer_labor_boss_edit';

function InitialState() {
    return {
        cooperStatus: {},
        laborBossName: {},
        laborBossMobile: {},
        laborBossIdCard: {},
        companyList: [],
        laborBossIdCardPositive: [],
        laborBossIdCardOpposite: [],
        getLaborBossCompanyListFetch: {
            status: 'pending',
            response: ''
        },
        editLaborBossInfoFetch: {
            status: 'pending',
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
        [getLaborBossCompanyList]: merge((payload, state) => {
            return ({
                getLaborBossCompanyListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getLaborBossCompanyList.success]: merge((payload, state) => {
            return ({
                getLaborBossCompanyListFetch: {
                    status: 'success',
                    response: payload
                },
                companyList: payload.Data.RecordList
            });
        }),
        [getLaborBossCompanyList.error]: merge((payload, state) => {
            return ({
                getLaborBossCompanyListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [editLaborBossInfo]: merge((payload, state) => {
            return ({
                editLaborBossInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [editLaborBossInfo.success]: merge((payload, state) => {
            return ({
                editLaborBossInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [editLaborBossInfo.error]: merge((payload, state) => {
            return ({
                editLaborBossInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

