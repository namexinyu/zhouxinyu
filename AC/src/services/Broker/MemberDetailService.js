import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';
import fetchJsonp from 'fetch-jsonp';
import setQueryParam from 'UTIL/base/QueryParam/setQueryParam';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        return res;
    }
};
let baseToDoNoSpinner = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};
let MemberDetailService = {
    // 获取会员详细信息
    getMemberDetailInfo: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberDetail',
            params: params || {}
        }, baseToDo);
    },
    // 设置会员基本信息
    setMemberBaseInfo: (params) => {
        if (params.UpdateInfo && params.UpdateInfo.WeChat) {
            params.UpdateInfo.WeChat = params.UpdateInfo.WeChat.replace(/\s/g, '');
        }
        if (params.UpdateInfo && params.UpdateInfo.QQ) {
            params.UpdateInfo.QQ = params.UpdateInfo.QQ.replace(/\s/g, '');
        }
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_UpdateMemberInfo',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 获取会员关注职位列表
    getMemberFollowedRecruitList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberFollowedRecruits',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员账户流水
    getMemberAccountRecord: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberAccountRecord',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员推荐列表
    getMemberRecommendList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberRecommendRecord',
            params: params || {}
        }, baseToDo);
    },
    // 获取职位列表
    getRecruitSimpleList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员提醒信息列表
    getMemberRemindMessageList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetReminderMsgList',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员待办信息列表
    getMemberScheduleMessageList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetScheduleMsgList',
            params: params || {}
        }, baseToDo);
    },
    // 代替会员推荐
    helpMemberRecommend: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetAgentRecommend',
            params: params || {}
        }, baseToDo);
    },
    // 设置会员闹钟提醒
    setMemberPersonalAlter: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetCustomAlter',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员工作经历
    getMemberWorkHistory: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberCareerList',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员状态历程
    getMemberStatusRecord: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberWorkFlow',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员的联系记录
    getMemberContactRecord: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_UserWaitDoneList/BK_GetUserContactRecord',
            params: params || {}
        }, baseToDo);
    },
    // getMemberContactRecord: (params) => {
    //     openDialog({
    //         id: 'spinner',
    //         type: 'spinner'
    //     });
    //     return HttpRequest.post({
    //         url: API_URL + '/BK_Members/WD_MEMB_GetMemberCallRecord',
    //         params: params || {}
    //     }, baseToDo);
    // },
    // 获取会员预报名记录
    getMemberEstimatedApplyList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberEnrollList',
            params: params || {}
        }, baseToDo);
    },
    // 预报名结案
    closeMemberApply: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_CloseMemberCase',
            params: params || {}
        }, baseToDo);
    },
    // 修改预报名信息
    modifyMemberApply: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_ModifyMemberPreEnroll',
            params: params || {}
        }, baseToDo);
    },
    getMemberApplyInfo: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_PreEnrollStatus',
            params: params || {}
        }, baseToDo);
    },
    // 代报名
    createMemberApply: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetMemberPreEnroll',
            params: params || {}
        }, baseToDo);
    },
    helpMemberApply: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetMemberAgentEnroll',
            params: params || {}
        }, baseToDo);
    },
    // 设置预签到
    insertPreSign: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_PreOrderSrv/WD_JJZX_InsertPreOrder',
            params: params || {}
        }, baseToDo);
    },
    // 修改预签到
    updatePreSign: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_PreOrderSrv/WD_JJZX_ModifyPreOrder',
            params: params || {}
        }, baseToDo);
    },
    renewMemberApply: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_RenewPreEnroll',
            params: params || {}
        }, baseToDo);
    },
    // 回复工场百事通
    answerKA: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_ReplyKAAnswer',
            params: params || {}
        }, baseToDo);
    },
    // 创建司机接单
    createDispatchOrder: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetDispatchOrder',
            params: params || {}
        }, baseToDo);
    },
    // 设置接站
    createPickupLocate: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetPrePickupLocate',
            params: params || {}
        }, baseToDo);
    },
    // 回复反馈
    replyFeedback: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_ReplyFeedback',
            params: params || {}
        }, baseToDo);
    },
    // 经纪人回拨
    brokerCallBack: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_JPushServer/BK_PushMessageToDevice',
            params: params || {}
        }, baseToDo);
    },
    // 设置会员标签
    setMemberTags: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetUserTags',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员标签
    getMemberTags: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetUserTags',
            params: params || {}
        }, baseToDo);
    },
    getPickupLocationList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetPickupLocation',
            params: params || {}
        }, baseToDo);
    },
    // 获取报名记录列表
    getMemberEnrollRecord: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_ListRecruit',
            params: params || {}
        }, baseToDo);
    },
    // 获取面试记录列表
    getMemberInterviewRecord: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_InterviewSrv/WD_JJZX_ListInterviewResult',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员需求列表
    getMemberDemandsInfo: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_UserWaitDoneList/BK_GetWaitDoList',
            params: params || {}
        }, baseToDo);
    },
    // 一键处理代办（即一键处理会员需求）
    patchProcessDemands: (params) => {
      openDialog({
          id: 'spinner',
          type: 'spinner'
      });
      return HttpRequest.post({
          url: API_URL + '/BK_UserWaitDoneList/BK_HandleWaitDoneEvent',
          params: params || {}
      }, baseToDo);
    },
    // 取消客户端提醒
    cancelClientPush: (params) => {
        return HttpRequest.post({
            url: API_URL + '/PushMessageServer/CancelPush',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员提问详情（在会员需求列表中点击回复获取）
    getMemberAskInfo: (params) => {
      openDialog({
          id: 'spinner',
          type: 'spinner'
      });
      return HttpRequest.post({
          url: API_URL + '/BK_UserWaitDoneList/BK_GetUserWaitDoneEvent',
          params: params || {}
      }, baseToDo);
    },
    // 获取周薪薪三卡信息
    getMemberZxxCardsInfo: (params = {}) => {
      return fetchJsonp(setQueryParam('http://oa.dagongzhan.com/tools/wddg_ajax.ashx', params), {
        jsonpCallback: 'jsoncallback'
      }).then((res) => {
        return res.json();
      });
    },
    // 获取周薪薪三卡信息
    getMemberZxxRecordData: (params = {}) => {
      return fetchJsonp(setQueryParam('http://oa.dagongzhan.com/tools/wddg_ajax.ashx', params), {
        jsonpCallback: 'jsoncallback'
      }).then((res) => {
        return res.json();
      });
    },
    // 新版周薪薪周薪记录
    getNewZxxWeekSalaryData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ZXXSync/ZXX_WeekBill_Salary_Select',
            params: params || {}
        }, baseToDo);
    },
    // 新版周薪薪月薪记录
    getNewZxxMonthSalaryData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ZXXSync/ZXX_MonthBill_GetMonthBatchList',
            params: params || {}
        }, baseToDo);
    },
    // 新版周薪薪打卡记录
    getNewZxxCheckInData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ZXXSync/ZXX_AgentAssistant_QueryClockRecord',
            params: params || {}
        }, baseToDo);
    },
    // 新版周薪薪三卡审核
    getNewZxxTriCardData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ZXXSync/ZXX_QueryThreeCard',
            params: params || {}
        }, baseToDo);
    },
    getSevenFeature: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_User7Feature/WD_BK_FetchUser7Feature',
            params: params || {}
        }, baseToDo);
    },
    getSevenFeatureConfig: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_User7Feature/WD_BK_Fetch7FeatureConfig',
            params: params || {}
        }, baseToDo);
    },
    updateSevenFeature: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_User7Feature/WD_BK_ModifyUser7Feature',
            params: params || {}
        }, baseToDo);
    },
    updateRegistNation: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RegistInfo/WD_JJZX_ModifyRegistNation',
            params: params || {}
        }, baseToDo);
    }
};
export default MemberDetailService;
