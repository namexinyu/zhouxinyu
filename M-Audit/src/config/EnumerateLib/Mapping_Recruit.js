const mapToEnum = (mapp) => (
    Object.values(mapp).reduce((result, data) => {
        result[data.value] = data.label;
        return result;
    }, {})
);

// 企业类别
export const RecruitType = {
    1: "A类企业", 2: "B类企业", 3: "C类企业"
};

// 招工性别需求
export const RecruitGender = {
    0: "不限", 1: "男性", 2: "女性"
};