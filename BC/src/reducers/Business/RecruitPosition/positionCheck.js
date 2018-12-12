import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionRecruit from 'ACTION/Business/Recruit/ActionRecruit';

const {
    getAuditRecruitList,
    auditRecruitStatus
} = ActionRecruit;

const STATE_NAME = 'state_recruit_position_check';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        currentPosition: '',
        AuditCount: 0,
        RejectCount: 0,
        auditStatus: 0,
        AuditResult: {value: '1'},
        Desc: {value: ''},
        q_recruitType: {},
        q_recruitName: {},
        q_createTime: {},
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        summaryInfo: '',
        getAuditRecruitListFetch: {
            status: 'close',
            response: ''
        },
        auditRecruitStatusFetch: {
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
                let temp = Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
                return temp;
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
        [getAuditRecruitList]: merge((payload, state) => {
            return ({
                getAuditRecruitListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getAuditRecruitList.success]: merge((payload, state) => {
            return ({
                getAuditRecruitListFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data.RecordList,
                recordCount: payload.Data.RecordCount,
                AuditCount: payload.Data.AuditCount,
                RejectCount: payload.Data.RejectCount
            });
        }),
        [getAuditRecruitList.error]: merge((payload, state) => {
            return ({
                getAuditRecruitListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [auditRecruitStatus]: merge((payload, state) => {
            return ({
                auditRecruitStatusFetch: {
                    status: 'pending'
                }
            });
        }),
        [auditRecruitStatus.success]: merge((payload, state) => {
            return ({
                auditRecruitStatusFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [auditRecruitStatus.error]: merge((payload, state) => {
            return ({
                auditRecruitStatusFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

