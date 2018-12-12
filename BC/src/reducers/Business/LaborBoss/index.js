import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';

const {
    getLaborBossPassList,
    modifyLaborBossTeamworkStatus,
    exportLaborBossWorkList
} = LaborAction;

const STATE_NAME = 'state_servicer_labor_boss_list';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        currentEnterprise: '',
        q_laborBossName: {},
        q_laborBossMobile: {},
        q_laborBossTeamwork: {
            value: ""
        },
        q_laborBossCreateTime: {},
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        getLaborBossPassListFetch: {
            status: 'close',
            response: ''
        },
        modifyLaborBossTeamworkStatusFetch: {
            status: 'close',
            response: ''
        },
        exportLaborBossWorkListFetch: {
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
        [getLaborBossPassList]: merge((payload, state) => {
            return ({
                getLaborBossPassListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getLaborBossPassList.success]: merge((payload, state) => {
            return ({
                getLaborBossPassListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount
            });
        }),
        [getLaborBossPassList.error]: merge((payload, state) => {
            return ({
                getLaborBossPassListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [modifyLaborBossTeamworkStatus]: merge((payload, state) => {
            return ({
                modifyLaborBossTeamworkStatusFetch: {
                    status: 'pending'
                }
            });
        }),
        [modifyLaborBossTeamworkStatus.success]: merge((payload, state) => {
            return ({
                modifyLaborBossTeamworkStatusFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [modifyLaborBossTeamworkStatus.error]: merge((payload, state) => {
            return ({
                modifyLaborBossTeamworkStatusFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [exportLaborBossWorkList]: merge((payload, state) => {
            return ({
                exportLaborBossWorkListFetch: {
                    status: 'pending'
                }
            });
        }),
        [exportLaborBossWorkList.success]: merge((payload, state) => {
            return ({
                exportLaborBossWorkListFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [exportLaborBossWorkList.error]: merge((payload, state) => {
            return ({
                exportLaborBossWorkListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

