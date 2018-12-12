import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import LaborOrderInfoAction from 'ACTION/Business/OrderManage/LaborOrderInfoAction';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';

const {setInterview} = UserOrderAction;
const {getLaborPriceList} = LaborAction; // 劳务报价列表
const {
    getLaborOrderInfoList,
    laborOrderHireSet
} = LaborOrderInfoAction;
const STATE_NAME = 'state_business_labororder_info';

function InitialState() {
    return {
        q_Gender: {value: '-9999'},
        q_JFFInterviewStatus: {value: '-9999'},
        q_RealName: {},
        q_SettleStatus: {value: '-9999'},
        RecordList: [],
        RecordListLoading: false,

        getLaborOrderInfoListFetch: {
            status: 'close',
            response: ''
        },
        laborOrderHireSetFetch: {
            status: 'close',
            response: ''
        },

        LaborOrderList: [], // 劳务报价列表
        LaborOrderListLoading: false,
        getLaborPriceListFetch: {
            status: 'close',
            response: ''
        },
        setInterviewFetch: {
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
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
                // return init.queryParams;
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
        [getLaborOrderInfoList]: merge((payload, state) => {
            return {
                getLaborOrderInfoListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getLaborOrderInfoList.success]: merge((payload, state) => {
            return {
                getLaborOrderInfoListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordListLoading: false
            };
        }),
        [getLaborOrderInfoList.error]: merge((payload, state) => {
            return {
                getLaborOrderInfoListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [laborOrderHireSet]: merge((payload, state) => {
            return {
                laborOrderHireSetFetch: {
                    status: 'pending'
                }
            };
        }),
        [laborOrderHireSet.success]: merge((payload, state) => {
            return {
                laborOrderHireSetFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [laborOrderHireSet.error]: merge((payload, state) => {
            return {
                laborOrderHireSetFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getLaborPriceList]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'pending'
                },
                LaborOrderListLoading: true
            };
        }),
        [getLaborPriceList.success]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'success',
                    response: payload
                },
                LaborOrderList: payload.Data.RecordList || [],
                LaborOrderListLoading: false
            };
        }),
        [getLaborPriceList.error]: merge((payload, state) => {
            return {
                getLaborPriceListFetch: {
                    status: 'error',
                    response: payload
                },
                LaborOrderListLoading: false,
                LaborOrderList: []
            };
        }),
        [setInterview]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'pending'
                }
            };
        }),
        [setInterview.success]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setInterview.error]: merge((payload, state) => {
            return {
                setInterviewFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;