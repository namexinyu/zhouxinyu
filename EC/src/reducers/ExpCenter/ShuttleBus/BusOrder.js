import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';


import GetBusOrderList from 'ACTION/ExpCenter/ShuttleBus/GetBusOrderList';
import GetBusOrderDetail from 'ACTION/ExpCenter/ShuttleBus/GetBusOrderDetail';


const STATE_NAME = 'reducersBusOrder';

function InitialState() {
    return {
        state_name: STATE_NAME,
        RecordList: [],
        DetailList: [],
        formSpread: true,
        RecordCount: 0,
        MemberPhone: undefined, // 用于会员匹配工作标签
        queryParams: {
            OrderStartDate: "",
            OrderEndDate: "",
            DestName: "",
            RenterName: "",
            OrderStatus: "",
            SettleStatus: "",
            OriginName: "",
            ChargeFor: "",
            BusPassengers: "",
            ReceivableAmount: "",
            Remark: ""
        },
        CheckOutType: true,
        ChargeAmount: 0.00,
        ReceivableAmount: 0.00,
        BrokerCountAmount: 0.00,
        DetailRecordCount: 0.00,
        displayModal: false,
        selectedRowKeys: [],
        currentRecruitRequire: {},
        currentRecruit: {},
        orderParams: {Key: 'RecruitID', Order: 1},
        pageParam: {
            RecordIndex: 1,
            RecordSize: 10
        },
        DetailpageParam: {
            RecordIndex: 1,
            RecordSize: 10
        },
        getRecruitListFetch: {
            status: 'close',
            response: ''
        },
        getRecruitRequireInfoFetch: {
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
        [GetBusOrderList]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [GetBusOrderList.success]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount
            };
        }),
        [GetBusOrderList.error]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        // 请求Action三连发分割线
        [GetBusOrderDetail]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [GetBusOrderDetail.success]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'success',
                    response: payload
                },
                DetailList: payload.Data || []
            };
        }),
        [GetBusOrderDetail.error]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                DetailList: []
            };
        })
    }
};
export default Reducer;