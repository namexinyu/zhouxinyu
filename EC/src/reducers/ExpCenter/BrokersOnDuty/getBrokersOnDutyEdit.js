import merge from '../../merge';
import getBrokersOnDutyEdit from 'ACTION/ExpCenter/BrokersOnDuty/getBrokersOnDutyEdit';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_brokersOnDutyEdit';

function InitialState() {
    return {
        getBrokersOnDutyEditFetch: {
            status: 'pending',
            response: ''
        },
        EffectedRows: 0
    };
}

const getBrokersOnDutyEditList = {
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
        [getBrokersOnDutyEdit]: merge((payload, state) => {
            return {
                getBrokersOnDutyEditFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBrokersOnDutyEdit.success]: merge((payload, state) => {
            return {
                getBrokersOnDutyEditFetch: {
                    status: 'success',
                    response: payload
                },
                EffectedRows: payload.Data.EffectedRows
            };
        }),
        [getBrokersOnDutyEdit.error]: merge((payload, state) => {
            return {
                getBrokersOnDutyEditFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getBrokersOnDutyEditList;