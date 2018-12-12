let NavList = {
        ResID: 9999,
        NavUrl: "/",
        Name: '审核平台',
        Remark: "测试内容51b5",
        Type: 0,
        SubResources: [
            {
                ResID: 1,
                NavUrl: "/board",
                Name: '控制面板',
                Remark: "测试内容51b5",
                Type: 1,
                SubResources: []
            },
            {
                ResID: 2,
                NavUrl: "/operate",
                Name: '今日审核',
                Remark: "测试内容51b5",
                Type: 0,
                SubResources: [
                    {
                        ResID: 21,
                        Name: '身份证审核',
                        NavUrl: "/operate/card",
                        Remark: "测试内容1",
                        SubResources: [],
                        Type: 1
                    },
                    {
                        ResID: 22,
                        Name: '银行卡审核',
                        NavUrl: "/operate/bank",
                        Remark: "测试内容1",
                        SubResources: [],
                        Type: 1
                    },
                    {
                        ResID: 23,
                        Name: '工牌审核',
                        NavUrl: "/operate/labor",
                        Remark: "测试内容1",
                        SubResources: [],
                        Type: 1
                    }
                ]
            },
            {
                "ResID": 3,
                "Name": '审核列表',
                "NavUrl": "/orderlist",
                "Remark": "测试内容1",
                SubResources: [
                    {
                        "ResID": 31,
                        "Name": '身份证审核列表',
                        "NavUrl": "/list/cardManager",
                        "Remark": "",
                        SubResources: [],
                        "Type": 1
                    },
                    {
                        "ResID": 32,
                        "Name": '银行卡审核列表',
                        "NavUrl": "/list/bankManager",
                        "Remark": "",
                        SubResources: [],
                        "Type": 1
                    },
                    {
                        "ResID": 33,
                        "Name": '工牌审核列表',
                        "NavUrl": "/list/laborManager",
                        "Remark": "",
                        SubResources: [],
                        "Type": 1
                    }
                ],
                "Type": 1
            },
            {
                ResID: 4,
                NavUrl: "/weeklyWageManager",
                Name: '统计报表',
                Remark: "测试内容51b5",
                Type: 0,
                SubResources: [
                    {
                        ResID: 41,
                        Name: '人员审核量统计',
                        NavUrl: "/weeklyWageManager/import",
                        Remark: "测试内容1",
                        SubResources: [],
                        Type: 1
                    },
                    {
                        ResID: 42,
                        Name: '审核结果统计',
                        NavUrl: "/weeklyWageManager/importRecord",
                        Remark: "测试内容1",
                        SubResources: [],
                        Type: 1
                    }
                ]
            }
            
            
        ]
    };
export default NavList;