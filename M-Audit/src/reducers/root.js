import state_dialog from './Dialog/index';
import state_sideNav from './SideNav/index';
import state_tabPage from './TabPage/index';
import state_header_accountInfo from './Header/AccountInformation';
// 各平台通用reducer
import state_mams_assistanceList from "./Common/Assistance/AssistanceList";
import state_mams_assistanceListMy from "./Common/Assistance/AssistanceListMy";
import state_mams_assistanceNew from "./Common/Assistance/AssistanceNew";
import state_mams_assistanceDetail from "./Common/Assistance/AssistanceDetail";
import state_mams_assistanceReplyList from "./Common/Assistance/AssistanceReplyList";
import state_mams_employeeFilterList from "./Common/Employee/EmployeeFilterList";
import state_mams_departgroup_list from "./Common/DepartGroupList";
// 审核
import state_audit_attendanceList from './Audit/AuditList/AttendanceList';
import state_audit_bankCardList from './Audit/AuditList/BankCardList';
import state_audit_idCardList from './Audit/AuditList/IDCardList';
import state_audit_workCardList from './Audit/AuditList/WorkCardList';
import state_audit_idCardModal from './Audit/AuditList/IDCardModal';
import state_audit_workCardModal from './Audit/AuditList/WorkCardModal';
import state_audit_attendanceModal from './Audit/AuditList/AttendanceModal';
import state_audit_bankCardModal from './Audit/AuditList/BankCardModal';
import state_audit_common from './Audit/Common/index';
import state_common from './Common/index';
import state_audit_workerCard_operate from './Audit/AuditOperate/AuditWorkerCard';
import state_audit_idCard_operate from './Audit/AuditOperate/AuditIdCard';
import state_audit_attendance_operate from './Audit/AuditOperate/AuditAttendance';
import state_audit_bankCard_operate from './Audit/AuditOperate/AuditBankCard';
import state_audit_example_list from './Audit/AuditList/AuditExampleList';
import state_audit_board from './Audit/Board';
import state_audit_feedback_list from './Audit/Callback/FeedbackList';

// 回访
import state_audit_callbackEntryListByUser from './Audit/Callback/CallbackEntryListByUser';
import state_audit_callbackEntryList from './Audit/Callback/CallbackEntryList';
import state_broker_eventlist from "./Common/Assistance/eventlist";
import state_mams_recruitFilterList from "./Common/Assistance/RecruitFilterList";
export default {
    initialState: {},
    children: {
        state_dialog,
        state_sideNav,
        state_tabPage,
        state_audit_board,
        state_header_accountInfo,
        state_audit_workerCard_operate,
        state_audit_idCard_operate,
        state_audit_attendance_operate,
        state_audit_bankCard_operate,
        state_audit_example_list,
        state_common,
        state_broker_eventlist,
        state_mams_recruitFilterList,
        store_mams: {
            children: {
                state_mams_assistanceList, // 部门委托列表
                state_mams_assistanceListMy, // 部门委托列表(我的)
                state_mams_assistanceNew, // 部门委托新建
                state_mams_assistanceDetail, // 部门详情
                state_mams_assistanceReplyList, // 部门回复列表
                state_mams_departgroup_list,
                state_mams_employeeFilterList // 员工名称列表(筛选用)
            }
        },
        store_audit: {
            children: {
                state_audit_attendanceList,
                state_audit_attendanceModal,
                state_audit_bankCardList,
                state_audit_bankCardModal,
                state_audit_idCardList,
                state_audit_idCardModal,
                state_audit_workCardList,
                state_audit_workCardModal,
                state_audit_callbackEntryList,
                state_audit_callbackEntryListByUser,
                state_audit_feedback_list,
                state_audit_common
            }
        }
    }
};