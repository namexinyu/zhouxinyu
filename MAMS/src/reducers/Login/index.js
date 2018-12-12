import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import doLogin from 'ACTION/Login/doLogin';
import sendLoginVerifyCode from 'ACTION/Login/sendLoginVerifyCode';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const STATE_NAME = 'state_login';

function InitialState() {
    return {
        AccountName: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName') || '',
        VerifyCode: '',
        Mobile: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('mobile') || '',
        doLoginFetch: {
            status: 'close',
            response: ''
        },
        sendLoginVerifyCodeFetch: {
            status: 'close',
            response: ''
        },
        Role: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role') || '',
        LoginId: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId') || ''
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
        [doLogin]: merge((payload, state) => {
            return {
                doLoginFetch: {
                    status: 'pending'
                }
            };
        }),
        [doLogin.success]: merge((payload, state) => {
            return {
                doLoginFetch: {
                    status: 'success',
                    response: payload
                },
                Role: payload.Data.BrokerAuthority,
                LoginId: payload.Data.BrokerID
            };
        }),
        [doLogin.error]: merge((payload, state) => {
            return {
                doLoginFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [sendLoginVerifyCode]: merge((payload, state) => {
            return {
                sendLoginVerifyCodeFetch: {
                    status: 'pending'
                }
            };
        }),
        [sendLoginVerifyCode.success]: merge((payload, state) => {
            return {
                sendLoginVerifyCodeFetch: {
                    status: 'success',
                    response: payload
                },
                Mobile: payload.Data.Mobile
            };
        }),
        [sendLoginVerifyCode.error]: merge((payload, state) => {
            return {
                sendLoginVerifyCodeFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;