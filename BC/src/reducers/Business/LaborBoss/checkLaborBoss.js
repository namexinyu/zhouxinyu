import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';

const {
    getLaborBossCheckList,
    checkLaborBoss
} = LaborAction;

const STATE_NAME = 'state_servicer_labor_boss_check';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        RejectCount: 0,
        AuditCount: 0,
        currentLaborBoss: '',
        laborBossStatus: 0,
        laborBossIdCardPositive: [],
        laborBossIdCardOpposite: [],
        noPassReason: '',
        q_laborBossName: {},
        q_laborBossMobile: {},
        q_laborBossCreateTime: {},
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        getLaborBossCheckListFetch: {
            status: 'close',
            response: ''
        },
        checkLaborBossFetch: {
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
        [getLaborBossCheckList]: merge((payload, state) => {
            return ({
                getLaborBossCheckList: {
                    status: 'pending'
                }
            });
        }),
        [getLaborBossCheckList.success]: merge((payload, state) => {
            return ({
                getLaborBossCheckList: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount,
                RejectCount: payload.Data.RejectCount,
                AuditCount: payload.Data.AuditCount
            });
        }),
        [getLaborBossCheckList.error]: merge((payload, state) => {
            return ({
                getLaborBossCheckList: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [checkLaborBoss]: merge((payload, state) => {
            return ({
                checkLaborBossFetch: {
                    status: 'pending'
                }
            });
        }),
        [checkLaborBoss.success]: merge((payload, state) => {
            return ({
                checkLaborBossFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [checkLaborBoss.error]: merge((payload, state) => {
            return ({
                checkLaborBossFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

