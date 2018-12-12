import merge from '../merge';
import getUserInfo from 'ACTION/Header/getUserInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_headerInfoList';

function InitialState() {
    return {
        getUserInfoFetch: {
            status: 'pending',
            response: ''
        },
        LoginEnglishName: "",
        PicPath: ""
    };
}

const getHeaderInfoList = {
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
        [getUserInfo]: merge((payload, state) => {
            return {
                getUserInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getUserInfo.success]: merge((payload, state) => {
            return {
                getUserInfoFetch: {
                    status: 'success',
                    response: payload
                },
                LoginEnglishName: payload.Data.LoginEnglishName,
                PicPath: payload.Data.PicPath
            };
        }),
        [getUserInfo.error]: merge((payload, state) => {
            return {
                getUserInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getHeaderInfoList;