export const EntType = {
    1: {
        EnumValue: 'A类',
        color: 'color-red',
        otherProp: 'xxx' // 其他自定义属性
    },
    2: {
        EnumValue: 'B类',
        color: 'color-green'
    },
    3: {
        EnumValue: 'C类',
        color: 'color-orange'
    }
};

// 名单管理-实接记录-名单导入-预检测结果
export const TestResultType = {
    0: {
        value: '正常',
        color: 'color-green'
    }, 1: {
        value: '当天已存在',
        color: 'color-blue'
    }, 2: {
        value: '面试日期不可为空',
        color: 'color-red'
    }, 3: {
        value: '姓名不可为空',
        color: 'color-red'
    }, 4: {
        value: '身份证不可为空',
        color: 'color-red'
    }, 5: {
        value: '性别不可为空',
        color: 'color-red'
    }, 6: {
        value: '面试状态格式不正确',
        color: 'color-red'
    }, 7: {
        value: '名单重复',
        color: 'color-red'
    }
};