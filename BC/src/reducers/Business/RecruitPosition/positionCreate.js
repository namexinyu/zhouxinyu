import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionRecruit from 'ACTION/Business/Recruit/ActionRecruit';
import RecruitMirrorAction from 'ACTION/Business/Recruit/RecruitMirrorAction';

const {
    createRecruitPositionInfo,
    createRecruitTag
} = ActionRecruit;

const {
    getRecruitMirrorDetail,
    modifyRecruitMirrorDetail
} = RecruitMirrorAction;

const STATE_NAME = 'state_recruit_position_create';

function InitialState() {
    return {
        enterprise: {},
        recruitName: {},
        recruitPayType: {},
        usefulTags: [],
        tags: [],
        recruitType: {},
        recommendInfo: '',
        salaryInfo: '',
        jobInfo: '',
        idCardPaperNum: 0,
        isScan: '',
        diplomaPagerNum: 0,
        pictureNum: 0,
        gatherTime: '',
        pickupPlace: '',
        allInfo: '',
        tempChangeTag: {
            value: '',
            text: ''
        },
        createRecruitPositionInfoFetch: {
            status: 'close',
            response: ''
        },
        getRecruitTagsFetch: {
            status: 'close',
            response: ''
        },
        createRecruitTagFetch: {
            status: 'close',
            response: ''
        },
        i_recommendInfo: [
            {
                key: '综合薪资',
                required: true,
                value: ''
            },
            {
                key: '工价',
                value: ''
            },
            {
                key: '工作方式',
                value: ''
            },
            {
                key: '补贴',
                value: ''
            },
            {
                key: '食宿要求',
                value: ''
            },
            {
                key: '发薪日',
                value: ''
            },
            {
                key: '费用',
                value: ''
            }
        ],
        i_salaryInfo: [
            {
                key: '基本情况',
                value: [
                    {
                        key: '综合薪资',
                        value: ''
                    },
                    {
                        key: '发薪日',
                        value: ''
                    },
                    {
                        key: '底薪',
                        value: ''
                    },
                    {
                        key: '薪资结构',
                        value: ''
                        // mode: 1
                    }
                ]
            },
            {
                key: '食宿介绍',
                value: [
                    {
                        key: '伙食',
                        value: ''
                    },
                    {
                        key: '住宿',
                        value: ''
                    },
                    {
                        key: '交通',
                        value: ''
                    }
                ]
            },
            {
                key: '合同说明',
                value: ''
            },
            {
                key: '工资发放',
                value: ''
            },
            {
                key: '保险说明',
                value: ''
            },
            {
                key: '温馨提示',
                value: ''
                // mode: 1
            }
        ],
        i_recruitInfo: [
            {
                key: '岗位状态',
                value: [
                    {
                        key: '工作内容',
                        value: ''
                    },
                    {
                        key: '两班倒',
                        value: ''
                    },
                    {
                        key: '工作环境',
                        value: ''
                    }
                ]
            },
            {
                key: '录用条件',
                value: [
                    {
                        key: '年龄',
                        value: ''
                    },
                    {
                        key: '英文字母',
                        value: ''
                    },
                    {
                        key: '简单算术',
                        value: ''
                    },
                    {
                        key: '身高要求',
                        value: ''
                    },
                    {
                        key: '材料',
                        value: ''
                    },
                    {
                        key: '体检说明',
                        value: ''
                    }
                ]
            }
        ]
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
        [resetState]: (payload, state) => {
            if (state.stateName === STATE_NAME) {
                return Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
            }
            return payload;
        },
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
        [createRecruitPositionInfo]: merge((payload, state) => {
            return {
                createRecruitPositionInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [createRecruitPositionInfo.success]: merge((payload, state) => {
            return {
                createRecruitPositionInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createRecruitPositionInfo.error]: merge((payload, state) => {
            return {
                createRecruitPositionInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [createRecruitTag]: merge((payload, state) => {
            return {
                createRecruitTagFetch: {
                    status: 'pending'
                }
            };
        }),
        [createRecruitTag.success]: merge((payload, state) => {
            return {
                createRecruitTagFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createRecruitTag.error]: merge((payload, state) => {
            return {
                createRecruitTagFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

