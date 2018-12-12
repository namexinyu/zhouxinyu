import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import BrokerAction from 'ACTION/Assistant/BrokerAction';

const STATE_NAME = 'state_ac_needDoAllList';

const {
    GetNeedDoAllList
} = BrokerAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: {
            CreateDate: {value: moment()},
            BrokerAccount: {value: ''},
            MsgType: {value: []},
            DG: {value: [-9999]},
            WorkStatus: {value: '-9999'}
        },
        tmpObj: {},
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        RecordList: [],
        RecordCount: 0,
        NotDealNum: 0,
        RecordListLoading: false,
        GetNeedDoAllListFetch: {
            status: 'close',
            response: ''
        },
        setCallbackEntryDataFetch: {
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
        [GetNeedDoAllList]: merge((payload, state) => {
            return {
                GetNeedDoAllListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                tmpObj: {}
            };
        }),
        [GetNeedDoAllList.success]: merge((payload, state) => {
            return {
                GetNeedDoAllListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? payload.Data.RecordList || [] : [],
                RecordCount: payload.Data ? payload.Data.RecordCount || 0 : 0,
                RecordListLoading: false
            };
        }),
        [GetNeedDoAllList.error]: merge((payload, state) => {
            return {
                GetNeedDoAllListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;