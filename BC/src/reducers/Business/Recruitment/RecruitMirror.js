import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import RecruitMirrorAction from 'ACTION/Business/Recruit/RecruitMirrorAction';
import moment from 'moment';

const {
    getRecruitMirrorInfoList,
    getCurrentRecruitCount,
    setRecruitMirrorStatus
} = RecruitMirrorAction;
const STATE_NAME = 'state_business_recruit_mirror';

function InitialState() {
    return {
        q_Date: {value: moment()},
        q_Recruit: {},
        q_RecruitStatus: {value: '-9999'},
        q_AcceptLaborOrderType: {value: '-9999'},
        q_PayType: {value: '-9999'},
        q_HasSubsidy: {value: '-9999'},

        RecruitType: -9999, // 企业类别
        pageParam: {
            currentPage: 1,
            pageSize: 10
        },

        RecordList: [],
        RecordListLoading: false,

        RecordCount: 0,
        TypeACount: 0,
        TypeBCount: 0,
        TypeCCount: 0,

        getRecruitMirrorInfoListFetch: {
            status: 'close',
            response: ''
        },

        NotLinkedCount: 0,
        RecruitingCount: 0,
        UnsetSubsidyCount: 0,
        UnopenCount: 0,
        getCurrentRecruitCountFetch: {
            status: 'close',
            response: ''
        },
        setRecruitMirrorStatusFetch: {
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
        [getRecruitMirrorInfoList]: merge((payload, state) => {
            return {
                getRecruitMirrorInfoListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getRecruitMirrorInfoList.success]: merge((payload, state) => {
            return {
                getRecruitMirrorInfoListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: (payload.Data.RecordList || []).map((item, index) => {
                    item.SequenceNumber = index + 1 + (state.pageParam.currentPage - 1) * state.pageParam.pageSize;
                    return item;
                }),
                RecordListLoading: false,
                RecordCount: payload.Data.RecordCount,
                TypeACount: payload.Data.TypeACount,
                TypeBCount: payload.Data.TypeBCount,
                TypeCCount: payload.Data.TypeCCount
            };
        }),
        [getRecruitMirrorInfoList.error]: merge((payload, state) => {
            return {
                getRecruitMirrorInfoListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: []
            };
        }),
        [getCurrentRecruitCount]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCurrentRecruitCount.success]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'success',
                    response: payload
                },
                NotLinkedCount: payload.Data.UnAcceptLaborOrderCount || 0, // 未认可的劳务报价
                RecruitingCount: payload.Data.RecruitingCount || 0, // 正在招聘中
                UnsetSubsidyCount: payload.Data.UnsetSubsidyCount || 0, // 未设置补贴
                UnopenCount: payload.Data.UnopenCount || 0 // 未开启招聘
            };
        }),
        [getCurrentRecruitCount.error]: merge((payload, state) => {
            return {
                getCurrentRecruitCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setRecruitMirrorStatus]: merge((payload, state) => {
            return {
                setRecruitMirrorStatusFetch: {
                    status: 'pending'
                }
            };
        }),
        [setRecruitMirrorStatus.success]: merge((payload, state) => {
            return {
                setRecruitMirrorStatusFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setRecruitMirrorStatus.error]: merge((payload, state) => {
            return {
                setRecruitMirrorStatusFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;