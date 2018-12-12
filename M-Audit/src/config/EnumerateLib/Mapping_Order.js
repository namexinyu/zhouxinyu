const mapToEnum = (mapp) => (
    Object.values(mapp).reduce((result, data) => {
        result[data.value] = data.label;
        return result;
    }, {})
);
/**
 * 业务视角 订单相关状态
 */
// 申诉订单状态
export const ComplainStatus = {
    AUDIT_STATUS_ALL: {
        label: '全部', value: -9999
    },
    AUDIT_STATUS_WAIT: {
        label: '待处理', value: 1
    },
    AUDIT_STATUS_PASS: {
        label: '申诉通过', value: 2
    },
    AUDIT_STATUS_REFUSE: {
        label: '申诉驳回', value: 3
    }
};
// 申诉订单 申诉理由
export const OrderComplainType = {
    1: '金额错误', 2: '未在补贴名单', 3: '面试放弃'
};
export const ComplainStatusEnum = mapToEnum(ComplainStatus);
// export const OrderStep = {
//     1: "报名成功", 2: "预约报道", 3: "已申请接站", 4: "确定接站人", 5: "签到成功", 6: "分配劳务", 7: "等待面试结果",
//     8: "面试成功", 9: "面试失败", 10: "工牌审核中", 11: "工牌审核失败",
//     12: "未面试（终结）", 13: "放弃入职（终结）",
//     // 14: "已入职",
//     15: "已离职（终结）", 16: "离职（待领取）", 17: "已过期（终结）", 18: "已完成（终结）", 19: "申诉中",
//     20: "面试放弃（终结）", 21: "无补贴完成（终结）", 22: "入职无效（终结）", 23: "待领取",
//     24: "离职", 25: "放弃入职", 26: "领取已过期", 27: "已领取", 28: "申诉结款"
// };
export const OrderStep = {
    5: "签到", 6: "待面试",
    12: "未面试", 8: '面试成功', 20: '面试放弃', 9: '面试失败',
    21: "无补贴", 22: "入职无效", 16: "离职（待领取）", 23: "在职（待领取）",
    17: "已过期", 24: "离职", 27: "已领取", 25: "放弃入职"
};
// 劳务订单交易状态
export const LaborOrderSettleStatus = {
    LABOR_ORDER_TRADE_STATUS_ALL: {
        label: '全部', value: -9999
    },
    LABOR_ORDER_TRADE_STATUS_WAIT: {
        label: '待结算', value: 1 // 1:待计算（已结算人数=0)
    },
    LABOR_ORDER_TRADE_STATUS_SETTLING: {
        label: '结算中', value: 2 // 2：结算中（已结算人数<输送人数）
    },
    LABOR_ORDER_TRADE_STATUS_SETTLED: {
        label: '已结算', value: 3 // 3：已结算(已结算人数=输送人数)
    }
};
export const LaborOrderSettleStatusEnum = mapToEnum(LaborOrderSettleStatus);

// 劳务订单状态
export const PromiseSettleDelay = {
    'AUDIT_STATUS_ALL': {
        label: '全部', value: -9999
    },
    'AUDIT_STATUS_NORMAL': {
        label: '正常', value: 1
    },
    'AUDIT_STATUS_POSTPONED': {
        label: '延期', value: 2
    }
};
export const PromiseSettleDelayEnum = mapToEnum(PromiseSettleDelay);

// 审核状态
export const AuditStatusEnum = {
    0: '未审核', 1: '审核通过', 2: '审核未通过'
};