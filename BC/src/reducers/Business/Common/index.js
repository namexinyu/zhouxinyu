import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CommonAction from 'ACTION/Business/Common';

const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getEmployeeList,
    getEnterpriseSimpleList,
    getCommonEnumMapping,
    getIndustryList,
    getUserMobileNumber,
    getEntTagList,
    getEntTmpList,
    getGiftInfoList,
    getEntLevelCfg
} = CommonAction;

const STATE_NAME = 'state_business_common';

function InitialState() {
    return {
        RecruitSimpleList: [],
        GiftInfoList: [],
        LaborBossSimpleList: [],
        LaborSimpleList: [],
        EmployeeList: [],
        EnterpriseSimpleList: [],
        EnumMappingList: [],
        EnumCount: 0,
        IndustryList: [],
        EntTmpList: [], // 企业模板
        EntTmpListObj: {}, // 企业模板
        getUserMobileNumberFetch: {
            status: 'close'
        },
        EntTagList: [], EntTagListObj: {},
        GiftInfoListObj: {},
        EntLevelCfg: {}
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
        [getLaborBossSimpleList]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborBossSimpleList.success]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                LaborBossSimpleList: payload.Data.RecordList
            };
        }),
        [getLaborBossSimpleList.error]: merge((payload, state) => {
            return {
                getLaborBossSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getRecruitSimpleList]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitSimpleList.success]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecruitSimpleList: payload.Data.RecordList
            };
        }),
        [getRecruitSimpleList.error]: merge((payload, state) => {
            return {
                getRecruitSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getLaborSimpleList]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLaborSimpleList.success]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                LaborSimpleList: payload.Data.RecordList
            };
        }),
        [getLaborSimpleList.error]: merge((payload, state) => {
            return {
                getLaborSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEmployeeList]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEmployeeList.success]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'success',
                    response: payload
                },
                EmployeeList: payload.Data.RecordList
            };
        }),
        [getEmployeeList.error]: merge((payload, state) => {
            return {
                getEmployeeListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEnterpriseSimpleList]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEnterpriseSimpleList.success]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'success',
                    response: payload
                },
                EnterpriseSimpleList: payload.Data.RecordList
            };
        }),
        [getEnterpriseSimpleList.error]: merge((payload, state) => {
            return {
                getEnterpriseSimpleListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getCommonEnumMapping]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
                    status: 'pending'
                }
            };
        }),
        [getCommonEnumMapping.success]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
                    status: 'success',
                    response: payload
                },
                EnumMappingList: payload.Data.EnumList,
                EnumCount: payload.Data.Count
            };
        }),
        [getCommonEnumMapping.error]: merge((payload, state) => {
            return {
                getCommonEnumMappingFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getIndustryList]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getIndustryList.success]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'success',
                    response: payload
                },
                IndustryList: payload.Data.RecordList
            };
        }),
        [getIndustryList.error]: merge((payload, state) => {
            return {
                getIndustryListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getUserMobileNumber]: merge((payload, state) => {
            return {
                getUserMobileNumberFetch: {
                    status: 'pending'
                },
                UserMobile: undefined
            };
        }),
        [getUserMobileNumber.success]: merge((payload, state) => {
            let RecordList = payload.Data && payload.Data.RecordList;
            let UserMobile = RecordList && RecordList.length ? RecordList[0].Mobile : '';
            return {
                getUserMobileNumberFetch: {
                    status: 'success',
                    response: payload
                },
                UserMobile: UserMobile
            };
        }),
        [getUserMobileNumber.error]: merge((payload, state) => {
            return {
                getUserMobileNumberFetch: {
                    status: 'error',
                    response: payload
                },
                UserMobile: undefined
            };
        }),
        [getEntTagList]: merge((payload, state) => {
            return {
                getEntTagListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEntTagList.success]: merge((payload, state) => {
            let EntTagList = payload.Data.RecordList || [];
            return {
                getEntTagListFetch: {
                    status: 'success',
                    response: payload
                },
                EntTagList,
                EntTagListObj: EntTagList.reduce((pre, cur) => {
                    cur.TagList.forEach(item => {
                        pre[item.TagID] = item.TagName;
                    });
                    return pre;
                }, {})
            };
        }),
        [getEntTagList.error]: merge((payload, state) => {
            let EntTagList = [];
            return {
                getEntTagListFetch: {
                    status: 'error',
                    response: payload
                },
                EntTagList, EntTagListObj: {}
            };
        }),
        [getGiftInfoList]: merge((payload, state) => {
            return {
                getGiftInfoListFetch: {
                    status: 'pending'
                },
                GiftInfoList: [],
                GiftInfoListObj: {}
            };
        }),
        [getGiftInfoList.success]: merge((payload, state) => {
            let RecordList = payload.Data && payload.Data.RecordList;
            let GiftInfoListObj = RecordList.reduce((pre, cur) => {
                pre[cur.GiftID] = cur;
                return pre;
            }, {});
            return {
                getGiftInfoListFetch: {
                    status: 'success',
                    response: payload
                },
                GiftInfoList: RecordList || [],
                GiftInfoListObj
            };
        }),
        [getGiftInfoList.error]: merge((payload, state) => {
            return {
                getGiftInfoListFetch: {
                    status: 'error',
                    response: payload
                },
                GiftInfoList: [],
                GiftInfoListObj: {}
            };
        }),
        [getEntTmpList]: merge((payload, state) => {
            return {
                getEntTmpListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEntTmpList.success]: merge((payload, state) => {
            let EntTmpList = payload.Data && payload.Data.RecordList || [];
            let EntTmpListObj = EntTmpList.reduce((pre, cur) => {
                cur.disabled = cur.IsEnabled === 0;
                pre[cur.EntTmpID] = cur;
                return pre;
            }, {});
            return {
                getEntTmpListFetch: {
                    status: 'success',
                    response: payload
                },
                EntTmpList, EntTmpListObj
            };
        }),
        [getEntTmpList.error]: merge((payload, state) => {
            return {
                getEntTmpListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEntLevelCfg]: merge((payload, state) => {
            return {
                getEntLevelCfgFetch: {
                    status: 'pending'
                }
            };
        }),
        [getEntLevelCfg.success]: merge((payload, state) => {
            return {
                getEntLevelCfgFetch: {
                    status: 'success',
                    response: payload
                },
                EntLevelCfg: payload.Data.EntLevelCfg
            };
        }),
        [getEntLevelCfg.error]: merge((payload, state) => {
            return {
                getEntLevelCfgFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;