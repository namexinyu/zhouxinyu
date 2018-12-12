import moment from 'moment';

import merge from 'REDUCER/merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberDetailInfo from 'ACTION/Broker/MemberDetail/getMemberDetailInfo';
import setMemberBaseInfo from 'ACTION/Broker/MemberDetail/setMemberBaseInfo';
import getSevenFeatureConfig from 'ACTION/Broker/MemberDetail/getSevenFeatureConfig';
import getSevenFeature from 'ACTION/Broker/MemberDetail/getSevenFeature';

const STATE_NAME = 'state_broker_member_detail_info';

function InitialState() {
    return {
        userInfo: {},
        Nation: "",
        editCallName: {},
        editArea: {},
        editAddress: {},
        editQQ: {},
        editAge: { value: -1 },
        editWeChat: {},
        editGender: {},
        editBirthday: {},
        impressionInfo: {
            CaseLevel: {
                value: ''
            },
            RealName: {
                value: ''
            },
            BirthYear: {
                value: ''
            },
            Province: {
                value: ''
            },
            Education: {
                value: ''
            },
            MaritalStatus: {
                value: ''
            },
            Wycas: {
                value: []
            },
            WorkYear: {
                value: ''
            },
            NativeAddress: {
                value: ''
            },
            Disadvantage: {
                value: ''
            },
            Advantage: {
                value: ''
            },
            Preference: {
                value: ''
            },
            Remark: {
                value: ''
            },
            PainPoint: {
                value: ''
            },
            Solution: {
                value: ''
            },
            User7FeatureID: '' 
        },
        expectationInfo: {
            User7FeatureID: '', 
            Salary: {
                value: ''
            },
            Eat: {
                value: ''
            },
            Live: {
                value: ''
            },
            Work: {
                value: ''
            },
            Around: {
                value: ''
            },
            Manage: {
                value: ''
            },
            DreamDate: ''
        },
        impressionConfigList: [],
        getMemberDetailInfoFetch: {
            status: 'close',
            response: ''
        },
        setMemberBaseInfoFetch: {
            status: 'close',
            response: ''
        },
        getSevenFeatureFetch: {
            status: 'close',
            response: ''
        },
        getSevenFeatureConfigFetch: {
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
                let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
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
        [getMemberDetailInfo]: merge((payload, state) => {
            return {
                getMemberDetailInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberDetailInfo.success]: merge((payload, state) => {
            return {
                getMemberDetailInfoFetch: {
                    status: 'success',
                    response: payload
                },
                userInfo: payload.Data
            };
        }),
        [getMemberDetailInfo.error]: merge((payload, state) => {
            return {
                getMemberDetailInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setMemberBaseInfo]: merge((payload, state) => {
            return {
                setMemberBaseInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [setMemberBaseInfo.success]: merge((payload, state) => {
            return {
                setMemberBaseInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setMemberBaseInfo.error]: merge((payload, state) => {
            return {
                setMemberBaseInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getSevenFeature]: merge((payload, state) => {
            return {
                getSevenFeatureFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSevenFeature.success]: merge((payload, state) => {
            const {
                CaseLevel,
                RealName,
                BirthYear,
                Province,
                Education,
                MaritalStatus,
                Wycas,
                WorkYear,
                NativeAddress,
                Disadvantage,
                Advantage,
                Preference,
                Remark,
                PainPoint,
                Solution,
                Expire = {},
                User7FeatureID
            } = payload.Data || {};

            return {
                getSevenFeatureFetch: {
                    status: 'success',
                    response: payload
                },
                impressionInfo: {
                    CaseLevel: {
                        value: CaseLevel != null ? `${(CaseLevel === -1 || CaseLevel === 0) ? '' : CaseLevel}` : ''
                    },
                    RealName: {
                        value: RealName || ''
                    },
                    BirthYear: {
                        value: BirthYear || ''
                    },
                    Province: {
                        value: `${Province != null ? (Province.Value === 0 ? '' : Province.Value) : ''}`
                    },
                    Education: {
                        value: `${Education != null ? (Education.Value === 0 || Education.Value === -1 ? '' : Education.Value) : ''}`
                    },
                    MaritalStatus: {
                        value: `${MaritalStatus != null ? (MaritalStatus.Value === 0 || MaritalStatus.Value === -1 ? '' : MaritalStatus.Value) : ''}`
                    },
                    Wycas: {
                        value: Wycas != null ? Wycas.filter(item => item.Value !== 0).map(item => `${item.Value}`) : []
                    },
                    WorkYear: {
                        value: `${WorkYear != null ? (WorkYear.Value === 0 || WorkYear.Value === -1 ? '' : WorkYear.Value) : ''}`
                    },
                    NativeAddress: {
                        value: NativeAddress || ''
                    },
                    Disadvantage: {
                        value: Disadvantage || ''
                    },
                    Advantage: {
                        value: Advantage || ''
                    },
                    Preference: {
                        value: Preference || ''
                    },
                    Remark: {
                        value: Remark || ''
                    },
                    PainPoint: {
                        value: PainPoint || ''
                    },
                    Solution: {
                        value: Solution || ''
                    },
                    User7FeatureID
                },
                expectationInfo: {
                    User7FeatureID,
                    Salary: {
                        value: Expire.Salary || ''
                    },
                    Eat: {
                        value: Expire.Eat || ''
                    },
                    Live: {
                        value: Expire.Live || ''
                    },
                    Work: {
                        value: Expire.Work || ''
                    },
                    Around: {
                        value: Expire.Around || ''
                    },
                    Manage: {
                        value: Expire.Manage || ''
                    },
                    DreamDate: Expire.DreamDate
                }
            };
        }),
        [getSevenFeature.error]: merge((payload, state) => {
            return {
                getSevenFeatureFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getSevenFeatureConfig]: merge((payload, state) => {
            return {
                getSevenFeatureConfigFetch: {
                    status: 'pending'
                }
            };
        }),
        [getSevenFeatureConfig.success]: merge((payload, state) => {
            return {
                getSevenFeatureConfigFetch: {
                    status: 'success',
                    response: payload
                },
                impressionConfigList: (payload.Data || {}).List || []
            };
        }),
        [getSevenFeatureConfig.error]: merge((payload, state) => {
            return {
                getSevenFeatureConfigFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
        
    }
};
export default Reducer;