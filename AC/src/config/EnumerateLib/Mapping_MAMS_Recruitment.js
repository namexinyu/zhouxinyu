/**
 * 各工作台统一的招工资讯相关映射
 */
// 会员角度的筛选字段枚举值
const Mapping_MAMS_Recruit_User = {
    // 犯罪记录
    euCriminalList: [
        {key: "1", value: "有"},
        {key: "2", value: "没有"}
    ],

    // 听说读写(英文)
    euCharactersList: [
        {key: "1", value: "会"},
        {key: "2", value: "不会"}
    ],

    // 无尘服
    euClothesList: [
        {key: "1", value: "接受穿"},
        {key: "2", value: "不接受穿"}
    ],
    // 体内金属
    euForeignBodiesList: [
        {key: "1", value: "有"},
        {key: "2", value: "没有"}
    ],
    // 简单算数
    euMathList: [
        {key: "1", value: "会"},
        {key: "2", value: "不会"}
    ],
    // 身份证类型
    euIDCardTypeList: [
        {key: "1", value: "有磁"},
        {key: "2", value: "无磁"},
        {key: "4", value: "临时"}
    ],
    // 身份证类型
    euEducationList: [
        {key: "1", value: "小学"},
        {key: "2", value: "初中"},
        {key: "4", value: "高中"},
        {key: "8", value: "大专"},
        {key: "16", value: "本科及以上"}
    ],
    // 纹身
    euTattooList: [
        {key: "1", value: "手部有"},
        {key: "2", value: "手臂有"},
        {key: "4", value: "上身有"},
        {key: "8", value: "有攻击性图案"}
    ],
    // 烟疤
    euSmokeScarList: [
        {key: "1", value: "手部有"},
        {key: "2", value: "手臂有"},
        {key: "4", value: "上身有"}
    ],
    euNationInfoList: ["阿昌族", "鄂温克族", "傈僳族", "水族", "白族", "高山族", "珞巴族", "塔吉克族", "保安族", "仡佬族", "满族", "塔塔尔族", "布朗族", "哈尼族", "毛南族", "土家族", "布依族", "哈萨克族", "门巴族", "土族", "朝鲜族", "汉族", "蒙古族", "佤族", "达斡尔族", "赫哲族", "苗族", "维吾尔族", "傣族", "回族", "仫佬族", "乌孜别克族", "德昂族", "基诺族", "纳西族", "锡伯族", "东乡族", "京族", "怒族", "瑶族", "侗族", "景颇族", "普米族", "彝族", "独龙族", "柯尔克孜族", "羌族", "裕固族", "俄罗斯族", "拉祜族", "撒拉族", "藏族", "鄂伦春族", "黎族", "畲族", "壮族"]
};

const getEnum = (list) => {
    if (!list) return {};
    return list.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});
};

const transferBinaryEnum = (val, valEnum) => {
    if (!val || val != parseInt(val, 10) || !valEnum) return '';
    // 包含所有枚举值时，返回不限
    let sum = Object.keys(valEnum).reduce((t, v) => (v - 0) + t, 0);
    if (val == sum) return '';
    // 其他情况，则转化为二进制数遍历
    const n = Object.keys(valEnum).length;
    const binaryList = Array.from((Array(n).join(0) + val.toString(2)).slice(-n)).reverse();
    // console.log(val, valEnum, binaryList);
    let resArr = [];
    for (let i = 0; i < binaryList.length; i++) {
        if (binaryList[i] == '1') resArr.push(valEnum[Math.pow(2, i) + '']);
    }
    return resArr.join(',');
};

export {getEnum, transferBinaryEnum, Mapping_MAMS_Recruit_User};

export default {
    // 为了控制枚举值顺序，此处先以数组存储，再转换为对象，render控件时即可按数组排序
    // 是否推荐
    eIsRecommendList: [
        {key: "1", value: "推荐"},
        {key: "2", value: "非推荐"}
    ],
    // 有无补贴
    eHasSubsidyList: [
        {key: "1", value: "有补贴"},
        {key: "2", value: "没补贴"}
    ],
    // 有无收费
    eHasChargeList: [
        {key: "1", value: "有收费"},
        {key: "2", value: "没收费"}
    ],
    // 体检
    ePhysicalList: [
        {key: "1", value: "需要体检"},
        {key: "2", value: "无需体检"}
    ],
    // 性别
    eGenderList: [
        {key: "1", value: "男"},
        {key: "2", value: "女"}
    ],
    // 返厂规定
    eReturnRequireList: [
        {key: "1", value: "有规定"},
        {key: "2", value: "无规定"}
    ],
    // 123
    // 犯罪记录
    eCriminalList: [
        {key: "1", value: "需要检查"},
        {key: "0", value: "无需检查"}
    ],
    // 听说读写(英文)
    eCharactersList: [
        
        {key: "0", value: "可以不会"},
        {key: "1", value: "必须会"},
        {key: "2", value: "无规定"}
    ],
    // 简单算数
    eMathList: [
        {key: "0", value: "可以不会"},
        {key: "1", value: "必须会"},
        {key: "2", value: "无规定"}
    ],
    // 无尘服
    eClothesList: [
        {key: "0", value: "看部门穿"},
        {key: "1", value: "必须穿"},
        {key: "2", value: "可以不穿"},
        {key: "3", value: "无规定"}
    ],

    // 体内金属
    eForeignBodiesList: [   
        {key: "0", value: "无需检查"},
        {key: "1", value: "需要检查"},
        {key: "2", value: "无规定"}
    ],
    // 身份证类型 0有磁、1无磁、2临时、3不限
    eIDCardTypeList: [
        {key: "1", value: "有磁"},
        {key: "2", value: "无磁"},
        {key: "4", value: "临时"}
    ],
    // 学历
    eEducationList: [
        {key: "1", value: "小学"},
        {key: "2", value: "初中"},
        {key: "4", value: "高中"},
        {key: "8", value: "大专"},
        {key: "16", value: "本科及以上"}
    ],
    // 纹身
    eTattooList: [
        {key: "1", value: "手部无纹身"},
        {key: "2", value: "手臂无纹身"},
        {key: "4", value: "上身无纹身"},
        {key: "8", value: "无攻击性图案"},
        {key: "16", value: "全身无纹身"}
    ],
    // 烟疤
    eSmokeScarList: [
        {key: "1", value: "手部无烟疤"},
        {key: "2", value: "手臂无烟疤"},
        {key: "4", value: "上身无烟疤"},
        {key: "8", value: "全身无烟疤"}
    ]

};


