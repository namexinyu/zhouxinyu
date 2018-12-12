import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import overviewAction from 'ACTION/Finance/overviewAction';
import InviteOrderAction from 'ACTION/Finance/TradeManage/InviteOrderAction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const {getInviteFeeOrderList} = InviteOrderAction;
const STATE_NAME = 'state_finance_trade_invite';

function InitialState() {
    return {
        queryParams: {
            Date: {},
            AuditDate: {},
            UserInviter: {},
            UserInviterPhone: {},
            UserInvited: {},
            UserInvitedPhone: {},
            InviteStatus: {value: '-9999'}
        },
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            SequenceCreateTime: false
        },
        tagParam: [],
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,
        selectedRowKeys: [],
        selectedRowSum: {},
        getInviteFeeOrderListFetch: {
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
                let initState = new InitialState();
                if (payload.fieldName) {
                    return {[payload.fieldName]: initState[payload.fieldName]};
                }
                return initState;
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
        [getInviteFeeOrderList]: merge((payload, state) => {
            return {
                getInviteFeeOrderListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true,
                selectedRowKeys: [],
                selectedRowSum: {}
            };
        }),
        [getInviteFeeOrderList.success]: merge((payload, state) => {
            return {
                getInviteFeeOrderListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount,
                RecordListLoading: false
            };
        }),
        [getInviteFeeOrderList.error]: merge((payload, state) => {
            return {
                getInviteFeeOrderListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),
        [overviewAction]: (state, payload) => {
            let settleStatus = payload.query.toString();
            if (payload.stateName === STATE_NAME && (settleStatus === '2' || settleStatus === '1')) {
                let init = new InitialState();
                init.tagParam = ['SettleStatus__' + settleStatus];
                if (settleStatus === '2') { // 今日已审核
                    init.queryParams.AuditDate = {value: [moment(), moment()]};
                } else { // 今日待审核
                    // init.queryParams.Date = {value: [moment(), moment()]};
                    init.queryParams.Date = {value: [undefined, undefined]};
                }
                return init;
            }
            return state;
        }
    }
};
export default Reducer;