import merge from '../../merge';
import getDeletePreSignData from 'ACTION/Broker/DeletePreSign';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_broker_delete_preSign';
function InitialState() {
    return {
        getDeletePreSignFetch: {
            status: 'pending',
            response: ''
        }
    };
}

const getDeletePreSignList = {
    initialState: new InitialState(),
    reducers: {
        [setFetchStatus]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
                state[payload.fetchName].status = payload.status;
                return state;
            }
            return {};
        }),
        [getDeletePreSignData]: merge((payload, state) => {
            return {
                getDeletePreSignFetch: {
                    status: 'pending'
                }
            };
        }),
        [getDeletePreSignData.success]: merge((payload, state) => {
            return {
                getDeletePreSignFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getDeletePreSignData.error]: merge((payload, state) => {
            return {
                getDeletePreSignFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getDeletePreSignList;