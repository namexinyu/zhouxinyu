let Role = {
    MANAGER: 'HubManager',
    DIRECTOR: 'HubSupervisor'
};

let NavConfig = {
    NAV_LIST: [
        {
            id: '11000',
            name: '体验中心概况',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/work-bench',
            sub: []
        },
        {
            id: '12000',
            name: '接站管理',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/station',
            sub: [
                {
                    id: '12100',
                    name: '派单跟踪',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/dispatch-track',
                    sub: []
                },
                {
                    id: '12200',
                    name: '预接统计',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/pre-count',
                    sub: []
                },
                {
                    id: '12300',
                    name: '地址管理',
                    role: [Role.MANAGER],
                    route: '/ec/main/address-manage',
                    sub: []
                }
            ]
        },
        {
            id: '13000',
            name: '现场管理',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/scene',
            sub: [
                {
                    id: '13100',
                    name: '会员签到',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/sign-list',
                    sub: []
                },
                {
                    id: '13200',
                    name: '招工资讯',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/recruit-info',
                    sub: []
                },
                {
                    id: '13300',
                    name: '出发时间',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/recruit-time-info',
                    sub: []
                },
                // {
                //     id: '13400',
                //     name: '劳务接人',
                //     role: [Role.MANAGER, Role.DIRECTOR],
                //     route: '/ec/main/pick-list',
                //     sub: []
                // },
                {
                    id: '13500',
                    name: '物品发放',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/supply',
                    sub: []
                }
            ]
        },
        {
            id: '15000',
            name: '每日交账',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/bill-list',
            sub: []
        },
        {
            id: '14000',
            name: '资源管理',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/resource',
            sub: [
                {
                    pid: '14000',
                    id: '14100',
                    name: '部门员工管理',
                    role: [Role.MANAGER],
                    route: '/ec/main/department-staff',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14200',
                    name: '员工管理',
                    role: [Role.DIRECTOR],
                    route: '/ec/main/staff-manage',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14300',
                    name: '司机管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/driver-manage',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14400',
                    name: '车辆管理',
                    role: [Role.MANAGER],
                    route: '/ec/main/car-manage',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14500',
                    name: '地推详情',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/promotion-detail',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14600',
                    name: '值班经纪人',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/duty-broker',
                    sub: []
                }
            ]
        },
        {
            id: '15000',
            name: '班车管理',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/main/ShuttleBus',
            sub: [
                {
                    pid: '15000',
                    id: '15100',
                    name: '班次管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/BusSchedule',
                    sub: []
                },
                {
                    pid: '15000',
                    id: '15200',
                    name: '租车公司管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/BusRenter',
                    sub: []
                },
                {
                    pid: '15000',
                    id: '15300',
                    name: '车型管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/BusType',
                    sub: []
                },
                {
                    pid: '15000',
                    id: '15400', 
                    name: '报价管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/Busoffer',
                    sub: []
                },
                {
                    pid: '15000',
                    id: '15500',
                    name: '订单管理',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/BusOrder',
                    sub: []
                }
            ]
        },
        {
            name: '事件管理',
            id: '16000',
            role: [Role.MANAGER, Role.DIRECTOR],
            route: '/ec/event-management',
            sub: [
                {
                    name: '事件列表',
                    id: '16500',
                    pid: '16000',
                    role: [Role.MANAGER, Role.DIRECTOR],
                    route: '/ec/main/event-management/list',
                    sub: []
                }
            ]
        }
        // {
        //     id: '15000',
        //     name: '部门委托',
        //     role: [Role.MANAGER, Role.DIRECTOR],
        //     route: '/ec/main/assistance',
        //     sub: []
        // }
        // ,
        // {
        //     id: '16000',
        //     name: '绩效',
        //     role: [Role.MANAGER, Role.DIRECTOR],
        //     route: '/ec/main/test',
        //     sub: []
        // }
    ],
    // INIT_NAV: ''
    
    INIT_NAV: {
        id: '11000',
        name: '体验中心概况',
        role: [Role.MANAGER, Role.DIRECTOR],
        route: '/ec/main/work-bench',
        sub: []
    }
};
export default NavConfig;