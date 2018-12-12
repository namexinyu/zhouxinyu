import React from 'react';

export default {
    PickupStatus: {
        1: '等待处理',
        2: '已处理',
        3: '已接到',
        4: '未接到',
        5: '已送达'
    },
    IsSign: {
        1: "未签到",
        2: "已签到"
    },
    CheckinCloseStatus: {
        1: '已签到未面试',
        2: "已去面试",
        3: "未面试"
    },
    WorkCardStatus: {
        1: "审核中",
        2: "审核通过",
        3: "审核失败",
        4: "未上传"
    },
    CountdownStatus: {
        0: '未开启',
        1: "进行中",
        2: "已结束",
        3: "未进行"
    },
    SubsidyStatus: {
        1: "未领取",
        2: "已领取",
        3: "领取失败"
    },
    ComplainStatus: {
        1: "申诉中",
        2: "申诉失败",
        3: "申诉成功"
    },
    PickupMode: {
        1: "我打派车",
        2: "代派滴滴",
        3: "会员打车"
    },
    ContactStatus: {
        1: "未联系",
        2: "已联系",
        3: "联系不上",
        4: '停关机',
        5: '空号',
        6: '放弃'
    },
    ReType: {
        1: "一键导航",
        // 2: "明日签到",
        3: "报名",
        4: '关注',
        5: '提问',
        6: '反馈',
        7: '求助',
        8: '提醒打卡'
    },
    InterviewStatus: {
        0: '未处理',
        1: '待确认',
        2: '正常入职',
        3: '不通过',
        4: '放弃'
    },
    BrokerInterviewStatus: {
        0: '未处理',
        2: '通过',
        3: '未通过',
        4: '放弃'
    },
    JFFInterviewStatus: {
        0: '未处理',
        1: '未面试',
        2: '通过',
        3: '未通过',
        4: '放弃'
    },
    CaseStatus: {
        1: '已入职',
        2: '急需找工作',
        3: 'QQ微信回访',
        4: '已有工作',
        5: '鸽子专业户',
        6: '学生',
        7: '放弃',
        8: '年后来面试'
    },
    DayDealStatus: {
        1: '已处理',
        2: '未处理'
    },
    DisposeStatus: {
        1: '成功',
        2: '该会员已装入口袋',
        3: '该会员不属于该经纪人',
        4: '更新消息流水错误',
        5: '跟新职位报名信息错误',
        6: '更新消息流水和更新职位报名信息均发生错误',
        7: '产生口袋名单错误',
        8: '数据库异常错误'
    }
};