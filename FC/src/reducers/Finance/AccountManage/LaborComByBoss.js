import merge from '../../merge';
import getLaborComByBoss from 'ACTION/Finance/AccountManage/LaborComByBoss';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_fc_laborComByBoss';

function InitialState() {
    return {
        getLaborComByBossFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLabor: []
    };
}

const getLaborComByBossList = {
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
        [getLaborComByBoss]: merge((payload, state) => {
            return {
                getLaborComByBossFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborComByBoss.success]: merge((payload, state) => {
            return {
                getLaborComByBossFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLabor: payload.Data.RecordList ? payload.Data.RecordList : []
            };
        }),
        [getLaborComByBoss.error]: merge((payload, state) => {
            return {
                getLaborComByBossFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getLaborComByBossList;