let NavConfig = {
    NAV_LIST: [
        {
            id: '11000',
            name: '工作面板',
            role: ['角色1'],
            route: '/bc/board',
            sub: []
        },
        {
            id: '12000',
            name: '订单管理',
            role: ['角色1'],
            route: '/bc/order',
            sub: [
                /* {
                    id: '12100',
                    name: '会员订单',
                    role: ['角色1'],
                    route: '/bc/order-manage/user',
                    sub: []
                },*/
                {
                    id: '12400',
                    name: '面试名单',
                    role: ['角色1'],
                    route: '/bc/order-manage/interview',
                    sub: []
                },
                {
                    id: '12600',
                    name: '厂门口接站名单',
                    role: ['角色1'],
                    route: '/bc/order-manage/factory',
                    sub: []
                },
                {
                    id: '12700',
                    name: '催结算名单',
                    role: ['角色1'],
                    route: '/bc/order-manage/labor',
                    sub: []
                } /* ,
                {
                    id: '12300',
                    name: '申诉订单',
                    role: ['角色1'],
                    route: '/bc/order-manage/complain',
                    sub: []
                }*/

            ]
        },
        {
            id: '13000',
            name: '商户管理',
            role: ['角色1'],
            route: '/bc/servicer',
            sub: [
                {
                    id: '13200',
                    name: '大老板',
                    role: ['角色1'],
                    route: '/bc/servicer/owner',
                    sub: []
                },
                {
                    id: '13300',
                    name: '劳务公司',
                    role: ['角色1'],
                    route: '/bc/servicer/company',
                    sub: []
                },
                {
                    name: '服务人员管理',
                    role: ['角色1'],
                    route: '/bc/servicer/staff',
                    sub: []
                }
            ]
        },
        {
            id: '14000',
            name: '招聘管理',
            role: ['角色1'],
            route: '/bc/recruitment',
            sub: [
                {
                    id: '15400',
                    name: '企业管理',
                    role: ['角色1'],
                    route: '/bc/recruitment/ent',
                    sub: []
                },
                {
                    id: '15500',
                    name: '每日招聘',
                    role: ['角色1'],
                    route: '/bc/recruitment/daily',
                    sub: []
                },
                {
                    id: '15600',
                    name: '招聘报价审核',
                    role: ['角色1'],
                    route: '/bc/recruitment/audit',
                    sub: []
                },
                {
                    id: '15700',
                    name: '安置方案',
                    role: ['角色1'],
                    route: '/bc/PrsonnelAllotment',
                    sub: [
                        {
                            id: '15710',
                            name: '运维分配',
                            role: ['角色1'],
                            route: '/bc/PrsonnelAllotment/BusinessAffairs',
                            sub: []
                        },
                        {
                            id: '15720',
                            name: '分配统计',
                            role: ['角色1'],
                            route: '/bc/PrsonnelAllotment/Distribution',
                            sub: []
                        }
                    ]
                }
            ]
        },
        {
            id: '18000',
            name: 'UGC审核',
            role: ['角色1'],
            route: '/bc/ugc',
            sub: []
        }, {
            id: '15000',
            name: '招工资讯',
            role: ['角色1'],
            route: '/bc/recruitment/info',
            sub: []
        },
        // {
        //     id: '17000',
        //     name: '部门委托',
        //     role: ['角色1'],
        //     route: '/bc/assistance',
        //     sub: []
        // },
        {
            id: '18000',
            name: '事件管理',
            role: ['角色1'],
            route: '/bc/event-management',
            icon: 'user',
            sub: [
                {
                    pid: '18000',
                    id: '18000',
                    name: '事件列表',
                    role: ['角色1'],
                    route: '/bc/event-management/list',
                    sub: []
                },
                {
                    pid: '18500',
                    id: '18500',
                    name: '事件百科',
                    role: ['角色1'],
                    route: '/bc/event-management/baike',
                    sub: []
                },
                // {
                //     pid: '18100',
                //     id: '18100',
                //     name: '待处理申诉列表',
                //     role: ['角色1'],
                //     route: '/bc/event-management/apeallist',
                //     sub: []
                // },
                // {
                //     pid: '18200',
                //     id: '18200',
                //     name: '事件查询',
                //     role: ['角色1'],
                //     route: '/bc/event-management/query',
                //     sub: []
                // },
                {
                    pid: '18300',
                    id: '18300',
                    name: '排班设置',
                    role: ['角色1'],
                    route: '/bc/event-management/arrange',
                    sub: []
                },
                {
                    pid: '18400',
                    id: '18400',
                    name: '报表管理',
                    role: ['角色1'],
                    route: '/bc/event-management/dayservice',
                    sub: [
                        {
                            pid: '18005',
                            id: '18005',
                            name: '每日服务',
                            role: ['角色1'],
                            route: '/bc/event-management/dayservice',
                            sub: []
                        },
                        {
                            pid: '18006',
                            id: '18006',
                            name: '事件类型统计',
                            role: ['角色1'],
                            route: '/bc/event-management/eventstype',
                            sub: []
                        }
                    ]
                }
            ]
        },
        {
            pid: '19000',
            id: '19000',
            name: '消息列表',
            role: ['角色1'],
            route: '/bc/Message',
            sub: []
        },
        {
            pid: '20000',
            id: '20000',
            name: '商务合作',
            role: ['角色1'],
            route: '/bc/cooperation',
            sub: []
        }
    ],
    INIT_NAV: '',
    ERROR_ROUTE: '/bc/board'
};
export default NavConfig;