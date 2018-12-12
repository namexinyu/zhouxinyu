import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AccountInformation from 'ACTION/Business/Header/AccountInformation';
import BusinessCommon from 'ACTION/Business/Common/index';

const {getAccountInformation} = AccountInformation;
const { getEventMessage } = BusinessCommon;

const STATE_NAME = 'state_business_header_accountInfo';

function InitialState() {
    return {
        DepName: '', // 所在部门
        getAccountInformationFetch: {
            status: 'close',
            response: ''
        },
        getEventMessageFetch: {
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
        [getAccountInformation]: merge((payload, state) => {
            return {
                getAccountInformationFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAccountInformation.success]: merge((payload, state) => {
            return {
                getAccountInformationFetch: {
                    status: 'success',
                    response: payload
                },
                ...payload.Data
            };
        }),
        [getAccountInformation.error]: merge((payload, state) => {
            return {
                getAccountInformationFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取事件回复消息
        [getEventMessage]: merge((payload, state) => {
            return {
                getEventMessageFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getEventMessage.success]: merge((payload, state) => {
            return {
                getEventMessageFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getEventMessage.error]: merge((payload, state) => {
            return {
                getEventMessageFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;