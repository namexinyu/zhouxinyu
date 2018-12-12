const role = {
  BOSS: 'BrokerBoss',
  MANAGER: 'BrokerManager',
  MANAGER_ASSIST: 'BrokerManagerAssist',
  ASSISTANT: 'BrokerSupervisor',
  BROKER_SUPER: 'BrokerSuper'
};

let NavConfig = {
  NAV_LIST: [
    {
      id: '11000',
      name: '概况',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
      route: '/ac/board',
      sub: []
    },
    {
      id: '12000',
      name: '经纪人管理',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
      route: '/ac/broker',
      sub: [
        {
          id: '12100',
          name: '待办列表',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/broker/need-do-list',
          sub: []
        },
        {
          id: '12300',
          name: '绩效查询',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
          route: '/ac/broker/performance',
          sub: []
        }
      ]
    },
    {
      id: '13000',
      name: '日常工作',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
      route: '/ac/daily',
      sub: [
        {
          id: '13100',
          name: '招工资讯',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/daily/recruitment-info',
          sub: []
        },
        {
          id: '13400',
          name: '口袋名单',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/daily/bag-list',
          sub: []
        },
        {
          id: '13200',
          name: '企业情况',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/daily/business',
          sub: []
        },
        {
          id: '13300',
          name: '会员需求',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/daily/memberneed',
          sub: []
        },
        {
          id: '13400',
          name: '预签到名单',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/daily/pick-up',
          sub: []
        },
        {
          id: '13500',
          name: '面试名单',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/daily/interview',
          sub: []
        }
      ]
    },
    {
      id: '14000',
      name: '会员管理',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
      route: '/ac/member',
      sub: [
        {
          id: '14100',
          name: '会员列表',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/member/list',
          sub: []
        },
        // transfer-log
        {
          id: '14200',
          name: '转人日志',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/member/transfer-log',
          sub: []
        },
        {
          id: '14300',
          name: '会员归属批量拆分',
          role: [role.BROKER_SUPER],
          route: '/ac/member/batch-split',
          sub: []
        }
        // {
        //     id: '14400',
        //     name: '会员归属拆分日志',
        //     role: [role.ASSISTANT, role.BOSS, role.MANAGER],
        //     route: '/ac/member/split-log',
        //     sub: []
        // }
      ]
    },
    {
      id: '15000',
      name: '工作报表',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
      // route: '/ac/report',
      sub: [
        {
          id: '15100',
          name: '每日面试统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/interview',
          sub: []
        },
        {
          id: '15600',
          name: '每日入职统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/employed',
          sub: []
        },
        {
          id: '15700',
          name: '每日推荐统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/recommend',
          sub: []
        },
        {
          id: '15200',
          name: '明日预接站统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/pick-up',
          sub: []
        },
        {
          id: '15300',
          name: '经纪人每日面试统计数',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/broker/everysign',
          sub: []
        },

        {
          id: '15400',
          name: '红绿榜PK',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/broker/performance-pk',
          sub: []
        },
        {
          id: '15500',
          name: '门店排班',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/broker/attendance',
          sub: []
        },
        {
          id: "15600",
          name: '经纪人排班',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/schedule',
          sub: []
        },
        {
          id: '15700',
          name: '空号移除统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/removeMobile',
          sub: []
        },
        {
          id: '15400',
          name: '预签到走向',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST, role.BROKER_SUPER],
          route: '/ac/report/presign-trace',
          sub: []
        }
      ]
    },
    {
      id: '16000',
      name: '工厂标签管理',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER],
      route: '/ac/tags',
      sub: [
        {
          id: '16100',
          name: '标签库',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/tags/list',
          sub: []
        },
        {
          id: '16200',
          name: '标签匹配',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/tags/match',
          sub: []
        }]
    },
    {
      id: '17000',
      name: '考试结果统计',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER],
      route: '/ac/result',
      sub: [
        {
          id: '17100',
          name: '会员考试结果统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/result/member',
          sub: []
        },
        {
          id: '17200',
          name: '企业考试结果统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/result/factory',
          sub: []
        },
        {
          id: '17300',
          name: '不熟悉会员统计',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER],
          route: '/ac/result/exam',
          sub: []
        }

      ]
    },
    {
      id: '18000',
      name: '经纪人账号管理',
      role: [role.BROKER_SUPER, role.MANAGER_ASSIST],
      route: '/ac/account',
      sub: [
        {
          id: '18100',
          name: '账号查询',
          role: [role.BROKER_SUPER, role.MANAGER_ASSIST],
          route: '/ac/account/list',
          sub: []
        },
        {
          id: '18200',
          name: '操作日志',
          role: [role.BROKER_SUPER, role.MANAGER_ASSIST],
          route: '/ac/account/log',
          sub: []
        }
      ]
    },
    {
      id: '19000',
      name: '战队部门管理',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
      route: '/ac/departgroup',
      sub: [
        {
          id: '19100',
          name: '经纪中心部门管理',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
          route: '/ac/departgroup/department-manage',
          sub: []
        },
        {
          id: '19200',
          name: '经纪中心战队管理',
          role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.BROKER_SUPER],
          route: '/ac/departgroup/group-manage',
          sub: []
        }
      ]
    },
    {
      name: '事件管理',
      // role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST],
      role: [role.ASSISTANT, role.MANAGER],
      route: '/ac/event-management',
      icon: 'user',
      sub: [
        {
          name: '事件列表',
          // role: [role.ASSISTANT, role.BOSS, role.MANAGER, role.MANAGER_ASSIST],
          role: [role.ASSISTANT, role.MANAGER],
          route: '/ac/event-management/list',
          sub: []
        }
      ]
    },
    {
      id: '20000',
      name: '消息列表',
      role: [role.ASSISTANT, role.BOSS, role.MANAGER],
      route: '/ac/message',
      sub: []
    }
  ],
  INIT_NAV: '',
  ERROR_ROUTE: '/ac/board'
};
export { role };
export default NavConfig;
