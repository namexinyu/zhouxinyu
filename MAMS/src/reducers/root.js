import state_dialog from './Dialog/index';
import state_sideNav from './SideNav/index';
import state_tabPage from './TabPage/index';
import state_login from './Login/index';
import state_broker_detail_pocket from './Broker/Member/Detail/detailPocket';
// 各平台通用reducer
import state_mams_assistanceList from "./Common/Assistance/AssistanceList";
import state_mams_assistanceListMy from "./Common/Assistance/AssistanceListMy";
import state_mams_assistanceNew from "./Common/Assistance/AssistanceNew";
import state_mams_assistanceDetail from "./Common/Assistance/AssistanceDetail";
import state_mams_assistanceReplyList from "./Common/Assistance/AssistanceReplyList";
import state_mams_employeeFilterList from "./Common/Employee/EmployeeFilterList";
import state_mams_recruitFilterList from "./Common/Recruitment/RecruitFilterList";
import state_mams_recruitmentEntrust from "./Common/Recruitment/RecruitmentEntrust";
import state_mams_recruitmentList from "./Common/Recruitment/RecruitmentList";
import state_mams_recruitmentRequireInfo from "./Common/Recruitment/RecruitmentRequireInfo";

import state_broker_information from './Broker/BrokerInformation';
import state_broker_workBoard from './Broker/WorkBoard';
import state_broker_member_lossList from './Broker/Member/LossList';
import state_broker_career_performance from './Broker/Career/Performance';
import state_broker_memberList from './Broker/Member/MemberList'; // 我的会员列表
import state_broker_callbackInterview from './Broker/CallbackInterview';
import state_broker_callbackBadge from './Broker/CallbackBadge';
import state_broker_callbackWorking from './Broker/CallbackWorking/index';
import state_broker_departmentNameList from './Broker/DepartmentList/index';
import state_broker_header_alarm_feature from './Broker/Header/Alarm/feature';
import state_broker_header_alarm_past from './Broker/Header/Alarm/past';
import state_broker_header_calculator from './Broker/Header/SalaryCalculator/index';
import state_broker_header_systemInfo from './Broker/Header/SystemInfo';
import state_broker_header_resource from './Broker/Header/Resource';
import state_broker_header_accountInfo from "./Broker/Header/AccountInformation";
import state_broker_recruitNameList from './Broker/Recruit/RecruitNameList';
import state_broker_recruitList from './Broker/Recruit/RecruitList';
import state_broker_recruitCommitBug from './Broker/Recruit/RecruitCommitBug';
import state_broker_recruitMatchPhone from './Broker/Recruit/RecruitMatchPhone';
import state_broker_remindHistory from './Broker/Remind/RemindHistory/RemindHistory';
import state_broker_remindUnRead from './Broker/Remind/RemindUnRead/RemindUnRead';
import state_broker_birthDayRemind from './Broker/Remind/RemindUnRead/BirthdayRemind';
import state_broker_timingTask from './Broker/TimingTask/index';
import state_need_to_do_data from "./Broker/getNeedToDoData";
import state_broker_workBoard_list from "./Broker/TodayTrack";
import state_broker_have_done from "./Broker/getHaveDoneData";
import state_today_track_estimate_sign from "./Broker/TodayEstimateSign";
import state_today_sign from "./Broker/TodaySign";
import state_today_Interview from "./Broker/TodayInterview";
import state_broker_member_detail_account from './Broker/Member/Detail/detailAccount';
import state_broker_member_detail_follow_list from './Broker/Member/Detail/detailFollowList';
import state_broker_member_detail_info from './Broker/Member/Detail/detailInfo';
import state_broker_member_detail_process from './Broker/Member/Detail/detailProcess';
import state_broker_member_detail_recommend_list from './Broker/Member/Detail/detailRecommendList';
import state_broker_member_detail_work_list from './Broker/Member/Detail/detailWorkList';
import state_broker_md_factory from './Broker/Member/Detail/detailFactoryCheckin';
import state_broker_detail_member_operate from './Broker/Member/Detail/detailOperate';
import state_broker_member_detail_status_record from './Broker/Member/Detail/detailStatusRecord';
import state_broker_member_detail_enroll_record from './Broker/Member/Detail/detailEnrollRecord';
import state_broker_member_detail_demands_info from './Broker/Member/Detail/detailDemandsInfo';

import state_broker_member_detail_interview_record from './Broker/Member/Detail/detailInterviewRecord';
import state_broker_member_detail_alarm_clock from './Broker/Member/Detail/detailAlarmClockList';
import state_broker_member_detail_tags from './Broker/Member/Detail/detailMemberTags';
import state_common_simple_recruit from './Common/simpleRecruitList';
import state_common_store_list from './Common/storeList';
import state_bm_managerTransferInfo from './BrokerManager/Transfer/ManagerTransferInfo';
import state_bm_managerTransferLog from './BrokerManager/Transfer/ManagerTransferLog';
import state_hub_list from "./Broker/HubListInfo";
import state_broker_bag_list from './Broker/BagList';
import state_broker_recruit_basic from './Broker/BagList/RecruitBasic';
import state_broker_interview_status from './Broker/TodayInterview/SetBrokerInterviewStatus';
import state_today_track_send_car from './Broker/TodayEstimateSign/SendCar';
import state_today_track_send_car_new from './Broker/TodayEstimateSign/SendCarNew';
import state_today_track_factory_checkin from './Broker/TodayEstimateSign/FactoryCheckinList';
import state_broker_recommendationList from './Broker/Finance/RecommendationList';
import state_broker_subsidyList from './Broker/Finance/SubsidyList';
import state_broker_transferApplyList from './Broker/TransferApply/TransferApplyList';
import state_today_track_pre_signNum from "./Broker/TodayEstimateSign/PreSignNum";
import state_broker_all_recruit from "./Broker/AllRecruitList";
import state_broker_delete_preSign from "./Broker/DeletePreSign/index";
import state_ac_performanceList from './Broker/Performance/PerformanceList';
import state_ac_performanceDetail from './Broker/Performance/PerformanceDetail';
import state_broker_question from './Broker/Question';
import state_broker_entry from './Broker/EventEntry/entry';
import state_broker_query from './Broker/EventEntry/query';
import state_broker_detail from './Broker/EventEntry/detail';
import state_broker_eventlist from './Broker/EventEntry/list';
import state_broker_listdetail from './Broker/EventEntry/listdetail';
import state_mams_message from "./Broker/Message/message";
import state_broker_eventqueryWiki from "./Broker/EventEntry/Wiki";
import state_ac_GetUnFamiliarList from "./Broker/Exam/exam";
import state_broker_member_person_post_info from './Broker/Member/Detail/detailPersonPostInfon'; // 人岗信息

export default {
  initialState: {},
  children: {
    state_dialog,
    state_sideNav,
    state_login,
    state_tabPage,
    state_common_simple_recruit,
    state_common_store_list,
    store_mams: {
      children: {
        state_mams_assistanceList, // 部门委托列表
        state_mams_assistanceListMy, // 部门委托列表(我的)
        state_mams_assistanceNew, // 部门委托新建
        state_mams_assistanceDetail, // 部门详情
        state_mams_assistanceReplyList, // 部门回复列表
        state_mams_employeeFilterList, // 员工名称列表(筛选用)
        // 招工资讯
        state_mams_recruitFilterList, // 企业名称列表(筛选用)
        state_mams_recruitmentEntrust, // 企业纠错(走部门委托)
        state_mams_recruitmentList, // 招工资讯列表
        state_mams_recruitmentRequireInfo // 招工资讯录用条件
      }
    },
    store_broker: {
      children: {
        state_broker_detail_pocket,
        state_broker_information,
        state_broker_workBoard,
        // 你可以把经纪人角色对应的state放在这里
        state_ac_performanceList, // 绩效列表
        state_ac_performanceDetail, // 绩效详情
        state_broker_callbackInterview, // 确认面试回访
        state_broker_callbackBadge, // 工牌回访
        state_broker_callbackWorking, // 一周回访
        state_broker_recruitNameList, // 企业名称列表(经纪人会员企业名列表)
        state_broker_recruitCommitBug, // 企业纠错
        state_broker_recruitList, // 招工资讯-企业列表
        state_broker_recruitMatchPhone, // 招工-匹配会员手机号
        state_broker_remindHistory, // 提醒历史
        state_broker_remindUnRead, // 未读提醒
        state_broker_departmentNameList, // 部门枚举值列表
        state_broker_birthDayRemind, // 生日提醒
        state_broker_member_lossList, // 会员管理 - 转走概况
        state_broker_memberList,
        state_broker_career_performance, // 经济生涯-绩效查询
        state_broker_header_alarm_feature, // 闹钟-未过期
        state_broker_header_alarm_past, // 头部-已过期
        state_broker_header_calculator, // 薪资计算器
        state_broker_header_systemInfo, // 头部-系统消息
        state_broker_header_accountInfo, // 头部-账户信息
        state_broker_header_resource, // 底部-资源
        state_broker_timingTask, // 10轮询定时请求
        state_broker_workBoard_list, // 面板数据请求
        state_need_to_do_data, // 待办列表请求
        state_today_track_estimate_sign, // 今日预签到名单
        state_today_sign, // 今日签到名单
        state_today_Interview, // 今日面试名单
        state_broker_have_done, // 已办事项数据请求
        state_broker_member_detail_account,
        state_broker_member_detail_follow_list,
        state_broker_member_detail_info,
        state_broker_member_detail_process,
        state_broker_member_detail_recommend_list,
        state_broker_member_detail_work_list,
        state_broker_md_factory,
        state_broker_detail_member_operate,
        state_broker_member_detail_status_record,
        state_broker_member_detail_enroll_record, // 报名记录
        state_broker_member_detail_interview_record, // 面试记录
        state_broker_member_detail_demands_info, // 会员需求列表
        state_broker_member_person_post_info, // 人岗信息
        state_broker_member_detail_alarm_clock,
        state_broker_member_detail_tags,
        state_broker_recommendationList, // 财务报销-推荐费
        state_broker_subsidyList, // 财务报销-补贴
        state_broker_transferApplyList, // 经纪人申请转人
        state_bm_managerTransferInfo, // 临时，主管换人
        state_broker_bag_list, // 口袋名单列表
        state_broker_recruit_basic, // 口袋名单统计接口
        state_broker_interview_status, // 修改经纪人处理
        state_today_track_send_car, // 派车单跟踪
        state_today_track_send_car_new, // 派车单跟踪新
        state_today_track_factory_checkin, // 厂门口接站
        state_bm_managerTransferLog, // 临时，换人日志
        state_hub_list, // 門店列表
        state_today_track_pre_signNum, // 今日预签到，明日预签到数量
        state_broker_all_recruit,
        state_broker_delete_preSign, // 删除预签到1111
        state_broker_question, // 提问回复
        state_broker_entry, // 事件录入
        state_broker_query, // 事件查询列表
        state_broker_detail, // 事件查询详情页
        state_broker_eventlist, // 事件列表
        state_broker_listdetail, // 事件列表详情
        state_ac_GetUnFamiliarList, // 不熟悉列表
        state_mams_message,
        state_broker_eventqueryWiki
      }
    }
  }
};
