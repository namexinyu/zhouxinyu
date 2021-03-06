/**
 * 注册会员相关映射表
 */
export default {
    // 性别
    eGender: {
        0: '未知',
        1: '男',
        2: '女'
    },
    // 注册来源
    eRegSource: {
        0: '网站',
        1: 'APP',
        2: '地推',
        3: 'wifi',
        4: '代注册',
        5: '门店',
        6: '无线网',
        7: '活动'
    },
    // 会员认证状态
    eCertStatus: {
        0: '未认证',
        1: '已认证'
    },
    // 认证方式
    eCertType: {
        0: '未认证',
        1: '现场认证',
        2: '手持认证',
        3: '辅助认证'
    },
    // 锁定状态
    eLockStatus: {
        0: '未锁定',
        1: '已锁定'
    },
    // 是否禁言
    eShutup: {
        0: '未禁言',
        1: '已禁言'
    },
    // 推荐状态
    eInviteStatus: {
        0: '未注册',
        1: '已注册',
        2: '已入职',
        3: '作废'
    },
    // 经纪人视角的会员状态
    eBrokerStatus: {
        1: '从未体验',
        2: '预报名',
        3: '派车',
        4: '签到',
        5: '面试',
        6: '入职'
    },
    // 会员推荐来源
    eRecommendSource: {
        0: 'App',
        1: '代推荐'
    },
    // todo根据 eBrokerStatus 的 CurrentStatus
    eBrokerStatus_CurrentStatus: {
        2: {
            1: '未结案',
            2: '已结案'
        },
        4: {
            0: '未处理',
            1: '已确认',
            2: '未接电话',
            3: '空号',
            4: '放弃',
            5: '换厂',
            6: '延期',
            7: '停关机'
        },
        5: {
            0: '未处理',
            1: '未面试',
            2: '通过',
            3: '未通过',
            4: '放弃'
        },
        3: {
            1: '等待接站',
            2: '已派单（等司机接单）',
            3: '准备中（司机）',
            4: '已出发（司机）',
            5: '已接到 终结状态',
            6: '未接到',
            7: '已送达',
            8: '已过期'
        },
        6: {
            0: '未处理',
            1: '入职',
            2: '失联',
            3: '未通过',
            4: '放弃',
            5: '待定',
            6: '未面试'
        }
    }
};