import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import editHubInfo from 'ACTION/ExpCenter/Hub/editHubInfo';

const STATE_NAME = 'state_ec_hubAddressDetail';

function InitialState() {
    return {
        state_name: STATE_NAME,
        HubID: undefined, // 拓展字段，用于日后新增及修改同页面
        HubData: undefined,
        HubDataOri: undefined,
        HubDataList: [], // 拓展字段，用于日后允许打开多个详情页
        AdminTmp: undefined,
        editHubInfoFetch: {
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [editHubInfo]: merge((payload, state) => {
            return {
                editHubInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [editHubInfo.success]: merge((payload, state) => {
            return {
                editHubInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [editHubInfo.error]: merge((payload, state) => {
            return {
                editHubInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;