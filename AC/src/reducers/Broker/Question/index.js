import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import getRecruitList from 'ACTION/Broker/Question/question';
import answerList from 'ACTION/Broker/Question/answer';


const STATE_NAME = 'state_broker_question';
function arrkey(arr) {
    for(var i = 0; i < arr.length; i++) {
       arr[i].key = (i + 1).toString();
    }
    return arr;
}
function InitialState() {
    return {
        questionList: [],
        MatchAsk: '',
        MatchUserName: '',
        TimeEnd: '',
        TimeStart: '',
        Offset: 0,
        pageSize: 20,
        currentPage: 1,
        totalSize: 0,
        getRecruitListFetch: {
            status: 'close',
            response: ''
        },
        getRecruitRequireInfoFetch: {
            status: 'close',
            response: ''
        },
        answerListFetch: {
            status: 'close',
            response: ''
        },
        answerList: ''
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
        [getRecruitList]: merge((payload, state) => {
            return {
                getRecruitListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitList.success]: merge((payload, state) => {
            let list = payload.Data || {};
            return {
                getRecruitListFetch: {
                    status: 'success',
                    response: payload
                },
                questionList: list['RecordList'] ? arrkey(list['RecordList']) : [],
                totalSize: payload.Data.PageInfo.TotalCount || 0
            };
        }),
        [getRecruitList.error]: merge((payload, state) => {
            return {
                getRecruitListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 修改回答
        [answerList]: merge((payload, state) => {
            return {
                answerListFetch: {
                    status: 'pending'
                }
            };
        }),
        [answerList.success]: merge((payload, state) => {
            let list = payload.Data || {};
            return {
                answerListFetch: {
                    status: 'success',
                    response: payload
                },
                answerList: payload
               
            };
        }),
        [answerList.error]: merge((payload, state) => {
            return {
                answerListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })

    }
};
export default Reducer;