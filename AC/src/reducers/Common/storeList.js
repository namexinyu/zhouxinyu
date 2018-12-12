import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getStoreList from 'ACTION/Common/getStoreList';

const STATE_NAME = 'state_common_store_list';

function InitialState() {
    return {
        storeList: [],
        getStoreListFetch: {
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
                let temp = Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
                return temp;
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
        [getStoreList]: merge((payload, state) => {
            return {
                getStoreListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getStoreList.success]: merge((payload, state) => {
            return {
                getStoreListFetch: {
                    status: 'success',
                    response: payload
                },
                storeList: payload.Data.RecordList || []
            };
        }),
        [getStoreList.error]: merge((payload, state) => {
            return {
                getStoreListFetch: {
                    status: 'pending',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
