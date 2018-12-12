export default {
    xxx: { // xxx页面
        func1: 'xxx-func1',
        func2: 'xxx-func2'
    }, // 另一个页面
    another: {
        func1: 'another-func1',
        func2: 'another-func2'
    },
    applyList: {
        add: 'applyList-add', // 发薪申请---新增
        modify: 'applyList-modify', // 发薪申请---修改
        delete: 'applyList-delete' // 发薪申请---删除
    },
    authorizationList: {
        confirm: 'authorizationList-confirm' // 授权---确认授权
    },
    reAuthorizationList: {
        confirm: 'reAuthorizationList-confirm', // 重发授权---确认授权
        reauthorization: 'reAuthorizationList-reauthorization' // 重发授权---可选择授权多个明细按钮

    },
    entryAndExitList: {
        apply: 'entryAndExitList-apply', // 出入金---申请
        examined: 'entryAndExitList-examined', // 出入金---审核
        check: 'entryAndExitList-check', // 出入金---查看
        split: 'entryAndExitList-split' // 出入金---拆分
    },
    labourAccountList: {
        export: 'labourAccountList-export', // 劳务账户---劳务列表  导出按钮
        exportDetail: 'labourAccountList-exportDetail' // 劳务账户---劳务明细列表  导出按钮
    },
    agencyAccountList: {
        export: 'agencyAccountList-export', // 中介账户---中介列表  导出按钮
        exportDetail: 'agencyAccountList-exportDetail' // 中介账户---中介明细列表  导出按钮
    },
    dunningList: {
        export: 'dunningList-export' // 劳务催账单---导出
    },
    weeklyWageManager: {
        import: {
            importPreviewX: 'weeklyWageManager-import-importPreviewX', //   导入周薪-导入预览
            generateBatchX: 'weeklyWageManager-import-generateBatchX', //   导入周薪-提交保存
            resetTableInfoX: 'weeklyWageManager-import-resetTableInfoX' //  导入周薪-取消导入
        },
        importRecord: {
            exportX: 'weeklyWageManager-importRecord-exportX' // 导入周薪记录-导出
        },
        list: {
            exportX: 'weeklyWageManager-list-exportX' // 周薪查询-导出
        },
        bill: {
            exportX: 'weeklyWageManager-bill-exportX', //    周薪账单-导出
            confirmX: 'weeklyWageManager-bill-confirmX', //    周薪账单-账单审核
            seeDetailX: 'weeklyWageManager-bill-seeDetailX', //    周薪账单-账单详情
            exportDetailX: 'weeklyWageManager-bill-exportDetailX' //    周薪账单-导出单个账单的内容
        },
        billDetail: {
            exportX: 'weeklyWageManager-billDetail-exportX' //    周薪账单详情进入-导出
        },
        reissue: {
            generateTableX: 'weeklyWageManager-reissue-generateTableX', //    补发周薪-生成表格
            addTableDataX: 'weeklyWageManager-reissue-addTableDataX', //    补发周薪-添加
            resetOldTableX: 'weeklyWageManager-reissue-resetOldTableX', //    补发周薪-删除表格
            commitDataX: 'weeklyWageManager-reissue-commitDataX', //    补发周薪-提交
            editTableDataX: 'weeklyWageManager-reissue-editTableDataX', //    补发周薪-修改
            deleteTableDataX: 'weeklyWageManager-reissue-deleteTableDataX' //    补发周薪-删除
        }
    }, 
    monthlyWageManager: {
        import: {
            importPreviewX: 'monthlyWageManager-import-importPreviewX', //   导入月薪-导入预览
            generateBatchX: 'monthlyWageManager-import-generateBatchX', //   导入月薪-提交保存
            resetTableInfoX: 'monthlyWageManager-import-resetTableInfoX' //   导入月薪-取消导入
        },
        importRecord: {
            exportX: 'monthlyWageManager-importRecord-exportX'//   导入月薪记录-导出
        },
        list: {
            exportX: 'monthlyWageManager-list-exportX'//   月薪查询-导出
        },
        bill: {
            exportX: 'monthlyWageManager-bill-exportX', //   月薪账单-导出
            confirmX: 'monthlyWageManager-bill-confirmX', //   月薪账单-账单审核
            seeDetailX: 'monthlyWageManager-bill-seeDetailX', //   月薪账单-账单详情
            exportDetailX: 'monthlyWageManager-bill-exportDetailX' //    月薪账单-导出单个账单的内容
        },
        billDetail: {
            exportX: 'monthlyWageManager-billDetail-exportX' //    月薪账单详情进入-导出
        },
        reissue: {
            generateTableX: 'monthlyWageManager-reissue-generateTableX', //    补发月薪-生成表格
            addTableDataX: 'monthlyWageManager-reissue-addTableDataX', //    补发月薪-添加
            resetOldTableX: 'monthlyWageManager-reissue-resetOldTableX', //    补发月薪-删除表格
            commitDataX: 'monthlyWageManager-reissue-commitDataX', //    补发月薪-提交
            editTableDataX: 'monthlyWageManager-reissue-editTableDataX', //    补发月薪-修改
            deleteTableDataX: 'monthlyWageManager-reissue-deleteTableDataX' //    补发月薪-删除
        }
    },
    withdrawManager: {
        back: {
            withDrawRePayX: 'withdrawManager-back-withDrawRePayX', //    退回列表-申请重发
            destroyBankBackX: 'withdrawManager-back-destroyBankBackX', //    退回列表-作废
            exportX: 'withdrawManager-back-exportX' //    退回列表-导出
        },
        pay: {
            withDrawPayX: 'withdrawManager-pay-withDrawPayX', //    发薪-打款
            exportX: 'withdrawManager-pay-exportX', //    发薪-导出,
            setMoneyFailX: 'withdrawManager-pay-setMoneyFailX' //    发薪-到账失败,
        }
    },
    bankCardList: { // 银行卡
        export: 'bankCardList-Export', // 导出
        audit: 'bankCardList-Audit', // 审核
        auditIdCard: 'bankCardList-AuditIdCard', // 审核身份证
        modifyAuth: 'bankCardList-ModifyAuth' // 修改银行卡信息的权限
    },
    idCardList: { // 身份证
        export: 'idCardList-Export', // 导出
        audit: 'idCardList-Audit' // 审核
    },
    workCardList: { // 工牌
        export: 'workCardList-Export', // 导出
        audit: 'workCardList-Audit', // 审核
        modifyWorkAuth: 'workCardList-modifyWorkAuth' // 修改工牌
    },
    baseCompanyList: { // 基础数据企业
        sync: 'baseCompanyList-sync', // 同步
        edit: 'baseCompanyList-edit' // 编辑
    },
    baseLabarList: { // 基础数据劳务
        sync: 'baseLabarList-sync', // 同步
        edit: 'baseLabarList-edit' // 编辑
    },
    baseAgentList: { // 基础数据中介
        sync: 'baseAgentList-sync', // 同步
        edit: 'baseAgentList-edit' // 编辑
    },
    nameList: { // 名单页面
        sync: 'nameList-sync', // 同步名单
        syncOrder: 'nameList-syncOrder', // 同步订单
        bing: 'nameList-bing', // 绑定订单
        cancel: 'nameList-cancel', // 作废名单
        export: 'nameList-export', // 导出
        details: 'nameList-details' // 详情
    },
    orderList: { // 订单页面
        syncOrder: 'orderList-syncOrder', // 同步订单
        add: 'orderList-add', // 新增
        cancel: 'orderList-cancel', // 作废订单
        export: 'orderList-export', // 导出
        details: 'orderList-details' // 详情
    },
    clockInList: { // 打卡记录管理
        export: 'clockInList-export', // 导出
        fillClock: 'clockInList-fillClock', // 补卡
        reissueClock: 'clockInList-reissueClock', // 补卡，新
        details: 'clockInList-details', // 详情
        setMaxReissueCount: 'clockInList-setMaxReissueCount' // 次数限制
    },
    basicData: {
        bankPayAccount: {
            disableAccountX: 'basicData-bankPayAccount-disableAccountX', // 银行付款账号管理-停用
            enableAccountX: 'basicData-bankPayAccount-enableAccountX', //   银行付款账号管理-启用
            addAccountX: 'basicData-bankPayAccount-addAccountX', // 银行付款账号管理-新增
            editAccountX: 'basicData-bankPayAccount-editAccountX' // 银行付款账号管理-修改
        },
        memberPayAccount: {
            addAccountX: 'basicData-memberPayAccount-addAccountX', //  会员打款虚拟子账户-新增
            editAccountX: 'basicData-memberPayAccount-editAccountX' //  会员打款虚拟子账户-修改
        },
        agentPayAccount: {
            addAccountX: 'basicData-agentPayAccount-addAccountX', //  中介打款虚拟子账户-新增
            editAccountX: 'basicData-agentPayAccount-editAccountX' //  中介打款虚拟子账户-修改
        }
    },
    clockInManager: {
        clockStatistic: {
            exportX: 'clockInManager-clockStatistic-exportX'
        }
    }
};