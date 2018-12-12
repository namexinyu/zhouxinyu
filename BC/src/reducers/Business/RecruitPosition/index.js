import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionRecruit from 'ACTION/Business/Recruit/ActionRecruit';

const {
    getRecruitPositionList,
    getRecruitPositionSimpleList,
    exportRecruitPositionList,
    setRecruitStatus
} = ActionRecruit;

const STATE_NAME = 'state_recruit_position_list';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        RecruitPositionSimpleList: [],
        RecordListLoading: false,
        recruitType: '',
        q_recruit: {},
        q_createTime: {},
        q_recommendStatus: {},
        q_recruitStatus: {},
        q_areaCode: {},
        o_createTimeOrder: false,
        o_modifyTimeOrder: false,
        TypeACount: 0,
        TypeBCount: 0,
        TypeCCount: 0,
        ForbidCount: 0,
        getRecruitPositionListFetch: {
            status: 'close',
            response: ''
        },
        getRecruitPositionSimpleListFetch: {
            status: 'close',
            response: ''
        },
        exportRecruitPositionListFetch: {
            status: 'close',
            response: ''
        },
        setRecruitStatusFetch: {
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
        [getRecruitPositionList]: merge((payload, state) => {
            return ({
                getRecruitPositionListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            });
        }),
        [getRecruitPositionList.success]: merge((payload, state) => {
            return ({
                getRecruitPositionListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                recordList: payload.Data.RecordList || [],
                recordCount: payload.Data.RecordCount || 0,
                TypeACount: payload.Data.TypeACount || 0,
                TypeBCount: payload.Data.TypeBCount || 0,
                TypeCCount: payload.Data.TypeCCount || 0,
                ForbidCount: payload.Data.ForbidCount || 0
            });
        }),
        [getRecruitPositionList.error]: merge((payload, state) => {
            return ({
                getRecruitPositionListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                recordList: []
            });
        }),
        [exportRecruitPositionList]: merge((payload, state) => {
            return ({
                exportRecruitPositionListFetch: {
                    status: 'pending'
                }
            });
        }),
        [exportRecruitPositionList.success]: merge((payload, state) => {
            return ({
                exportRecruitPositionListFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [exportRecruitPositionList.error]: merge((payload, state) => {
            return ({
                exportRecruitPositionListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [getRecruitPositionSimpleList]: merge((payload, state) => {
            return ({
                getRecruitPositionSimpleListFetch: {
                    status: 'pending'
                }
            });
        }),
        [getRecruitPositionSimpleList.success]: merge((payload, state) => {
            return ({
                getRecruitPositionSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecruitPositionSimpleList: payload.Data.RecordList || []
            });
        }),
        [getRecruitPositionSimpleList.error]: merge((payload, state) => {
            return ({
                getRecruitPositionSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        [setRecruitStatus]: merge((payload, state) => {
            return ({
                setRecruitStatusFetch: {
                    status: 'pending'
                }
            });
        }),
        [setRecruitStatus.success]: merge((payload, state) => {
            return ({
                setRecruitStatusFetch: {
                    status: 'success',
                    response: payload
                }
            });
        }),
        [setRecruitStatus.error]: merge((payload, state) => {
            return ({
                setRecruitStatusFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;

