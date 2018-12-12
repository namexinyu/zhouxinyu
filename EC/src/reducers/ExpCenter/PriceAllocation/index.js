import merge from '../../merge';
import getPriceAllocation from 'ACTION/ExpCenter/PriceAllocation';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_priceAllocation';
function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}
function addKey(arr) {
    let upArr = [];
   arr.sort(function (a, b) {
        return (new Date(b.EndTime).getTime()) - (new Date(a.EndTime).getTime());
   });
        for (let i = 0; i < arr.length; i++) {
            arr[i].key = i.toString();
            for (let j in arr[i]) {
                if(j == "AmountInfo") {
                    arr[i][j] = JSON.parse(arr[i][j]);
                }
            }
            upArr.push(arr[i]);
        }
        return upArr;
}
function InitialState() {
    return {
        getPriceAllocationFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLoading: false,
        ActivityList: [],
        TotalCount: 0
    };
}

const getPriceAllocationList = {
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
        [getPriceAllocation]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getPriceAllocationFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPriceAllocation.success]: merge((payload, state) => {
            if(payload.Data) {
                var arrList = payload.Data.ActivityList ? addKey(payload.Data.ActivityList) : [];
            }
            return {
                getPriceAllocationFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                ActivityList: arrList,
                TotalCount: payload.Data.TotalCount
            };
        }),
        [getPriceAllocation.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getPriceAllocationFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getPriceAllocationList;