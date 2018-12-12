import state_dialog from './Dialog/index';
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
import state_mams_eventlist from "./Common/Management/eventlist";
import state_mams_eventarrange from "./Common/Management/eventarrange";
import state_mams_eventdetail from "./Common/Management/eventdetail";
import state_mams_eventlistappeal from "./Common/Management/eventlistappeal";
import state_mams_eventquerydetail from "./Common/Management/eventquerydetail";
import state_mams_eventlistdetail from "./Common/Management/eventlistdetail";
import state_mams_eventserve from './Common/Management/eventserve';
import state_mams_eventstype from './Common/Management/eventstype';
import state_mams_eventquery from './Common/Management/eventquery';
import state_mams_message from './Common/Message/message';


import state_business_workBoard from './Business/WorkBoard';
import state_servicer_enterprise_list from './Business/Enterprise';
import state_servicer_enterprise_edit from './Business/Enterprise/editEnterprise';
import state_servicer_enterprise_create from './Business/Enterprise/createEnterprise';
import state_business_todaySign from './Business/TodaySign';
import state_business_userorder from './Business/OrderManage/UserOrder';
import state_business_userorder_setlabor_modal from './Business/OrderManage/UserOrderSetLaborModal';
import state_business_complainorder from './Business/OrderManage/ComplainOrder';
import state_business_labororder from './Business/OrderManage/LaborOrder';
import state_business_labororder_info from './Business/OrderManage/LaborOrderInfo';
import state_business_labororder_interview_import from './Business/OrderManage/LaborInterviewImport';
import state_business_labororder_settle_import from './Business/OrderManage/LaborSettleImport';
import state_business_common from './Business/Common';
import state_servicer_labor_boss_list from './Business/LaborBoss/index';
import state_servicer_labor_boss_check from './Business/LaborBoss/checkLaborBoss';
import state_servicer_labor_boss_edit from './Business/LaborBoss/editLaborBoss';
import state_servicer_labor_boss_create from './Business/LaborBoss/createLaborBoss';
import state_servicer_labor_company_list from './Business/Company/index';
import state_recruitment_labor_price from './Business/Recruitment/LaborPrice';
import state_business_recruit_mirror from './Business/Recruitment/RecruitMirror';
import state_servicer_labor_company_edit from './Business/Company/companyEdit';
import state_servicer_labor_company_create from './Business/Company/companyCreate';
import state_servicer_labor_company_check from './Business/Company/companyCheck';
import state_servicer_staff_list from './Business/StaffManage/index';
import state_recruit_position_list from './Business/RecruitPosition/index';
import state_recruit_position_edit from './Business/RecruitPosition/positionEdit';
import state_recruit_position_create from './Business/RecruitPosition/positionCreate';
import state_recruit_position_check from './Business/RecruitPosition/positionCheck';
import state_business_recruit_assign from './Business/RecruitPosition/assign';
import state_business_log from './Business/AllLog/index';
import state_business_subsidy_setting from './Business/Recruitment/SubsidySetting';
import state_business_header_accountInfo from './Header/AccountInformation';
import state_business_subsidy_check from './Business/Recruitment/SubsidyCheck';
import state_business_interview_namelist from './Business/OrderManage/InterviewNameList';
import state_business_factory from './Business/OrderManage/FactoryReception';
import state_business_recruitmentcheck from './Business/Recruitment/RecruitmentCheck';
import state_business_bake from './Business/Baike/index';


import state_business_recruitment_ent from './Business/Recruitment/Ent';
import state_business_recruitment_ent_edit from './Business/Recruitment/EditEntAll';
import state_business_recruitment_ent_audit from './Business/Recruitment/EntAudit';
import state_business_recruitment_daily from './Business/Recruitment/Daily';
import state_business_ugc from './Business/UGC';
import state_business_cooperation from './Business/Cooperation/index';
import Distribution from './Business/Distribution/index';
import BusinessAffairs from './Business/BusinessAffairs/index';
import StoreList from "./Business/Store/index";
export default {
    initialState: {},
    children: {
        state_dialog,
        state_sideNav,
        state_tabPage,
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
        state_business_subsidy_check,
        state_servicer_enterprise_list,
        state_servicer_enterprise_edit,
        state_servicer_enterprise_create,
        state_servicer_labor_boss_list,
        state_servicer_labor_boss_check,
        state_servicer_labor_boss_edit,
        state_servicer_labor_boss_create,
        state_servicer_labor_company_list,
        state_servicer_labor_company_edit,
        state_servicer_labor_company_create,
        state_servicer_labor_company_check,
        state_servicer_staff_list,
        state_recruit_position_list,
        state_recruit_position_edit,
        state_recruit_position_create,
        state_recruit_position_check,
        state_business_recruit_assign,
        state_recruitment_labor_price,
        state_business_recruit_mirror,
        state_business_workBoard,
        state_business_todaySign,
        state_business_userorder,
        state_business_cooperation,
        state_business_userorder_setlabor_modal,
        state_business_complainorder,
        state_business_labororder,
        state_business_labororder_info,
        state_business_labororder_interview_import,
        state_business_labororder_settle_import,
        state_business_subsidy_setting,
        state_business_common,
        state_business_log,
        state_business_header_accountInfo,
        state_business_interview_namelist,
        state_business_factory,
        state_business_recruitmentcheck,
        state_business_bake,
        state_business_recruitment_ent,
        state_business_recruitment_ent_edit,
        state_business_recruitment_ent_audit,
        state_business_recruitment_daily,
        state_business_ugc,
        state_mams_eventlist,
        state_mams_eventarrange,
        state_mams_eventdetail,
        state_mams_eventlistappeal,
        state_mams_eventquerydetail,
        state_mams_eventlistdetail,
        state_mams_eventserve,
        state_mams_eventstype,
        state_mams_eventquery,
        state_mams_message,
        StoreList,
        Distribution, 
        BusinessAffairs
    }
};