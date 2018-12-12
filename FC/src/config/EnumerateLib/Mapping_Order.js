const mapToEnum = (mapp) => (
    Object.values(mapp).reduce((result, data) => {
        result[data.value] = data.label;
        return result;
    }, {})
);
/**
 * 财务视角 订单相关状态
 */

// 审核状态
export const AuditStatus = {
    1: '待审核', 2: '审核通过', 3: '审核未通过'
};

// 审核状态
export const AuditStatusNew = {
    1: '新建待审核', 2: '待审核', 3: '审核通过', 4: '审核未通过'
};
export const OrderStep = {
    5: "已签到", 6: "待面试",
    12: "未面试", 8: '面试成功', 20: '面试放弃', 9: '面试失败',
    21: "无补贴", 22: "入职无效", 16: "离职（待领取）", 23: "在职（待领取）",
    17: "已过期", 24: "离职", 25: "放弃入职",
    26: '正常', 27: '延期', 28: '漏返', 29: '未结完', 30: '少返', 31: '呆帐', 32: '作废'
};

export const JFFInterviewStatus = new Map([
    [0, '未处理'],
    [1, '未面试'],
    [2, '通过'],
    [3, '未通过'],
    [4, '放弃']
]);
// 面试订单结算状态
export const InterviewSettleStatus = new Map([
    [1, '待结算'],
    [2, '已结算'],
    [3, '结算中']
]);

// 开票状态
export const InvoiceStatus = {
    1: '未开票', 2: '已开票', 3: '部分开票'
};

// 订单结算状态
export const OrderSettleStatus = {
    1: '待结算', 2: '结算中', 3: '已结算'
};

// 劳务订单状态
export const PromiseSettleDelay = {
    1: '正常', 2: '延期'
};

// 派单类型
export const PickupMode = {
    1: '我打司机（集散代派）', 2: '滴滴（集散代派）', 3: '出租车（会员自叫）'
};// 派单类型
export const ServiceInterviewStatus = new Map([
    [0, '未处理'],
    [1, '待定/面试失联'],
    [2, '正常入职'],
    [3, '未通过'],
    [4, '放弃']
]);