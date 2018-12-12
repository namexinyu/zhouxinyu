import merge from '../../merge';
import HubListInfoData from 'ACTION/Broker/HubListInfo/HubListInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_hub_list';

const initialState = {
    HubList: {},
    HubSimpleList: []
};

const getHubListList = {
    initialState: initialState,
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return initialState;
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
        [HubListInfoData]: merge((payload, state) => {
            return {
                status: 'hubList-pending'
            };
        }),
        [HubListInfoData.success]: merge((payload, state) => {
            return {
                status: 'hubList-success',
                HubList: payload,
                HubSimpleList: payload.Data && payload.Data.HubList ? [{
                    HubID: 9999,
                    HubName: '需要问路'
                }].concat(payload.Data.HubList) : []
            };
        }),
        [HubListInfoData.error]: merge((payload, state) => {
            return {
                status: 'hubList-error'
            };
        })
    }
};
export default getHubListList;