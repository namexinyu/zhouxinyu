/**
 * 针对经纪人工作台，我的会员列表
 */
export default {
    IsCert: [
        {
            value: -9999,
            text: '全部'
        },
        {
            value: 1,
            text: '已认证'
        },
        {
            value: 2,
            text: '非认证'
        }
    ],
    TimeInterval: [
        {
            value: -9999,
            text: '全部'
        },
        {
            value: 1,
            text: '3天内未联系'
        },
        {
            value: 2,
            text: '十天内未联系'
        },
        {
            value: 3,
            text: '一个月内未联系'
        },
        {
            value: 4,
            text: '三个月内未联系'
        },
        {
            value: 5,
            text: '半年内未联系'
        }
    ],
    Status: [
        {
            value: -9999,
            text: '全部'
        },
        {
            value: 1,
            text: '从未体验'
        },
        {
            value: 2,
            text: '预报名'
        },
        {
            value: 3,
            text: '接站'
        },
        {
            value: 4,
            text: '签到'
        },
        {
            value: 5,
            text: '面试'
        },
        {
            value: 6,
            text: '入职'
        }
    ],
    WorkState: [
        {
            value: -9999,
            text: '全部'
        },
        {
            value: 1,
            text: '已入职'
        },
        {
            value: 2,
            text: '未入职'
        }
    ],
    Source: [ // 和 config/EnumerateLib/Mapping_User/eRegSource 对应
        {
            value: -9999,
            text: '全部'
        },
        {
            value: 0,
            text: '网站'
        }, {
            value: 1,
            text: 'APP'
        },
        {
            value: 2,
            text: '地推'
        },
        {
            value: 3,
            text: 'wifi'
        },
        {
            value: 4,
            text: '代注册'
        },
        {
            value: 5,
            text: '门店'
        },
       /* {
            value: 6,
            text: '无线网'
        },*/
        {
            value: 7,
            text: 'APP推荐'
        },
        {
            value: 8,
            text: '代推荐'
        },
        {
            value: 9,
            text: '门店推荐'
        },
        {
            value: 10,
            text: '现场刷机'
        }
    ]
};