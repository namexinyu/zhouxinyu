import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const {
    MatchUserRecruitTag, // 经纪人用于输入会员手机号匹配招工标签
    GetMAMSRecruitmentList
} = ActionMAMSRecruitment;

const STATE_NAME = 'state_mams_recruitmentList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        spread: false,
        RecordList: [],
        queryParams: {
            // 企业参数
            RecruitDate: {value: moment()},
            RecruitName: {value: ''},
            HasSubsidy: {value: undefined},
            HasEnrollFee: {value: undefined},
            Physical: {value: undefined},
            ReturnRequire: {value: undefined},
            MasterPush: {value: undefined},
            // 会员参数
            Phone: {value: undefined}, // 仅经纪人平台
            Age: {value: undefined},
            Gender: {value: undefined},

            // NationInfo: {value: {value: '', text: ''}},
            IDCardType: {value: undefined},
            Education: {value: "-9999"},
            Clothes: {value: undefined},
            Characters: {value: undefined},
            ForeignBodies: {value: undefined},
            Math: {value: undefined},
            // Criminal: {value: undefined},
            SmokeScar: {value: undefined},
            Tattoo: {value: undefined}
        },
        currentPage: 1,
        pageSize: 20,
        totalSize: 0,
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
        [GetMAMSRecruitmentList]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'pending'
                }
            };
        }),
        [GetMAMSRecruitmentList.success]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data ? (payload.Data.RecordList || []) : [],
                totalSize: payload.Data ? (payload.Data.RecordCount || 0) : 0
            };
        }),
        [GetMAMSRecruitmentList.error]: merge((payload, state) => {
            return {
                GetMAMSRecruitmentListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                totalSize: 0
            };
        }),
        // 华丽的请求三连ACTION分割线
        [MatchUserRecruitTag]: merge((payload, state) => {
            return {
                MatchUserRecruitTagFetch: {
                    status: 'pending'
                }
            };
        }),
        [MatchUserRecruitTag.success]: merge((payload, state) => {
            return {
                MatchUserRecruitTagFetch: {
                    status: 'success',
                    response: payload
                }
                // 将匹配逻辑直接放到这里
            };
        }),
        [MatchUserRecruitTag.error]: merge((payload, state) => {
            return {
                MatchUserRecruitTagFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;