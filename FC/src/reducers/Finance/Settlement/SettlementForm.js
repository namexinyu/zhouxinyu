import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import Settlement from 'ACTION/Finance/Settlement/Settlement';

const {
    getSettlementReport // 经纪人用于输入会员手机号匹配招工标签
} = Settlement;

const STATE_NAME = 'SettlementForm';

function InitialState() {
    return {
        state_name: STATE_NAME,
        spread: false,
        RecordList: [],
        queryParams: {
            large: {
                value: "1"
            },
            ShortName: {
                value: ""
            },
            PositionName: {
                value: ""
            },
            CheckInTimeBegin: {
                value: moment()
            },
            CheckInTimeEnd: {
                value: moment()
            },
            type: {
                value: "1"
            },
            CheckInTimeBegins: {
                value: moment().format("YYYY")
            }, 
            CheckInTimeEnds: {
                value: 2018
            }
        },
        RecordCount: 1,
        pageSize: 10,
        page: 0,
        GetMAMSRecruitmentListFetch: {
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
        [getSettlementReport]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSettlementReport.success]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? (payload.Data.RecordList || []) : [],
                RecordCount: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [getSettlementReport.error]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                totalSize: 0
            };
        })
    }
};
export default Reducer;