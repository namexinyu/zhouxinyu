let NavList = {
  ResID: 9999,
  NavUrl: "/",
  Name: '权限管理平台',
  Remark: "",
  Type: 0,
  SubResources: [
    {
      ResID: 1,
      NavUrl: "/system",
      Name: '我打系统',
      Remark: "",
      Type: 0,
      SubResources: [
        {
          ResID: 102,
          Name: '员工设置',
          NavUrl: "/system/woda/employee",
          Remark: "",
          SubResources: [],
          Type: 1
        }, {
          ResID: 103,
          Name: '菜单设置',
          NavUrl: "/system/woda/menu/pt",
          Remark: "",
          SubResources: [],
          Type: 1
        }, {
          ResID: 104,
          Name: '角色设置',
          NavUrl: "/system/woda/role/pt",
          Remark: "",
          SubResources: [],
          Type: 1
        }, {

          ResID: 105,
          Name: '岗位设置',
          NavUrl: "/system/woda/relationlmg",
          Remark: "",
          SubResources: [],
          Type: 1

        }, {
          ResID: 106,
          Name: '岗位查询',
          NavUrl: "/system/woda/user",
          Remark: "",
          SubResources: [],
          Type: 1
        }
      ]
    }


  ]
};
export default NavList;