let Role = {
    AUDITOR: 'Audit',
    AUDIT_SUPERVISOR: 'AuditSupervisor',
    CUSTOMER_SERVICE: 'AduitService'
};
let NavConfig = {
    NAV_LIST: [
        {
            id: '11001',
            name: '工作面板',
            role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
            route: '/audit/board',
            sub: []
        },
        {
            id: '11000',
            name: '今日审核',
            role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
            route: '/audit/board',
            sub: [
                {
                    id: '11100',
                    name: '身份证审核',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/operate/idCard',
                    sub: []
                },
                {
                    id: '11200',
                    name: '银行卡审核',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/operate/bankCard',
                    sub: []
                },
                {
                    id: '11300',
                    name: '工牌审核',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/operate/workerCard',
                    sub: []
                },
                {
                    id: '11400',
                    name: '考勤审核',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/operate/attendance',
                    sub: []
                }
                // {
                //     id: '11500',
                //     name: '错误重审',
                //     role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                //     route: '/audit/operate/review',
                //     sub: []
                // }
            ]
        },
        {
            id: '12000',
            name: '审核列表',
            role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
            route: '/audit/list',
            sub: [
                {
                    id: '12100',
                    name: '身份证审核列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/list/idCard',
                    sub: []
                },
                {
                    id: '12200',
                    name: '银行卡审核列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/list/bankCard',
                    sub: []
                },
                {
                    id: '12300',
                    name: '工牌审核列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/list/workerCard',
                    sub: []
                },
                {
                    id: '12400',
                    name: '考勤审核列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/list/attendance',
                    sub: []
                },
                {
                    id: '12500',
                    name: '样例设置',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR],
                    route: '/audit/list/example',
                    sub: []
                }
            ]
        },
        {
            id: '13001',
            name: '客服回访',
            role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
            route: '/audit/callback',
            sub: [
                {
                    id: '13101',
                    name: '入职回访',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
                    route: '/audit/callback/entry',
                    sub: []
                },
                {
                    id: '13102',
                    name: '400投诉列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
                    route: '/audit/callback/feedback',
                    sub: []
                }
            ]
        },
        // {
        //     id: '14001',
        //     name: '部门委托',
        //     role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
        //     route: '/audit/assistance',
        //     sub: []
        // }, 
        {
            id: '15000',
            name: '事件管理',
            role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
            route: '/audit/event-management',
            icon: 'user',
            sub: [
                {
                    id: '15100',
                    name: '事件列表',
                    role: [Role.AUDITOR, Role.AUDIT_SUPERVISOR, Role.CUSTOMER_SERVICE],
                    route: '/audit/event-management/list',
                    sub: []
                }
            ]
        }
    ],
    INIT_NAV: '',
    ERROR_ROUTE: '/audit/board'
};
export default NavConfig;