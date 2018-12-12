import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import RecruitMirrorAction from 'ACTION/Business/Recruit/RecruitMirrorAction';

const {
    getQuoteListByRecruitTmpID,
    getRecruitLaborOrderPrice,
    getIncomeByRecruitID,
    setRecruitQuotes,

    modifyRecruitMirrorCondition,
    getRecruitMirrorCondition,

    setLaborOrderStatus
} = RecruitMirrorAction;
const STATE_NAME = 'state_business_subsidy_setting';

function InitialState() {
    return {
        NewestRecruitID: undefined, // 录用条件过期时，记录新快照id用
        conditionInfo: {},
        GiftInfo: {},
        HoldCash: 0,
        orderPriceList: [], // 劳务报价
        quoteRecordList: [], // 会员补贴
        subsidyList: [],
        enrollFeeList: [],
        currentBindPrice: '',
        checkPriceRemark: '',
        CompSalary: '',
        LabourCost: '',
        bindValue: '',
        showPriceConfirm: false,
        getQuoteListByRecruitTmpIDFetch: {
            status: 'close',
            response: ''
        },
        modifyRecruitMirrorConditionFetch: {
            status: 'close',
            response: ''
        },
        setRecruitQuotesFetch: {
            status: 'close',
            response: ''
        },
        getRecruitMirrorConditionFetch: {
            status: 'close',
            response: ''
        },
        getRecruitLaborOrderPriceFetch: {
            status: 'close',
            response: ''
        },
        getIncomeByRecruitIDFetch: {
            status: 'close',
            response: ''
        },
        setLaborOrderStatusFetch: {
            status: 'close',
            response: ''
        },
        IDCardType: [
            {
                label: '有磁',
                value: 1
            },
            {
                label: '无磁',
                value: 2
            },
            {
                label: '临时',
                value: 4
            }
        ],
        Qualification: [
            {
                label: '不限',
                value: 15
            },
            {
                label: '小学',
                value: 1
            },
            {
                label: '初中',
                value: 2
            },
            {
                label: '高中',
                value: 4
            },
            {
                label: '大专及以上',
                value: 8
            }
        ],
        Tattoo: [
            {
                label: '全身无纹身',
                value: 15
            },
            {
                label: '手部无纹身',
                value: 1
            },
            {
                label: '手臂无纹身',
                value: 2
            },
            {
                label: '上身无纹身',
                value: 4
            },
            {
                label: '无攻击性纹身',
                value: 8
            }
        ],
        SmokeScar: [
            {
                label: '全身无烟疤',
                value: 7
            },
            {
                label: '手部无烟疤',
                value: 1
            },
            {
                label: '手臂无烟疤',
                value: 2
            },
            {
                label: '上身无烟疤',
                value: 4
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
        [getQuoteListByRecruitTmpID]: merge((payload, state) => {
            return {
                getQuoteListByRecruitTmpIDFetch: {
                    status: 'pending'
                }
            };
        }),
        [getQuoteListByRecruitTmpID.success]: merge((payload, state) => {
            return {
                getQuoteListByRecruitTmpIDFetch: {
                    status: 'success',
                    response: payload
                },
                quoteRecordList: payload.Data.RecordList || []
            };
        }),
        [getQuoteListByRecruitTmpID.error]: merge((payload, state) => {
            return {
                getQuoteListByRecruitTmpIDFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getRecruitMirrorCondition]: merge((payload, state) => {
            return {
                getRecruitMirrorConditionFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitMirrorCondition.success]: merge((payload, state) => {
            return {
                getRecruitMirrorConditionFetch: {
                    status: 'success',
                    response: payload
                },
                NewestRecruitID: undefined,
                conditionInfo: payload.Data
            };
        }),
        [getRecruitMirrorCondition.error]: merge((payload, state) => {
            return {
                getRecruitMirrorConditionFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getRecruitLaborOrderPrice]: merge((payload, state) => {
            return {
                getRecruitLaborOrderPriceFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitLaborOrderPrice.success]: merge((payload, state) => {
            let list = payload.Data.RecordList;
            let feeMax = 0;
            let feeMaxForMale = 0;
            let feeMaxForFemale = 0;
            let subsidyMin = 0;
            let subsidyMinForMale = 0;
            let subsidyMinForFemale = 0;
            let dayMax = 0;
            let dayMaxForMale = 0;
            let dayMaxForFemale = 0;
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let feeList = item.EnrollFeeList || [];
                let subsidyList = item.SubsidyList || [];
                for (let j = 0; j < feeList.length; j++) {
                    let cFee = feeList[j];
                    if (cFee.Gender === 0 && cFee.Fee > feeMax) {
                        feeMax = cFee.Fee;
                        if (!feeMaxForMale || cFee.Fee > feeMaxForMale) {
                            feeMaxForMale = cFee.Fee;
                        }
                        if (!feeMaxForFemale || cFee.Fee > feeMaxForFemale) {
                            feeMaxForFemale = cFee.Fee;
                        }
                    }
                    if (cFee.Gender === 1 && (!feeMaxForMale || cFee.Fee > feeMaxForMale)) {
                        feeMaxForMale = cFee.Fee;
                    }
                    if (cFee.Gender === 2 && (!feeMaxForFemale || cFee.Fee > feeMaxForFemale)) {
                        feeMaxForFemale = cFee.Fee;
                    }
                }
                for (let k = 0; k < subsidyList.length; k++) {
                    let cSubsidy = subsidyList[k];
                    if (cSubsidy.Gender === 0 && (!subsidyMin || cSubsidy.SubsidyAmount < subsidyMin)) {
                        subsidyMin = cSubsidy.SubsidyAmount;
                        if (!subsidyMinForMale || cSubsidy.SubsidyAmount < subsidyMinForMale) {
                            subsidyMinForMale = cSubsidy.SubsidyAmount;
                        }
                        if (!subsidyMinForFemale || cSubsidy.SubsidyAmount < subsidyMinForFemale) {
                            subsidyMinForFemale = cSubsidy.SubsidyAmount;
                        }
                    }
                    if (cSubsidy.Gender === 1 && (!subsidyMinForMale || cSubsidy.SubsidyAmount < subsidyMinForMale)) {
                        subsidyMinForMale = cSubsidy.SubsidyAmount;
                    }
                    if (cSubsidy.Gender === 2 && (!subsidyMinForFemale || cSubsidy.SubsidyAmount < subsidyMinForFemale)) {
                        subsidyMinForFemale = cSubsidy.SubsidyAmount;
                    }
                    if (cSubsidy.Gender === 0 && (!dayMax || cSubsidy.SubsidyDay > dayMax)) {
                        dayMax = cSubsidy.SubsidyDay;
                        if (!dayMaxForMale || cSubsidy.SubsidyDay > dayMaxForMale) {
                            dayMaxForMale = cSubsidy.SubsidyDay;
                        }
                        if (!dayMaxForFemale || cSubsidy.SubsidyDay > dayMaxForFemale) {
                            dayMaxForFemale = cSubsidy.SubsidyDay;
                        }
                    }
                    if (cSubsidy.Gender === 1 && (!dayMaxForMale || cSubsidy.SubsidyDay > dayMaxForMale)) {
                        dayMaxForMale = cSubsidy.SubsidyDay;
                    }
                    if (cSubsidy.Gender === 2 && (!dayMaxForFemale || cSubsidy.SubsidyDay > dayMaxForFemale)) {
                        dayMaxForFemale = cSubsidy.SubsidyDay;
                    }
                }
            }
            if (!feeMax) {
                feeMax = feeMaxForMale > feeMaxForFemale ? feeMaxForMale : feeMaxForFemale;
            }
            if (!subsidyMin) {
                subsidyMin = subsidyMinForMale < subsidyMinForFemale ? subsidyMinForMale : subsidyMinForFemale;
            }
            if (!dayMax) {
                dayMax = dayMaxForMale > dayMaxForFemale ? dayMaxForMale : dayMaxForFemale;
            }
            feeMaxForFemale = feeMax && !feeMaxForFemale ? feeMax : feeMaxForFemale;
            feeMaxForMale = feeMax && !feeMaxForMale ? feeMax : feeMaxForMale;
            subsidyMinForFemale = subsidyMin && !subsidyMinForFemale ? subsidyMin : subsidyMinForFemale;
            subsidyMinForMale = subsidyMin && !subsidyMinForMale ? subsidyMin : subsidyMinForMale;
            dayMaxForFemale = dayMax && !dayMaxForFemale ? dayMax : dayMaxForFemale;
            dayMaxForMale = dayMax && !dayMaxForMale ? dayMax : dayMaxForMale;
            return {
                getRecruitLaborOrderPriceFetch: {
                    status: 'success',
                    response: payload
                },
                orderPriceList: payload.Data.RecordList || [],
                feeMax: feeMax / 100,
                feeMaxForMale: feeMaxForMale / 100,
                feeMaxForFemale: feeMaxForFemale / 100,
                subsidyMin: subsidyMin / 100,
                subsidyMinForMale: subsidyMinForMale / 100,
                subsidyMinForFemale: subsidyMinForFemale / 100,
                dayMax: dayMax,
                dayMaxForFemale: dayMaxForFemale,
                dayMaxForMale: dayMaxForMale
            };
        }),
        [getRecruitLaborOrderPrice.error]: merge((payload, state) => {
            return {
                getRecruitLaborOrderPriceFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setRecruitQuotes]: merge((payload, state) => {
            return {
                setRecruitQuotesFetch: {
                    status: 'pending'
                }
            };
        }),
        [setRecruitQuotes.success]: merge((payload, state) => {
            return {
                setRecruitQuotesFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setRecruitQuotes.error]: merge((payload, state) => {
            return {
                setRecruitQuotesFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [modifyRecruitMirrorCondition]: merge((payload, state) => {
            return {
                modifyRecruitMirrorConditionFetch: {
                    status: 'pending'
                }
            };
        }),
        [modifyRecruitMirrorCondition.success]: merge((payload, state) => {
            return {
                modifyRecruitMirrorConditionFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modifyRecruitMirrorCondition.error]: merge((payload, state) => {
            return {
                modifyRecruitMirrorConditionFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setLaborOrderStatus]: merge((payload, state) => {
            return {
                setLaborOrderStatusFetch: {
                    status: 'pending'
                }
            };
        }),
        [setLaborOrderStatus.success]: merge((payload, state) => {
            return {
                setLaborOrderStatusFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setLaborOrderStatus.error]: merge((payload, state) => {
            return {
                setLaborOrderStatusFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getIncomeByRecruitID]: merge((payload, state) => {
            return {
                getIncomeByRecruitIDFetch: {
                    status: 'pending'
                }
            };
        }),
        [getIncomeByRecruitID.success]: merge((payload, state) => {
            return {
                getIncomeByRecruitIDFetch: {
                    status: 'success',
                    response: payload
                },
                CompSalary: payload.Data.CompSalary,
                LabourCost: payload.Data.LabourCost
            };
        }),
        [getIncomeByRecruitID.error]: merge((payload, state) => {
            return {
                getIncomeByRecruitIDFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;