import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import BusinessviewList from 'ACTION/Common/Assistance/Business';

const STATE_NAME = 'state_ac_business';
const Time = moment(new Date()).format('YYYY-MM-DD');

function addKey(a) {
    for(var i = 0; i < a.length; i++) {
          a[i].key = (i + 1).toString();
    }
    return a;
} 

function InitialState() {
    return {
        state_name: STATE_NAME,
        Date: Time,
        RecordCount: 0,
        PositionName: '',
        currentPage: 1,
        pageSize: 40,
        RecordList: [],
        RecordListLoading: false,
        BusinessListFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                return {queryParams: init.queryParams};
            }
            return {};
        }),
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
        [BusinessviewList]: merge((payload, state) => {
            return {
                BusinessListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [BusinessviewList.success]: merge((payload, state) => {
            return {
                BusinessListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? addKey(payload.Data.RecordList) || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCnt || 0 : 0,
                RecordListLoading: false
            };
        }),
        [BusinessviewList.error]: merge((payload, state) => {
            return {
                BusinessListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;