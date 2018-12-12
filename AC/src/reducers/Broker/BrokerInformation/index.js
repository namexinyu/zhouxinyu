import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getBrokerName from 'ACTION/Broker/Header/getBrokerName';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const STATE_NAME = 'state_broker_information';

function InitialState() {
    return {
        BrokerId: '',
        AvatarPath: '',
        NickName: '',
        TeamName: '',
        WorkStatus: 1,
        Likes: 0,
        getBrokerNameFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
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
        [getBrokerName]: merge((payload, state) => {
            return {
                getBrokerNameFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBrokerName.success]: merge((payload, state) => {
            return {
                getBrokerNameFetch: {
                    status: 'success',
                    response: payload
                },
                NickName: payload.Data.NickName,
                AvatarPath: payload.Data.AvatarPath,
                BrokerId: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId') || ''
            };
        }),
        [getBrokerName.error]: merge((payload, state) => {
            return {
                getBrokerNameFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;