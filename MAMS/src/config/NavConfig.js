const role = {
    BROKER: 'Broker',
    BROKER_TMP_SUPER: 'BrokerSuper'
};
let NavConfig = {
    NAV_LIST: [
        {
            id: '11000',
            name: '工作面板',
            role: [role.BROKER],
            route: '/broker/board',
            icon: 'code-o',
            sub: []
        },
        {
            name: '需求',
            role: [role.BROKER],
            route: '/broker/need-do',
            icon: 'edit',
            extraType: 'need',
            sub: []
        },
        {
            id: '12000',
            name: '招工资讯',
            role: [role.BROKER],
            route: '/broker/recruit/info',
            icon: 'credit-card',
            sub: []
        },
        {
            id: '13000',
            name: '跟踪名单',
            role: [role.BROKER],
            route: '/broker/track',
            icon: 'customer-service',
            sub: [
                {
                    id: '13100',
                    name: '口袋名单',
                    role: [role.BROKER],
                    route: '/broker/track/bag-list',
                    sub: []
                },
                {
                    id: '13200',
                    name: '预签到名单',
                    role: [role.BROKER],
                    route: '/broker/track/estimate-sign',
                    sub: []
                },
                {
                    id: '13300',
                    name: '派车单跟踪',
                    role: [role.BROKER],
                    route: '/broker/track/send-car',
                    sub: []
                },
                // {
                //     id: '13400',
                //     name: '签到名单',
                //     role: [role.BROKER],
                //     route: '/broker/track/sign',
                //     sub: []
                // },
                {
                    id: '13500',
                    name: '面试名单',
                    role: [role.BROKER],
                    route: '/broker/track/interview',
                    sub: []
                },
                {
                    id: '13600',
                    name: '厂门口接站',
                    role: [role.BROKER],
                    route: '/broker/track/factory',
                    sub: []
                }
            ]
        },
        {
            id: '14000',
            name: '会员管理',
            role: [role.BROKER],
            route: '/broker/member',
            icon: 'contacts',
            sub: [
                {
                    pid: '14000',
                    id: '14100',
                    name: '我的会员',
                    role: [role.BROKER],
                    route: '/broker/member/my',
                    sub: []
                },
                {
                    pid: '14000',
                    id: '14200',
                    name: '转人申请',
                    role: [role.BROKER],
                    route: '/broker/transfer-apply',
                    sub: []
                }
            ]
        },
        {
            id: '15000',
            name: '财务报销',
            role: [role.BROKER],
            route: '/broker/finance',
            icon: 'pay-circle-o',
            sub: [
                {
                    pid: '15000',
                    id: '15100',
                    name: '会员补贴',
                    role: [role.BROKER],
                    route: '/broker/finance/subsidy',
                    sub: []
                },
                {
                    pid: '15000',
                    id: '15200',
                    name: '推荐费',
                    role: [role.BROKER],
                    route: '/broker/finance/recommendation',
                    sub: []
                }
            ]
        },
        // {
        //     id: '16000',
        //     name: '发号施令',
        //     role: [role.BROKER],
        //     route: '/broker/assistance',
        //     icon: 'notification',
        //     sub: []
        // },
        /* ,
        {
            id: '17000',
            name: '划转会员',
            role: [role.BROKER_TMP_SUPER],
            route: '/broker/manager/transfer',
            sub: []
        }*/
        {
            id: '16000',
            name: '经纪生涯',
            role: [role.BROKER],
            route: '/broker/career',
            icon: 'coffee',
            sub: [
                {
                    pid: '16000',
                    id: '16100',
                    name: '绩效查询',
                    role: [role.BROKER],
                    route: '/broker/career/performance',
                    sub: []
                }
            ]
        },
        {
            id: '17000',
            name: '提问回复',
            role: [role.BROKER],
            route: '/broker/question-reply',
            icon: 'user',
            sub: []
        },
        {
            id: '18000',
            name: '事件管理',
            role: [role.BROKER],
            route: '/broker/event-management',
            icon: 'user',
            sub: [
                {
                    pid: '18001',
                    id: '18001',
                    name: '事件列表',
                    role: [role.BROKER],
                    route: '/broker/event-management/list',
                    sub: []
                },
                {
                    pid: '18000',
                    id: '18002',
                    name: '事件百科',
                    role: [role.BROKER],
                    route: '/broker/event-management/Wiki',
                    sub: []
                }
            ]
        },
        {
            id: '19000',
            name: '考试测验',
            role: [role.BROKER],
            route: '/broker/exam',
            icon: 'code',
            sub: []
        },
        {
            id: '20000',
            name: '消息列表',
            role: [role.BROKER],
            route: '/broker/message',
            icon: 'user',
            sub: []
        }
    ],
    INIT_NAV: ''
};
export default NavConfig;