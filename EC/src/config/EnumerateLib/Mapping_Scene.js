/**
 * 现场管理下相关映射
 */
export default {
    // 是否退费
    // 1、未退费； 2、已退费
    eWhetherInterviewRefund: {
        1: '未退费',
        2: '已退费'
    },
    // 	是否被劳务刷机
    // 1、是； 2、否
    eWhetherLabor: {
        1: '是',
        2: '否'
    },
    // 收费支付方式，此处跟产品确认，目前体验中心收费只走现金
    eChargePayType: {
        // 1: 'APP余额',
        2: '现金'
    },
    // 退费支付方式
    eRefundPayType: {
        1: 'APP余额',
        2: '现金'
    },
    // 退费时选择的面试状态
    eRefundReason: {
        1: '面试放弃',
        2: '未面试',
        3: '面试失败'
    },
    // 物品发放领取方式
    // 1、押金方式 2、工牌
    eSupplyGetType: {
        1: '押金',
        2: '工牌'
    }
    // 物品发放支付方式(考虑收费应统一，使用eChargePayType)
    // eSupplyPayType: {
    //     1: '虚拟帐号扣款',
    //     2: '现金'
    // }
};


