import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import BillAction from 'ACTION/ExpCenter/BillAction';

const {getBillList} = BillAction;


const STATE_NAME = 'state_ec_billList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        queryParams: undefined,
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        Total: {},
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        getBillListFetch: {
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
        [getBillList]: merge((payload, state) => {
            return {
                getBoardingAddressListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getBillList.success]: merge((payload, state) => {
            const data = payload.Data || {};
            let _total = {};
            Object.keys(data).forEach((key) => {
                if (key.indexOf('Total') === 0) {
                    _total[key] = data[key];
                }
            });
            return {
                getBoardingAddressListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: data.RecordList || [],
                RecordCount: data.RecordCount || 0,
                Total: _total,
                RecordListLoading: false
            };
        }),
        [getBillList.error]: merge((payload, state) => {
            return {
                getBoardingAddressListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false
            };
        })
    }
};
export default Reducer;