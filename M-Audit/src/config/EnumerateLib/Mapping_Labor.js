const mapToEnum = (mapp) => (
    Object.values(mapp).reduce((result, data) => {
        result[data.value] = data.label;
        return result;
    }, {})
);

// 劳务公司状态
export const LaborStatus = {
    1: "正常", 2: "即将欠费", 3: "欠费"
};