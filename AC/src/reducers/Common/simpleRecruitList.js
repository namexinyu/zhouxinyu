import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getRecruitSimpleList from 'ACTION/Common/getRecruitSimpleList';

const STATE_NAME = 'state_common_simple_recruit';

function InitialState() {
    return {
        recruitList: [],
        getRecruitSimpleListFetch: {
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
        [getRecruitSimpleList]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitSimpleList.success]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                recruitList: payload.Data.RecruitList || []
            };
        }),
        [getRecruitSimpleList.error]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'pending',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;