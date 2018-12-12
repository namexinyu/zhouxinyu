import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import BoardAction from 'ACTION/Assistant/BoardAction';
import {generateAuthority} from 'CONFIG/DGAuthority';

const STATE_NAME = 'state_ac_board';

const {
    GetAllCount,
    GetBrokerDepartList
} = BoardAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        Count: {},
        Authority: {},
        DepartList: []
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};
        }),
        [GetAllCount]: merge((payload, state) => {
            return {
                GetAllCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [GetAllCount.success]: merge((payload, state) => {
            return {
                GetAllCountFetch: {
                    status: 'success',
                    response: payload
                },
                Count: payload.Data || {}
            };
        }),
        [GetAllCount.error]: merge((payload, state) => {
            return {
                GetAllCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [GetBrokerDepartList]: merge((payload, state) => {
            return {
                GetBrokerDepartListFetch: {
                    status: 'pending'
                }
            };
        }),
        [GetBrokerDepartList.success]: merge((payload, state) => {
            let list = payload.Data ? payload.Data.RecordList || [] : [];
            generateAuthority(list);
            return {
                GetBrokerDepartListFetch: {
                    status: 'success',
                    response: payload
                },
                DepartList: list
            };
        }),
        [GetBrokerDepartList.error]: merge((payload, state) => {
            return {
                GetBrokerDepartListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;