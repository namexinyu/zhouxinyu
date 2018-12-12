import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import GetEntrustReplyList from "ACTION/Common/Assistance/GetEntrustReplyList";

const STATE_NAME = 'state_mams_assistanceReplyList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        ID: undefined,
        ReplyList: [],
        GetEntrustReplyListFetch: {
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
        // 华丽的请求三连ACTION分割线
        [GetEntrustReplyList]: merge((payload, state) => {
            return {
                GetEntrustReplyListFetch: {
                    status: 'pending'
                }
            };
        }),
        [GetEntrustReplyList.success]: merge((payload, state) => {
            return {
                GetEntrustReplyListFetch: {
                    status: 'success',
                    response: payload
                },
                ReplyList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                    item.rowKey = index + 1;
                    return item;
                })
            };
        }),
        [GetEntrustReplyList.error]: merge((payload, state) => {
            return {
                GetEntrustReplyListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;