/**
 * 面试相关映射
 */
export default {
    // 面试结果 1、未有名单 2、不在名单  3、面试放弃  4、面试不通过   5、面试通过
    eResult: {
        1: '未有名单',
        2: '不在名单',
        3: '面试放弃',
        4: '面试不通过',
        5: '面试通过'
    },
    // albert备注，此为后台提供的需要用两个状态映射出来的面试结果字段
    eResultComplex: {
        1: {value: '未有名单', LaborListStatus: 1, InterviewStatus: 1},
        2: {value: '不在名单', LaborListStatus: 2, InterviewStatus: 1},
        3: {value: '面试放弃', LaborListStatus: 3, InterviewStatus: 4},
        4: {value: '面试不通过', LaborListStatus: 3, InterviewStatus: 3},
        5: {value: '面试通过', LaborListStatus: 3, InterviewStatus: 2}
    },
    // 工牌上传状态
    eBadgeStatus: {
        1: '未上传',
        2: '审核中',
        3: '审核通过',
        4: '审核不通过'
    },
    // 联系状态
    eCallbackStatus: {
        1: '未联系',
        2: '已联系'
    }
};