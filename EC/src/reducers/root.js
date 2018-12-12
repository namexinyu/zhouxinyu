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
import state_mams_common from "./Common/MAMSCommonState";
// 体验中心相关reducer
import state_ec_dispatchTrack from './ExpCenter/DispatchTrack/index';
import state_ec_dispatchTrackToday from './ExpCenter/DispatchTrack/DispatchTrackToday';
import state_ec_dispatchTrackHistory from './ExpCenter/DispatchTrack/DispatchTrackHistory';
import state_ec_dispatchClaim from './ExpCenter/DispatchTrack/DispatchClaim';
import state_ec_brokerFilterList from './ExpCenter/Broker/BrokerFilterList';
import state_ec_driverFilterList from './ExpCenter/HubEmployee/DriverFilterList';
import state_ec_addressManage from './ExpCenter/AddressManage/index';
import state_ec_hubAddressList from './ExpCenter/Hub/HubAddressList';
import state_ec_hubAddressNew from './ExpCenter/Hub/HubAddressNew';
import state_ec_hubAddressDetail from './ExpCenter/Hub/HubAddressDetail';
import state_ec_hubEmployeeList from './ExpCenter/HubEmployee/index';
import state_ec_supplyReleaseList from './ExpCenter/Supply/SupplyReleaseList';
import state_ec_supplyReleaseNew from './ExpCenter/Supply/SupplyReleaseNew';
import state_ec_supplyReleaseDetail from './ExpCenter/Supply/SupplyReleaseDetail';
import state_ec_boardingAddressList from './ExpCenter/BoardingAddress/BoardingAddressList';
import state_ec_boardingAddressDetail from './ExpCenter/BoardingAddress/BoardingAddressDetail';
import state_ec_boardingAddressNew from './ExpCenter/BoardingAddress/BoardingAddressNew';
import state_ec_signList from './ExpCenter/SignList/index';
import state_ec_interviewRefund from './ExpCenter/InterviewRefund/index';
import state_ec_chargeList from './ExpCenter/ChargeList/index';
import state_ec_pickUpList from './ExpCenter/PickUpList/index';
import state_ec_laborFilterList from './ExpCenter/Labor/LaborFilterList';
import state_ec_billList from './ExpCenter/Bill/BillList';
// import state_ec_recruitList from './ExpCenter/Recruit/RecruitList/index';
import state_ec_recruitTimeList from './ExpCenter/Recruit/RecruitTimeList/index';
import state_ec_recruitNameList from './ExpCenter/Recruit/RecruitNameList/index';
import state_ec_hubNameList from './ExpCenter/Hub/HubNameList';
import state_ec_headerInfoList from './Header';
import state_ec_systemWarning from "./WorkBoard/SystemWarning";
import state_ec_dispatchInfo from "./WorkBoard/DispatchInfo";
import state_ec_checkinInfo from "./WorkBoard/CheckinInfo";
import state_ec_laborPickupInfo from "./WorkBoard/LaborPickupInfo";
import state_ec_amountInfo from "./WorkBoard/AmountInfo";
import state_ec_sevenDayInfo from "./WorkBoard/SevenDayInfo";
import state_ec_empHubList from "./WorkBoard/EmpHubList";
import state_ec_systemMsg from "./ExpCenter/SystemMessage";
import state_ec_employeeList from "./ExpCenter/EmployeeList";
import state_ec_promotionDetail from "./ExpCenter/PromotionDetail";
import state_ec_priceAllocation from "./ExpCenter/PriceAllocation";
import state_ec_historyDispatchInfo from "./WorkBoard/HistoryDispathInfo";
import state_ec_historyCheckinInfo from "./WorkBoard/HistoryCheckinInfo";
import state_ec_historyLaborPickupInfo from "./WorkBoard/HistoryLaborPickupInfo";
import state_ec_historyAmountInfo from "./WorkBoard/HistoryAmountInfo";
import state_ec_brokersOnDuty from "./ExpCenter/BrokersOnDuty/getBrokersOnDuty";
import state_ec_brokersOnDutyEdit from "./ExpCenter/BrokersOnDuty/getBrokersOnDutyEdit";
import state_ec_departAllEmpName from "./ExpCenter/GetCommonData/getDepartAllEmpName";
import state_ec_accountChangeList from "./ExpCenter/GetCommonData/getAccountChangeList";
import state_ec_driverList from "./ExpCenter/DriverList";
import state_ec_vehicleInfoList from "./ExpCenter/Vehicle/VehicleInfoList";
import state_ec_vehicleInfoDetail from "./ExpCenter/Vehicle/VehicleInfoDetail";
import state_ec_vehicleList from "./ExpCenter/GetCommonData/getVehicleList";
import state_ec_setData from "./ExpCenter/SetData";
import state_ec_preCount from "./ExpCenter/PreCount";
import state_ec_reimbursement from "./ExpCenter/Reimbursement";
import state_ec_deposit from "./ExpCenter/Deposit";
import state_ec_land_manage from "./ExpCenter/LandManage";
import state_ec_new_account from "./ExpCenter/NewAccount";
import state_ec_bind_employee from "./ExpCenter/BindEmployee";

import reducersBusoffer from "./ExpCenter/ShuttleBus/Busoffer";
import reducersBusOrder from "./ExpCenter/ShuttleBus/BusOrder";
import reducersBusRenter from "./ExpCenter/ShuttleBus/BusRenter";
import reducersBusSchedule from "./ExpCenter/ShuttleBus/BusSchedule";
import reducersBusType from "./ExpCenter/ShuttleBus/BusType"; 
import state_ec_busoffer from "./ExpCenter/ShuttleBus/Busoffer";
import state_broker_header_calculator from './Header/SalaryCalculator/index';
import state_mams_eventlist from "./Common/Management/eventlist";

export default {
    initialState: {},
    children: {
        state_dialog,
        state_sideNav,
        state_tabPage,
        state_ec_headerInfoList,
        store_mams: {
            children: {
                state_mams_assistanceList, // 部门委托列表
                state_mams_assistanceListMy, // 部门委托列表(我的)
                state_mams_assistanceNew, // 部门委托新建
                state_mams_assistanceDetail, // 部门详情
                state_mams_assistanceReplyList, // 部门回复列表
                state_mams_employeeFilterList, // 员工名称列表(筛选用)
                state_mams_common, // 放置通用筛选接口
                // 招工资讯
                state_mams_recruitFilterList, // 企业名称列表(筛选用)
                state_mams_recruitmentEntrust, // 企业纠错(走部门委托)
                state_mams_recruitmentList, // 招工资讯列表
                state_mams_recruitmentRequireInfo // 招工资讯录用条件
            }
        },
        state_mams_eventlist,
        reducersBusOrder, 
        reducersBusRenter, 
        reducersBusSchedule, 
        reducersBusType,
        store_ec: {
            children: {
                state_ec_busoffer, // 班车管理：报价管理
                state_ec_dispatchTrack, // 派单跟踪
                state_ec_dispatchTrackToday, // 派单跟踪今日
                state_ec_dispatchTrackHistory, // 派单跟踪历史
                state_ec_dispatchClaim, // 派单报销
                state_ec_brokerFilterList, // 经纪人名称列表(筛选用)
                state_ec_driverFilterList, // 接送专员名称列表(筛选用)
                state_ec_supplyReleaseList, // 物品发放列表
                state_ec_supplyReleaseNew, // 物品发放新增
                state_ec_supplyReleaseDetail, // 物品发放详情(退押金弹窗用)
                state_ec_hubAddressList, // 体验中心地址
                state_ec_hubAddressNew, // 体验中心新增
                state_ec_hubAddressDetail, // 体验中心详情
                state_ec_hubEmployeeList, // 体验中心职工列表(匹配用，人事部门信息)
                state_ec_hubNameList, // 体验中心名称列表(筛选用)
                state_ec_boardingAddressList, // 上车地址
                state_ec_boardingAddressDetail, // 上车地址详情
                state_ec_boardingAddressNew, // 上车地址新增
                state_ec_signList, // 会员签到列表
                state_ec_interviewRefund, // 面试退费
                state_ec_chargeList, // 收退费列表
                state_ec_pickUpList, // 劳务接人列表
                state_ec_laborFilterList, // 劳务名称列表(筛选用)
                state_ec_billList, // 收退费对账
                // state_ec_recruitList, // 招工资讯列表
                state_ec_recruitTimeList, // 招工时间资讯列表
                state_ec_recruitNameList, // 企业名称列表(筛选用)
                state_ec_addressManage, // 地址管理
                state_ec_vehicleInfoList, // 车辆管理页面列表
                state_ec_vehicleInfoDetail, // 车辆管理弹窗详情
                state_ec_systemWarning, // 面板页系统消息
                state_ec_dispatchInfo, // 面板页待派单
                state_ec_checkinInfo, // 面板页已签到
                state_ec_laborPickupInfo, //
                state_ec_amountInfo, // 收取报名费总计
                state_ec_sevenDayInfo, // 七天人数信息
                state_ec_empHubList, // 获取体验中心列表
                state_ec_systemMsg, // 系统提醒历史
                state_ec_employeeList, // 获取部门员工列表
                state_ec_promotionDetail, // 获取地推详情
                state_ec_priceAllocation, // 获取地推价格配置
                state_ec_historyDispatchInfo, // 获取面板历史派单
                state_ec_historyCheckinInfo, // 历史签到
                state_ec_historyLaborPickupInfo, // 历史劳务接走人数
                state_ec_historyAmountInfo, // 历史收费报名总计
                state_ec_brokersOnDuty, // 值班经纪人
                state_ec_brokersOnDutyEdit, // 值班经纪人出勤情况
                state_ec_departAllEmpName, // 获取集散部门所有员工名字
                state_ec_accountChangeList, // 获取接待账号的使用记录
                state_ec_driverList, // 获取司机页面数据
                state_ec_vehicleList, // 获取车辆信息
                state_ec_setData, // 设置数据的状态
                state_ec_preCount, // 预接统计列表
                state_ec_reimbursement, // 报销金额
                state_ec_deposit, // 面板页押金
                state_ec_land_manage, // 会员管理
                state_ec_new_account,
                state_broker_header_calculator,
                state_ec_bind_employee
                // state_ec_message 
            }
        }
    }
};