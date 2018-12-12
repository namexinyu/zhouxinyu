import state_sideNav from './SideNav/index';
import state_tabPage from './TabPage/index';
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
// 助理平台
import state_ac_board from './Assistant/Board/index';
import state_ac_interviewList from './Assistant/Interview/InterviewList';
import state_ac_memberList from './Assistant/Member/MemberList';
import state_ac_needDoAllList from './Assistant/NeedDo/NeedDoAllList';
import state_ac_needDoList from './Assistant/NeedDo/NeedDoList';
import state_ac_haveDoneList from './Assistant/NeedDo/HaveDoneList';
import state_ac_pickUpList from './Assistant/PickUp/index';
import state_ac_managerTransferInfo from './Assistant/Transfer/ManagerTransferInfo';
import state_ac_managerTransferLog from './Assistant/Transfer/ManagerTransferLog';
import state_ac_performanceList from './Assistant/Performance/PerformanceList';
import state_ac_performanceDetail from './Assistant/Performance/PerformanceDetail';
import state_ac_performancePKList from './Assistant/Performance/PerformancePKList';
import state_ac_memberDetail from './Assistant/Member/MemberDetail';
import state_ac_header_accountInfo from './Header/AccountInformation/index';
import state_ac_interviewReportList from './Assistant/Report/InterviewReportList';
import state_ac_pickUpReportList from './Assistant/Report/PickUpReportList';
import state_ac_signInterviewCount from './Assistant/SignInterviewCount/SignInterviewCount';
import state_ac_attendanceList from './Assistant/Attendance/AttendanceList';
import state_ac_common from './Assistant/CommonState';
import state_ac_bag_list from './Assistant/BagList/index';
import state_ac_presign_trace from './Assistant/PresignTrace/index';
import state_ac_business from './Assistant/Business/business';
import state_ac_memberneed from './Assistant/MemberNeed/MemberNeed';
import state_ac_Everysign from './Assistant/Everysign/Everysign';
import state_ac_account_manage from './Assistant/AccountManage/AccountList';
import state_ac_operation_log from './Assistant/AccountManage/OperationLog';
import state_ac_belonging_split from './Assistant/Member/BelongingSplit';
import state_ac_depart_manage from './Assistant/DepartgroupManage/DepartmentManage';
import state_ac_group_manage from './Assistant/DepartgroupManage/GroupManage';
import state_ac_message from './Assistant/Message/message';

// import state_ac_MemberTestResult from './Assistant/TestResult/index';

import state_ac_MemberTestResult from './Assistant/TestResult/MemberList';
import state_ac_MeTestDetail from './Assistant/TestResult/MeTestDetail';
import state_ac_FactoryDetail from './Assistant/TestResult/FacTestDetail';

import state_ac_FactoryTestResult from './Assistant/TestResult/FactoryList';
import state_ac_GetUnFamiliarList from './Assistant/TestResult/UnfarimlarExam';

import state_ac_tag_list from './Assistant/Tags/TagList';
import state_ac_tag_match from './Assistant/Tags/TagMatch';
import state_ac_daily_employed from './Assistant/Report/DailyEmployedList';
import state_ac_daily_recommend from './Assistant/Report/DailyRecommendList';
import state_ac_broker_schedule from './Assistant/Report/BrokerSchedule';
import removeMobile from './Assistant/Report/removeMobile';

import state_common_simple_recruit from './Common/simpleRecruitList';
import state_common_store_list from './Common/storeList';
import state_broker_detail_pocket from './Broker/Member/Detail/detailPocket';
import state_broker_information from './Broker/BrokerInformation';
import state_broker_header_calculator from './Broker/Header/SalaryCalculator/index';
import state_broker_header_systemInfo from './Broker/Header/SystemInfo';
import state_broker_header_resource from './Broker/Header/Resource';
import state_broker_header_accountInfo from "./Broker/Header/AccountInformation";
import state_broker_recruitNameList from './Broker/Recruit/RecruitNameList';
import state_broker_recruitList from './Broker/Recruit/RecruitList';
import state_broker_recruitCommitBug from './Broker/Recruit/RecruitCommitBug';
import state_broker_recruitMatchPhone from './Broker/Recruit/RecruitMatchPhone';
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
import state_hub_list from "./Broker/HubListInfo";
import state_broker_all_recruit from "./Broker/AllRecruitList";
import state_broker_question from './Broker/Question';
import state_broker_eventlist from './Broker/EventEntry/list';

export default {
  initialState: {},
  children: {
    state_sideNav,
    state_tabPage,
    state_ac_memberDetail,
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
        state_mams_recruitmentRequireInfo, // 招工资讯录用条件
        state_ac_business, // 企业情况
        state_ac_memberneed, // 会员需求
        state_ac_Everysign, // 经纪人每日面试名单
        state_ac_message // 消息列表
      }
    },
    store_ac: {
      children: {
        state_ac_board, // 概况
        state_ac_common,
        state_ac_interviewList, // 面试名单
        state_ac_memberList, // 会员列表
        state_ac_signInterviewCount, // 签到面试统计
        state_ac_needDoAllList, // 待办列表
        state_ac_needDoList, // 待办事项
        state_ac_haveDoneList, // 已办事项
        state_ac_managerTransferInfo, // 主管转人
        state_ac_managerTransferLog, // 转人日志
        state_ac_performanceList, // 绩效列表
        state_ac_performanceDetail, // 绩效详情
        state_ac_performancePKList, // 红绿榜PK
        state_ac_header_accountInfo, // 头部信息
        state_ac_interviewReportList, // 面试统计
        state_ac_pickUpReportList, // 预接站统计
        state_ac_attendanceList, // 门店排班
        state_ac_pickUpList, // 预签到名单,
        state_ac_bag_list, // 口袋名单
        state_ac_presign_trace, // 预签到走向
        state_ac_account_manage, // 账号管理
        state_ac_operation_log, // 操作日志列表
        state_ac_belonging_split, // 归属拆分
        state_ac_depart_manage, // 部门管理
        state_ac_group_manage, // 战队管理
        state_ac_MemberTestResult, // 会员考试结果统计
        state_ac_MeTestDetail, // 会员考试详情
        state_ac_FactoryTestResult, // 企业考试结果统计
        state_ac_FactoryDetail, // 企业考试详情
        state_ac_GetUnFamiliarList, // 不熟悉会员统计
        state_ac_tag_list, // 标签库
        state_ac_tag_match, // 标签匹配
        state_ac_daily_employed, // 每日入职统计
        state_ac_broker_schedule, // 经纪人排班
        state_ac_daily_recommend, // 每日推荐统计
        removeMobile // 空号移除统计
      }
    },
    store_broker: {
      children: {
        state_broker_detail_pocket,
        state_broker_information,
        // 你可以把经纪人角色对应的state放在这里
        state_broker_recruitNameList, // 企业名称列表(经纪人会员企业名列表)
        state_broker_recruitCommitBug, // 企业纠错
        state_broker_recruitList, // 招工资讯-企业列表
        state_broker_recruitMatchPhone, // 招工-匹配会员手机号
        state_broker_header_calculator, // 薪资计算器
        state_broker_header_systemInfo, // 头部-系统消息
        state_broker_header_accountInfo, // 头部-账户信息
        state_broker_header_resource, // 底部-资源
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
        state_broker_member_detail_alarm_clock,
        state_broker_member_detail_tags,
        state_hub_list, // 門店列表
        state_broker_all_recruit,
        state_broker_eventlist,
        state_broker_question // 提问回复
      }
    }
  }
};
