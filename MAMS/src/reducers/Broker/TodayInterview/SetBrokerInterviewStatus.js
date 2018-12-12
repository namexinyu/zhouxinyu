import merge from '../../merge';
import setBrokerInterviewStatus from 'ACTION/Broker/TodayInterview/SetBrokerInterviewStatus';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_broker_interview_status';
function InitialState() {
    return {
        setBrokerInterviewStatusFetch: {
            status: 'pending',
            response: ''
        }
    };
}

const setBrokerInterviewStatusList = {
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
        [setBrokerInterviewStatus]: merge((payload, state) => {
            return {
                setBrokerInterviewStatusFetch: {
                    status: 'pending'
                }
            };
        }),
        [setBrokerInterviewStatus.success]: merge((payload, state) => {
            return {
                setBrokerInterviewStatusFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setBrokerInterviewStatus.error]: merge((payload, state) => {
            return {
                setBrokerInterviewStatusFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default setBrokerInterviewStatusList;