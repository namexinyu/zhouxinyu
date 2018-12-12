let NavConfig = {
    NAV_LIST: [
        {
            id: '11000',
            name: '概况',
            role: ['角色1'],
            route: '/fc/overview',
            sub: []
        },
        {
            id: '12000',
            name: '交易管理',
            role: ['角色1'],
            route: '/fc/trade-manage',
            sub: [
                /*            {
                                id: '12100',
                                name: '会员订单',
                                role: ['角色1'],
                                route: '/fc/trade-manage/user',
                                sub: []
                            },
                            {
                                id: '12200',
                                name: '劳务订单',
                                role: ['角色1'],
                                route: '/fc/trade-manage/labor',
                                sub: []
                            },*/
                {
                    id: '12100',
                    name: '面试名单',
                    role: ['角色1'],
                    route: '/fc/trade-manage/interview',
                    sub: []
                },
                {
                    id: '12200',
                    name: '补贴管理',
                    role: ['角色1'],
                    route: '/fc/trade-manage/subsidy',
                    sub: []
                },
                {
                    id: '12300',
                    name: '异常补贴管理',
                    role: ['角色1'],
                    route: '/fc/trade-manage/abnormal-subsidy',
                    sub: []
                },
                {
                    id: '12400',
                    name: '推荐费管理',
                    role: ['角色1'],
                    route: '/fc/trade-manage/invite',
                    sub: []
                },
                {
                    id: '12500',
                    name: '收退费管理',
                    role: ['角色1'],
                    route: '/fc/trade-manage/fees',
                    sub: []
                },
                {
                    id: '12600',
                    name: '结算报表',
                    role: ['角色1'],
                    route: '/fc/trade-manage/Settlement',
                    sub: []
                }
                /*            {
                                id: '12500',
                                name: '报销订单',
                                role: ['角色1'],
                                route: '/fc/trade-manage/dispatch',
                                sub: []
                            },
                            {
                                id: '12600',
                                name: '赠品押金',
                                role: ['角色1'],
                                route: '/fc/trade-manage/giftfee',
                                sub: []
                            },
                            {
                                id: '12700',
                                name: '申诉订单',
                                role: ['角色1'],
                                route: '/fc/trade-manage/complain',
                                sub: []
                            },*/

            ]
        },
        {
            id: '13000',
            name: '对账管理',
            role: ['角色1'],
            route: '/fc/reconcile-manage',
            sub: [
                {
                    id: '13100',
                    name: '服务费账单',
                    role: ['角色1'],
                    route: '/fc/reconcile/service-bill',
                    sub: []
                },
                {
                    id: '13200',
                    name: '服务费明细',
                    role: ['角色1'],
                    route: '/fc/reconcile/bill-detail',
                    sub: []
                },
                {
                    id: '13300',
                    name: '结算异常明细',
                    role: ['角色1'],
                    route: '/fc/reconcile/settle-abnormal',
                    sub: []
                }
            ]
        },
        {
            id: '14000',
            name: '账户管理',
            role: ['角色1'],
            route: '/fc/account-manage',
            sub: [
                {
                    id: '14100',
                    name: '劳务账户',
                    role: ['角色1'],
                    route: '/fc/account/labor-account',
                    sub: []
                },
                {
                    id: '14200',
                    name: '会员提现',
                    role: ['角色1'],
                    route: '/fc/account/withdraw',
                    sub: []
                },
                {
                    id: '14300',
                    name: '退回列表',
                    role: ['角色1'],
                    route: '/fc/account/bank-back',
                    sub: []
                },
                {
                    id: '14400',
                    name: '一分钱测试',
                    role: ['角色1'],
                    route: '/fc/account/penny',
                    sub: []
                }
            ]
        },
        {
            id: '15000',
            name: '招工资讯',
            role: ['角色1'],
            route: '/fc/recruitment-info',
            sub: []
        },
        // {
        //     id: '17000',
        //     name: '部门委托',
        //     role: ['角色1'],
        //     route: '/fc/assistance',
        //     sub: []
        // },
        {
            name: '事件管理',
            role: ['角色1'],
            route: '/fc/event-management',
            sub: [
                {
                    name: '事件列表',
                    role: ['角色1'],
                    route: '/fc/event-management/list',
                    sub: []
                }
            ]
        }
    ],
    INIT_NAV: '',
    ERROR_ROUTE: '/fc/board'
};
export default NavConfig;