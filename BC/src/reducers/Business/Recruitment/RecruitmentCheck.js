import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import RecruitmentCheckAction from 'ACTION/Business/Recruit/RecruitmentCheckAction';
import moment from 'moment';

const {
    getList,
    setCheckStatus
} = RecruitmentCheckAction;
const STATE_NAME = 'state_business_recruitmentcheck';

function InitialState() {
    return {
        Date: {value: moment()},
        EnterpriseName: '',
        CheckStatus: 0,

        RecruitAuditFlowID: "",
        
        ModalItems: {
            Visible: false,
            confirmLoading: false,
            Remark: '',
            AuditResult: 3
        },

        realNum: 0,


        pageParam: {
            currentPage: 1,
            pageSize: 10
        },
        orderParam: {
            OrderByCreateTime: false,
            OrderByPromiseSettleDate: false
        },
        RecordList: [],
        RecordCount: 0,
        RecordListLoading: false,

        getListFetch: {
            status: 'close',
            response: ''
        },
        ExpireCount: 0,
        RejectCount: 0,
        UnAuditCount: 0,
        TotalCount: 0,

        setCheckStatusFetch: {
            status: 'close',
            response: ''
        }
    };
}

function getRecordList(oList) {
    let oReturn = [];
    let LaborAndManager = '';
    for (let i in oList) {
        let laborItems = oList[i].LaborOrderList;
        
        if (laborItems) {
            if (laborItems && laborItems.length > 1) {
                let iRow = laborItems.length;
                for (let j in laborItems) {
                    LaborAndManager = '';
                    if (laborItems[j].LaborName && laborItems[j].SalesName) {
                        LaborAndManager = laborItems[j].LaborName + '/' + laborItems[j].SalesName;
                    }else {
                        LaborAndManager = laborItems[j].LaborName + laborItems[j].SalesName;
                    }
                   
                    oReturn.push(
                        {
                            Date: oList[i].AuditTime,
                            RecruitName: oList[i].RecruitName,
                            RecruitType: oList[i].RecruitType,
                            RecruitTmpID: oList[i].RecruitTmpID,
                            LaborAndManager: LaborAndManager,
                            LaborCost: laborItems[j].LaborChargeList,
                            LaborPrice: laborItems[j].LaborSubsidyList,
                            SuggestSubsidyList: oList[i].SuggestSubsidyList,
                            SubsidyList: oList[i].SubsidyList,
                            EnrollFeeList: oList[i].EnrollFeeList,
                            LabourCostList: oList[i].LabourCostList,
                            GiftID: oList[i].GiftID,
                            AuditStatus: oList[i].AuditStatus,
                            Remark: oList[i].Remark,
                            RecruitAuditFlowID: oList[i].RecruitAuditFlowID,
                            CreateTime: oList[i].CreateTime,
                            AuditTime: oList[i].AuditTime,
                            RealDate: oList[i].Date,
                            RowSpan: j > 0 ? 0 : iRow
                        }
                    ); 
                }
            } else if (laborItems && laborItems.length === 1) {
               
                    if (laborItems[0].LaborName && laborItems[0].SalesName) {
                        LaborAndManager = laborItems[0].LaborName + '/' + laborItems[0].SalesName;
                    }else {
                        LaborAndManager = laborItems[0].LaborName + laborItems[0].SalesName;
                    }
                oReturn.push(
                    {
                        Date: oList[i].AuditTime,
                        RecruitName: oList[i].RecruitName,
                        RecruitType: oList[i].RecruitType,
                        RecruitTmpID: oList[i].RecruitTmpID,
                        LaborAndManager: LaborAndManager,
                        LaborCost: laborItems[0].LaborChargeList,
                        LaborPrice: laborItems[0].LaborSubsidyList,
                        SuggestSubsidyList: oList[i].SuggestSubsidyList,
                        SubsidyList: oList[i].SubsidyList,
                        EnrollFeeList: oList[i].EnrollFeeList,
                        LabourCostList: oList[i].LabourCostList,
                        GiftID: oList[i].GiftID,
                        AuditStatus: oList[i].AuditStatus,
                        Remark: oList[i].Remark,
                        RecruitAuditFlowID: oList[i].RecruitAuditFlowID,
                        CreateTime: oList[i].CreateTime,
                        AuditTime: oList[i].AuditTime,
                        RealDate: oList[i].Date,
                        RowSpan: 1
                    }
                ); 
               
            } else {
                oReturn.push(
                    {
                        Date: oList[i].AuditTime,
                        RecruitName: oList[i].RecruitName,
                        RecruitType: oList[i].RecruitType,
                        RecruitTmpID: oList[i].RecruitTmpID,
                        LaborAndManager: '',
                        LaborCost: '',
                        LaborPrice: '',
                        SuggestSubsidyList: oList[i].SuggestSubsidyList,
                        SubsidyList: oList[i].SubsidyList,
                        EnrollFeeList: oList[i].EnrollFeeList,
                        LabourCostList: oList[i].LabourCostList,
                        GiftID: oList[i].GiftID,
                        AuditStatus: oList[i].AuditStatus,
                        Remark: oList[i].Remark,
                        RecruitAuditFlowID: oList[i].RecruitAuditFlowID,
                        CreateTime: oList[i].CreateTime,
                        AuditTime: oList[i].AuditTime,
                        RealDate: oList[i].Date,
                        RowSpan: 1
                    }
                );
            }
        } else{
            oReturn.push(
                {
                    Date: oList[i].AuditTime,
                    RecruitName: oList[i].RecruitName,
                    RecruitType: oList[i].RecruitType,
                    RecruitTmpID: oList[i].RecruitTmpID,
                    LaborAndManager: '',
                    LaborCost: '',
                    LaborPrice: '',
                    SuggestSubsidyList: oList[i].SuggestSubsidyList,
                    SubsidyList: oList[i].SubsidyList,
                    EnrollFeeList: oList[i].EnrollFeeList,
                    LabourCostList: oList[i].LabourCostList,
                    GiftID: oList[i].GiftID,
                    AuditStatus: oList[i].AuditStatus,
                    Remark: oList[i].Remark,
                    RecruitAuditFlowID: oList[i].RecruitAuditFlowID,
                    CreateTime: oList[i].CreateTime,
                    AuditTime: oList[i].AuditTime,
                    RealDate: oList[i].Date,
                    RowSpan: 1
                }
            );
        }
    }
    return oReturn;
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
        [getList]: merge((payload, state) => {
            return {
                getListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getList.success]: merge((payload, state) => {
            let recordData = getRecordList(payload.Data.RecordList) || [];
            return {
                getListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: recordData,
                realNum: recordData.length,
                RecordCount: payload.Data.RecordCount,
                ExpireCount: payload.Data.AcceptCount,
                RejectCount: payload.Data.RejectCount,
                UnAuditCount: payload.Data.UnAuditCount,
                TotalCount: payload.Data.RejectCount + payload.Data.AcceptCount + payload.Data.UnAuditCount,
                RecordListLoading: false
            };
        }),
        [getList.error]: merge((payload, state) => {
            return {
                getListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordList: [],
                RecordListLoading: false
            };
        }),

        [setCheckStatus]: merge((payload, state) => {
            return {
                setCheckStatusFetch: {
                    status: 'pending'
                }
            };
        }),

        [setCheckStatus.success]: merge((payload, state) => {
            return {
                setCheckStatusFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setCheckStatus.error]: merge((payload, state) => {
            return {
                setCheckStatusFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;