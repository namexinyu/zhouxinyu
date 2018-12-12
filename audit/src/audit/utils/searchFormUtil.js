export function getFormOptLayout(itemCount) {
    // 搜索条件的个数
    return {
        lg: {span: (4 - itemCount % 4) * 6},
        md: {span: (3 - itemCount % 3) * 8},
        sm: {span: (2 - itemCount % 2) * 12}
    };
}

export const getFormItemLayout = () => ({
    labelCol: {span: 8, offset: 0},
    wrapperCol: {span: 16, offset: 0}
});

export const getFormLayout = () => ({
    sm: {span: 12, offset: 0},
    md: {span: 8, offset: 0},
    lg: {span: 6, offset: 0}
});
