import merge from '../../merge';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_broker_all_recruit';

function InitialState() {
    return {
        getAllRecruitFetch: {
            status: 'pending',
            response: ''
        },
        RecordList: []
    };
}

const getAllRecruitList = {
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
        [getAllRecruitData]: merge((payload, state) => {
            return {
                getAllRecruitFetch: {
                    status: 'pending'
                }
            };
        }),
        [getAllRecruitData.success]: merge((payload, state) => {
            return {
                getAllRecruitFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || []
            };
        }),
        [getAllRecruitData.error]: merge((payload, state) => {
            return {
                getAllRecruitFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getAllRecruitList;