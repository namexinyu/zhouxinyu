module.exports = [{ // 用户列表
    path: '/WDGP_Authority/WDGP_AUTH_QueryUser',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            CountList: {
                LeaveNum: "@id",
                OnJobNum: "@id",
                Total: "@id"
            },
            "EmployeeList|50": [
                {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    EmployeeID: "@increment",
                    EnName: "@cname",
                    "JobTitles": [
                        {
                            JobTitleName: "@cname",
                            JobTitleID: '1',
                            RID: "@increment",
                            RoleName: "@cname"
                        }, {
                            JobTitleName: "@cname",
                            JobTitleID: '2',
                            RID: "@increment",
                            RoleName: "@cname"
                        }, {
                            JobTitleName: "@cname",
                            JobTitleID: '3',
                            RID: "@increment",
                            RoleName: "@cname"
                        }, {
                            JobTitleName: "@cname",
                            JobTitleID: '4',
                            RID: "@increment",
                            RoleName: "@cname"
                        }, {
                            JobTitleName: "@cname",
                            JobTitleID: '5',
                            RID: "@increment",
                            RoleName: "@cname"
                        }
                    ],
                    JobTitleName: "@cname",
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleEmployee: '@cname',
                    LoginName: '@cname',
                    Mobile: /^1[385][1-9]\d{8}/,
                    Name: '@cname',
                    "Status|1": [1, 2, 3],
                    WorkNum: "@id"
                }
            ],
            RecordCount: 100
        },
        Desc: "成功"
    })
}, { // 新建员工
    path: '/WDGP_Authority/WDGP_AUTH_CreateUser',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            Uid: "@id"
        },
        Desc: "成功"
    })
}, { // 编辑员工
    path: '/WDGP_Authority/WDGP_AUTH_EditUser',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            Uid: "@id"
        },
        Desc: "成功"
    })
}, { // 员工列表
    path: '/WDGP_Authority/WDGP_AUTH_EmployeeList',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            Employees: [
                {
                    EmployeeID: "1",
                    EmployeeName: "@cname",
                    EnName: "@cname",
                    WorkNum: "@id"
                }, {
                    EmployeeID: "2",
                    EmployeeName: "@cname",
                    EnName: "@cname",
                    WorkNum: "@id"
                }, {
                    EmployeeID: "3",
                    EmployeeName: "@cname",
                    EnName: "@cname",
                    WorkNum: "@id"
                }, {
                    EmployeeID: "4",
                    EmployeeName: "@cname",
                    EnName: "@cname",
                    WorkNum: "@id"
                }, {
                    EmployeeID: "5",
                    EmployeeName: "@cname",
                    EnName: "@cname",
                    WorkNum: "@id"
                }
            ]
        },
        Desc: "成功"
    })
}, { // 所有岗位
    path: '/WDGP_Authority/WDGP_AUTH_QueryJobTitleList',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: [{
            JobTitleID: '1',
            JobTitleName: "@cname",
            RoleName: "@cname"
        }, {
            JobTitleID: '2',
            JobTitleName: "@cname",
            RoleName: "@cname"
        }, {
            JobTitleID: '3',
            JobTitleName: "@cname",
            RoleName: "@cname"
        }, {
            JobTitleID: '4',
            JobTitleName: "@cname",
            RoleName: "@cname"
        }, {
            JobTitleID: '5',
            JobTitleName: "@cname",
            RoleName: "@cname"
        }],
        Desc: "成功"
    })
}, { // 岗位查询
    path: '/WDGP_Authority/WDGP_AUTH_QueryJobInfo',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            "CountList": {
                TotalNum: "@id",
                UnValidNum: "@id",
                ValidNum: "@id"
            },
            JobTitleList: [
                {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    Employees: [
                        {
                            EmployeeName: "@cname",
                            EmployeeID: '1'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '2'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '3'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '4'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '5'
                        }
                    ],
                    JobTitleName: "@cname",
                    JobTitleID: '1',
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleName: "@cname",
                    LeaderTitleID: "1",
                    RoleName: '@cname',
                    RoleID: '1',
                    "Status|1": [0, 1, 2],
                    UnderTitleNum: "@id"
                }, {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    Employees: [
                        {
                            EmployeeName: "@cname",
                            EmployeeID: '1'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '2'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '3'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '4'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '5'
                        }
                    ],
                    JobTitleName: "@cname",
                    JobTitleID: '2',
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleName: "@cname",
                    LeaderTitleID: "2",
                    RoleName: '@cname',
                    RoleID: '2',
                    "Status|1": [0, 1, 2],
                    UnderTitleNum: "@id"
                }, {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    Employees: [
                        {
                            EmployeeName: "@cname",
                            EmployeeID: '1'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '2'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '3'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '4'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '5'
                        }
                    ],
                    JobTitleName: "@cname",
                    JobTitleID: '3',
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleName: "@cname",
                    LeaderTitleID: "3",
                    RoleName: '@cname',
                    RoleID: '3',
                    "Status|1": [0, 1, 2],
                    UnderTitleNum: "@id"
                }, {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    Employees: [
                        {
                            EmployeeName: "@cname",
                            EmployeeID: '1'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '2'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '3'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '4'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '5'
                        }
                    ],
                    JobTitleName: "@cname",
                    JobTitleID: '4',
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleName: "@cname",
                    LeaderTitleID: "4",
                    RoleName: '@cname',
                    RoleID: '4',
                    "Status|1": [0, 1, 2],
                    UnderTitleNum: "@id"
                }, {
                    CreateTime: '@datetime(\"yyyy-MM-dd\")',
                    Employees: [
                        {
                            EmployeeName: "@cname",
                            EmployeeID: '1'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '2'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '3'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '4'
                        }, {
                            EmployeeName: "@cname",
                            EmployeeID: '5'
                        }
                    ],
                    JobTitleName: "@cname",
                    JobTitleID: '5',
                    LastModifyTime: '@datetime(\"yyyy-MM-dd\")',
                    LeaderTitleName: "@cname",
                    LeaderTitleID: "5",
                    RoleName: '@cname',
                    RoleID: '5',
                    "Status|1": [0, 1, 2],
                    UnderTitleNum: "@id"
                }
            ],
            RecordCount: 50
        },
        Desc: "成功"
    })
}, { // 新增|编辑岗位
    path: '/WDGP_Authority/WDGP_AUTH_CreateJobTitle',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            JID: "@increment"
        },
        Desc: "成功"
    })
}, { // 查询岗位员工关系
    path: '/WDGP_Authority/WDGP_AUTH_QueryJobUserRelation',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            JobTitleUserList: [
                {
                    Employees: [
                        {
                            EmployeeID: '1',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '2',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '3',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '4',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '5',
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "1",
                    JobTitleName: "@cname",
                    SubJobTitleUserList: []
                }, {
                    Employees: [
                        {
                            EmployeeID: '1',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '2',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '3',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '4',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '5',
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "2",
                    JobTitleName: "@cname",
                    SubJobTitleUserList: []
                }, {
                    Employees: [
                        {
                            EmployeeID: '1',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '2',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '3',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '4',
                            EmployeeName: "@cname"
                        }, {
                            EmployeeID: '5',
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "3",
                    JobTitleName: "@cname",
                    SubJobTitleUserList: []
                }
            ]
        },
        Desc: "成功"
    })
}, { // 查询岗位角色员工关系
    path: '/WDGP_Authority/WDGP_AUTH_QueryUserRoleJobRelation',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            JobTitleRoleUserList: [
                {
                    "Employees|5": [
                        {
                            EmployeeID: "@id",
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "11",
                    RoleID: "12",
                    RoleName: "@cname",
                    JobTitleName: "@cname",
                    SubTitleUserList: [
                        {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "111",
                            RoleID: "112",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }, {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "113",
                            RoleID: "114",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }
                    ]
                }, {
                    "Employees|5": [
                        {
                            EmployeeID: "@id",
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "21",
                    RoleID: "22",
                    RoleName: "@cname",
                    JobTitleName: "@cname",
                    SubTitleUserList: [
                        {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "221",
                            RoleID: "222",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }, {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "223",
                            RoleID: "224",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }
                    ]
                }, {
                    "Employees|5": [
                        {
                            EmployeeID: "@id",
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "31",
                    RoleID: "32",
                    RoleName: "@cname",
                    JobTitleName: "@cname",
                    SubTitleUserList: [
                        {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "331",
                            RoleID: "332",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }, {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "333",
                            RoleID: "332",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }
                    ]
                }, {
                    "Employees|5": [
                        {
                            EmployeeID: "@id",
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "41",
                    RoleID: "42",
                    RoleName: "@cname",
                    JobTitleName: "@cname",
                    SubTitleUserList: [
                        {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "411",
                            RoleID: "412",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }, {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "413",
                            RoleID: "414",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: [
                                {
                                    "Employees|5": [
                                        {
                                            EmployeeID: "@id",
                                            EmployeeName: "@cname"
                                        }
                                    ],
                                    JobTitleID: "4111",
                                    RoleID: "4112",
                                    RoleName: "@cname",
                                    JobTitleName: "@cname",
                                    SubTitleUserList: []
                                }, {
                                    "Employees|5": [
                                        {
                                            EmployeeID: "@id",
                                            EmployeeName: "@cname"
                                        }
                                    ],
                                    JobTitleID: "4113",
                                    RoleID: "4114",
                                    RoleName: "@cname",
                                    JobTitleName: "@cname",
                                    SubTitleUserList: []
                                }
                            ]
                        }
                    ]
                }, {
                    "Employees|5": [
                        {
                            EmployeeID: "@id",
                            EmployeeName: "@cname"
                        }
                    ],
                    JobTitleID: "51",
                    RoleID: "52",
                    RoleName: "@cname",
                    JobTitleName: "@cname",
                    SubTitleUserList: [
                        {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "511",
                            RoleID: "512",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }, {
                            "Employees|5": [
                                {
                                    EmployeeID: "@id",
                                    EmployeeName: "@cname"
                                }
                            ],
                            JobTitleID: "513",
                            RoleID: "514",
                            RoleName: "@cname",
                            JobTitleName: "@cname",
                            SubTitleUserList: []
                        }
                    ]
                }
            ]
        },
        Desc: "成功"
    })
}, { // 获取角色列表
    path: '/WDGP_Authority/WDGP_AUTH_LoadRoleList',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            RoleList: [
                {
                    "MenuIDs|5": [1, 2, 3, 4, 5],
                    Remark: "@cname",
                    RoleID: '1',
                    RoleName: "@cname"
                }, {
                    "MenuIDs|5": [1, 2, 3, 4, 5],
                    Remark: "@cname",
                    RoleID: '2',
                    RoleName: "@cname"
                }, {
                    "MenuIDs|5": [1, 2, 3, 4, 5],
                    Remark: "@cname",
                    RoleID: '3',
                    RoleName: "@cname"
                }, {
                    "MenuIDs|5": [1, 2, 3, 4, 5],
                    Remark: "@cname",
                    RoleID: '4',
                    RoleName: "@cname"
                }, {
                    "MenuIDs|5": [1, 2, 3, 4, 5],
                    Remark: "@cname",
                    RoleID: '5',
                    RoleName: "@cname"
                }
            ]
        },
        Desc: "成功"
    })
}, { // 创建角色
    path: '/WDGP_Authority/WDGP_AUTH_CreateRole',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            RID: "@increment"
        },
        Desc: "成功"
    })
}, { // 修改角色
    path: '/WDGP_Authority/WDGP_AUTH_UpdateRole',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}, { // 删除角色
    path: '/WDGP_Authority/WDGP_AUTH_DeleteRole',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}, { // 配置权限
    path: '/WDGP_Authority/WDGP_AUTH_ConfigRoleAuth',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}, { // 查询菜单资源列表
    path: '/WDGP_Authority/WDGP_AUTH_LoadMenuResources',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {
            Resources: [
                {
                    BtnUid: '11',
                    IconUrl: '',
                    Name: '@cname',
                    NavUrl: 'baidu.com',
                    Remark: '@cname',
                    ResID: '12',
                    SubResources: [
                        {
                            BtnUid: '21',
                            IconUrl: '',
                            Name: '@cname',
                            NavUrl: 'baidu.com',
                            Remark: '@cname',
                            ResID: '22',
                            SubResources: [
                                {
                                    BtnUid: '311',
                                    IconUrl: '',
                                    Name: '@cname',
                                    NavUrl: 'baidu.com',
                                    Remark: '@cname',
                                    ResID: '312',
                                    SubResources: [],
                                    "Type|1": [1, 2]
                                }
                            ],
                            "Type|1": [1, 2]
                        }, {
                            BtnUid: '23',
                            IconUrl: '',
                            Name: '@cname',
                            NavUrl: 'baidu.com',
                            Remark: '@cname',
                            ResID: '24',
                            SubResources: [
                                {
                                    BtnUid: '313',
                                    IconUrl: '',
                                    Name: '@cname',
                                    NavUrl: 'baidu.com',
                                    Remark: '@cname',
                                    ResID: '314',
                                    SubResources: [],
                                    "Type|1": [1, 2]
                                }
                            ],
                            "Type|1": [1, 2]
                        }
                    ],
                    "Type|1": [1, 2]
                }
            ]
        },
        Desc: "成功"
    })
}, { // 添加菜单资源
    path: '/WDGP_Authority/WDGP_AUTH_AddMenu',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}, { // 修改菜单资源
    path: '/WDGP_Authority/WDGP_AUTH_EditMenu',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}, { // 删除菜单
    path: '/WDGP_Authority/WDGP_AUTH_DeleteMenu',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Data: {},
        Desc: "成功"
    })
}];