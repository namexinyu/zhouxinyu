import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';

const {
    createLaborBossInfo
} = LaborAction;

const STATE_NAME = 'state_servicer_labor_boss_create';

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
        createLaborBossInfoFetch: {
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
        [createLaborBossInfo]: merge((payload, state) => {
            return ({
                createLaborBossInfoFetch: {
                    status: 'pending'
                }
            });
        }),
        [createLaborBossInfo.success]: merge((payload, state) => {
            return ({
                createLaborBossInfoFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [createLaborBossInfo.error]: merge((payload, state) => {
            return ({
                createLaborBossInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

