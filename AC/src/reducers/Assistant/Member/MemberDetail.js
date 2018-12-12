import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import MemberDetailAction from 'ACTION/Assistant/MemberDetailAction';

const STATE_NAME = 'state_ac_memberDetail';

const {
    getMemberDetailInfo,
    getMemberFollowedRecruitList,
    getMemberRecommendList,
    getMemberScheduleMessageList,
    getMemberWorkHistory,
    getMemberStatusRecord,
    getMemberContactRecord,
    getMemberTags,
    getLatestPocketCase
} = MemberDetailAction;

function InitialState() {
    let now = new Date();
    let sd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 183, 0, 0, 0);
    let ed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return {
        contactStartTime: sd,
        contactEndTime: ed,
        showTab: 1,
        state_name: STATE_NAME,
        userInfo: '',
        statusRecord: [],
        workFollowRecord: [],
        contactRecord: [],
        waitRecord: [],
        recommendRecord: [],
        followRecord: [],
        memberTags: '',
        lastPocket: {},
        getMemberDetailInfoFetch: {
            status: 'close',
            response: ''
        },
        getMemberFollowedRecruitListFetch: {
            status: 'close',
            response: ''
        },
        getMemberRecommendListFetch: {
            status: 'close',
            response: ''
        },
        getMemberScheduleMessageListFetch: {
            status: 'close',
            response: ''
        },
        getMemberWorkHistoryFetch: {
            status: 'close',
            response: ''
        },
        getMemberStatusRecordFetch: {
            status: 'close',
            response: ''
        },
        getMemberContactRecordFetch: {
            status: 'close',
            response: ''
        },
        getMemberTagsFetch: {
            status: 'close',
            response: ''
        },
        getLatestPocketCaseFetch: {
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
                return { queryParams: init.queryParams };
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
        // 1
        [getMemberDetailInfo]: merge((payload, state) => {
            return ({
                getMemberDetailInfoFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberDetailInfo.success]: merge((payload, state) => {
            return ({
                getMemberDetailInfoFetch: {
                    status: 'success',
                    response: payload
                },
                userInfo: payload.Data || ''
            });
        }),
        [getMemberDetailInfo.error]: merge((payload, state) => {
            return ({
                getMemberDetailInfoFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 2
        [getMemberFollowedRecruitList]: merge((payload, state) => {
            return ({
                getMemberFollowedRecruitListFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberFollowedRecruitList.success]: merge((payload, state) => {
            return ({
                getMemberFollowedRecruitListFetch: {
                    status: 'success',
                    response: payload
                },
                followRecord: (payload.Data && payload.Data.RecruitInfos) || []
            });
        }),
        [getMemberFollowedRecruitList.error]: merge((payload, state) => {
            return ({
                getMemberFollowedRecruitListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 3
        [getMemberRecommendList]: merge((payload, state) => {
            return ({
                getMemberRecommendListFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberRecommendList.success]: merge((payload, state) => {
            return ({
                getMemberRecommendListFetch: {
                    status: 'success',
                    response: payload
                },
                recommendRecord: (payload.Data && payload.Data.RecommendRecords) || []
            });
        }),
        [getMemberRecommendList.error]: merge((payload, state) => {
            return ({
                getMemberRecommendListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 4
        [getMemberScheduleMessageList]: merge((payload, state) => {
            return ({
                getMemberScheduleMessageListFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberScheduleMessageList.success]: merge((payload, state) => {
            return ({
                getMemberScheduleMessageListFetch: {
                    status: 'success',
                    response: payload
                },
                waitRecord: (payload.Data && payload.Data.ScheduleList) || []
            });
        }),
        [getMemberScheduleMessageList.error]: merge((payload, state) => {
            return ({
                getMemberScheduleMessageListFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 5
        [getMemberWorkHistory]: merge((payload, state) => {
            return ({
                getMemberWorkHistoryFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberWorkHistory.success]: merge((payload, state) => {
            return ({
                getMemberWorkHistoryFetch: {
                    status: 'success',
                    response: payload
                },
                workFollowRecord: (payload.Data && payload.Data.CareerList) || []
            });
        }),
        [getMemberWorkHistory.error]: merge((payload, state) => {
            return ({
                getMemberWorkHistoryFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 6
        [getMemberStatusRecord]: merge((payload, state) => {
            return ({
                getMemberStatusRecordFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberStatusRecord.success]: merge((payload, state) => {
            return ({
                getMemberStatusRecordFetch: {
                    status: 'success',
                    response: payload
                },
                statusRecord: (payload.Data && payload.Data.RecordList) || []
            });
        }),
        [getMemberStatusRecord.error]: merge((payload, state) => {
            return ({
                getMemberStatusRecordFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 7
        [getMemberContactRecord]: merge((payload, state) => {
            return ({
                getMemberContactRecordFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberContactRecord.success]: merge((payload, state) => {
            return ({
                getMemberContactRecordFetch: {
                    status: 'success',
                    response: payload
                },
                contactRecord: (payload.Data && payload.Data.InteractList) || []
            });
        }),
        [getMemberContactRecord.error]: merge((payload, state) => {
            return ({
                getMemberContactRecordFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 8
        [getMemberTags]: merge((payload, state) => {
            return ({
                getMemberTagsFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getMemberTags.success]: merge((payload, state) => {
            let t = {};
            try {
                t = JSON.parse(payload.Data.UserTags);
            } catch (e) {
                console.log('tags Json error');
            }
            return ({
                getMemberTagsFetch: {
                    status: 'success',
                    response: payload
                },
                memberTags: Object.assign({ OtherStatus: {} }, state.memberTags, payload.Data.UserTags ? t : {})
            });
        }),
        [getMemberTags.error]: merge((payload, state) => {
            return ({
                getMemberTagsFetch: {
                    status: 'error',
                    response: payload
                }
            });
        }),
        // 9
        [getLatestPocketCase]: merge((payload, state) => {
            return ({
                getLatestPocketCaseFetch: {
                    status: 'pending',
                    response: ''
                }
            });
        }),
        [getLatestPocketCase.success]: merge((payload, state) => {
            return ({
                getLatestPocketCaseFetch: {
                    status: 'success',
                    response: payload
                },
                lastPocket: ((payload.Data || {}).RecordList || [])[0] || {}
            });
        }),
        [getLatestPocketCase.error]: merge((payload, state) => {
            return ({
                getLatestPocketCaseFetch: {
                    status: 'error',
                    response: payload
                }
            });
        })
    }
};
export default Reducer;