// 待办类型
export default {
    // 待办类型 对 回复联系记录 映射关系
    needTodoTypeMapperToCallType: {
        1: 9,
        2: 8,
        3: 2,
        4: 3,
        5: 7,
        6: 6,
        7: 13,
        8: 10
    },

    type: {
        1: '一键导航', // -tbUserSOS. eSOSType=2
        2: '明日签到', // - tbDispatchOrder
        3: '报名', // -tbInterview
        4: '关注', // -tbUserFollow
        5: '提问', // -tbUserAsk
        6: '反馈', // -tbUserFeedback
        7: '求助', // -tbInvite
        8: '提醒打卡' // -?
    }
};