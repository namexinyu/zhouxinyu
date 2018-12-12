const mams = {
    "broker": {
        apiPath: '',
        systemPath: '/broker/login',
        accountKey: '',
        name: '经纪人工作台',
        department: '经纪人部门',
        buildAssistance: true, // 新增委托权限
        acceptAssistance: false // 接收委托权限
    },
    "hub": {
        apiPath: '/CM_WorkbenchLoading/WD_COMM_GetEmpHubList',
        systemPath: '/ec/redirect',
        accountKey: 'HubList',
        name: '体验中心工作台',
        department: '体验中心部门',
        buildAssistance: false,
        acceptAssistance: false
    },
    "finance": {
        apiPath: '/CM_WorkbenchLoading/WD_COMM_GetEmpFinanceList',
        systemPath: '/fc/redirect',
        accountKey: 'FinanceList',
        name: '财务工作台',
        department: '财务部门',
        buildAssistance: false,
        acceptAssistance: true
    },
    "biz": {
        apiPath: '/CM_WorkbenchLoading/WD_COMM_GetEmpSalesList',
        systemPath: '/bc/redirect',
        accountKey: 'SalesList',
        name: '业务工作台',
        department: '业务部门',
        buildAssistance: false,
        acceptAssistance: true
    },
    "op": {
        apiPath: '',
        systemPath: '/op/login',
        accountKey: '',
        name: '运维工作台',
        department: '运维部门',
        buildAssistance: false,
        acceptAssistance: false
    },
    "audit": {
        apiPath: '',
        systemPath: '/audit/login',
        accountKey: '',
        name: '审核工作台',
        department: '审核部门',
        buildAssistance: false,
        acceptAssistance: false
    },
    "hr": {
        apiPath: '',
        systemPath: '/hr/login',
        accountKey: '',
        name: '人事工作台',
        department: '人事部门',
        buildAssistance: false,
        acceptAssistance: false
    },
    "brokerass": {
        apiPath: '',
        systemPath: '/broker/login',
        accountKey: '',
        name: '经纪人助理工作台',
        department: '经纪人助理部门',
        buildAssistance: false,
        acceptAssistance: false
    }

};
const CurrentPlatformCode = 'biz';
export {CurrentPlatformCode};
export default mams;