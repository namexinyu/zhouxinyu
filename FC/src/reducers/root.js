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

import state_finance_common from './Finance/Common';
import state_finance_serviceBillDetail from './Finance/ReconciliationManage/ServiceBillDetail';
import state_finance_serviceBill from './Finance/ReconciliationManage/ServiceBill';
import state_finance_settleAbnormal from './Finance/ReconciliationManage/SettleAbnormal';
import state_finance_trade_user from './Finance/TradeManage/UserOrder';
import state_finance_penny from './Finance/AccountManage/Penny';

import state_finance_trade_labor from './Finance/TradeManage/LaborOrder';
import state_finance_trade_labor_info from './Finance/TradeManage/LaborOrderInfo';
import state_finance_trade_subsidy_order from './Finance/TradeManage/SubsidyOrder';
import state_finance_trade_subsidy_order_abnormal from './Finance/TradeManage/SubsidyOrderAbnormal';

import state_finance_trade_interview from './Finance/TradeManage/Interview';
import state_finance_interview_import from './Finance/TradeManage/InterviewImport';
import state_finance_interview_red_import from './Finance/TradeManage/InterviewRedImport';
import state_finance_bill_import from './Finance/ReconciliationManage/BillImport';
import state_finance_labor_charge_import from './Finance/TradeManage/LaborChargeImport';

import state_finance_trade_fee_bill from './Finance/TradeManage/FeeBill';
import state_finance_trade_fee_detail from './Finance/TradeManage/FeeDetail';
import state_finance_trade_fee_settle from './Finance/TradeManage/FeeSettle';
import state_fc_laborAccount from "./Finance/AccountManage/LaborAccount";
import state_fc_balanceDetails from "./Finance/AccountManage/BalanceDetails";
import state_finance_member_withdraw from "./Finance/AccountManage/MemberWithdraw";
import state_finance_bank_back from "./Finance/AccountManage/BankBack";
import state_mams_eventlist from "./Common/Management/eventlist";

import state_finance_trade_invite from './Finance/TradeManage/InviteOrder';
import state_finance_trade_dispatch from './Finance/TradeManage/DispatchOrder';
import state_finance_trade_giftfee from './Finance/TradeManage/GiftFee';
import state_finance_trade_complain from './Finance/TradeManage/Complain';
import state_finance_trade_complain_labor from './Finance/TradeManage/ComplainLabor';
import state_fc_laborComByBoss from "./Finance/AccountManage/LaborComByBoss";
import state_finance_header_accountInfo from './Header/AccountInformation';
import SettlementForm from "./Finance/Settlement/SettlementForm";
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
        state_mams_eventlist,
        state_finance_common,
        state_finance_serviceBill,
        state_finance_serviceBillDetail,
        state_finance_settleAbnormal,
        state_finance_trade_labor,
        state_finance_trade_labor_info,
        state_finance_trade_user,
        state_finance_trade_fee_bill,
        state_finance_trade_fee_detail,
        state_finance_trade_fee_settle,
        state_finance_trade_interview,
        state_finance_trade_subsidy_order,
        state_finance_trade_subsidy_order_abnormal,
        state_finance_interview_import,
        state_finance_interview_red_import,
        state_finance_bill_import,
        state_finance_labor_charge_import,
        state_finance_penny,
        state_finance_member_withdraw,
        state_finance_bank_back,
        state_fc_laborAccount,
        state_fc_balanceDetails,
        state_finance_trade_invite,
        state_finance_trade_dispatch,
        state_finance_trade_giftfee,
        state_finance_trade_complain,
        state_finance_trade_complain_labor,
        state_fc_laborComByBoss,
        state_finance_header_accountInfo,
        SettlementForm
    }
};