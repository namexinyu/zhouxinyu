import request from 'ADMIN_UTILS/httpRequest';

// 用户列表
export const getWdAthuUser = param => request('/WDGP_Authority/WDGP_AUTH_QueryUser', param);

// 新增用户
export const AddWdAthuUser = param => request('/WDGP_Authority/WDGP_AUTH_CreateUser', param);

// 编辑用户
export const EditWdAthuUser = param => request('/WDGP_Authority/WDGP_AUTH_EditUser', param);

// 员工列表
export const getWdAthuEmployeeList = param => request('/WDGP_Authority/WDGP_AUTH_EmployeeList', param);

// 获取岗位列表
export const getWdAthuJobAllList = param => request('/WDGP_Authority/WDGP_AUTH_QueryJobTitleList', param);

// 岗位查询
export const getWdAthuJobInfo = param => request('/WDGP_Authority/WDGP_AUTH_QueryJobInfo', param);
// 获取岗位名称
export const getJobTitleList = param => request('/WDGP_Authority/WDGP_AUTH_QueryJobTitleList', param);

// 新增|编辑岗位
export const addWdAthuJobTitle = param => request('/WDGP_Authority/WDGP_AUTH_CreateJobTitle', param);

// 查询岗位员工关系
export const getWdAthuJobUserRelation = param => request('/WDGP_Authority/WDGP_AUTH_QueryJobUserRelation', param);

// 查询岗位角色员工关系
export const getWdAthuUserRoleJobRelation = param => request('/WDGP_Authority/WDGP_AUTH_QueryUserRoleJobRelation', param);

// 保存岗位角色员工关系图
export const updateTree = param => request('/WDGP_Authority/WDGP_AUTH_SaveUserRoleJobRelation', param);

// 删除岗位
export const delJobTitle = param => request('/WDGP_Authority/WDGP_AUTH_DelJobTitle', param);
// 获取角色列表
export const getWdAthuRoleList = param => request('/WDGP_Authority/WDGP_AUTH_LoadRoleList', param);

// 创建角色
export const addWdAthuRole = param => request('/WDGP_Authority/WDGP_AUTH_CreateRole', param);

// 修改角色
export const editWdAthuRole = param => request('/WDGP_Authority/WDGP_AUTH_UpdateRole', param);

// 删除角色
export const deleteWdAthuRole = param => request('/WDGP_Authority/WDGP_AUTH_DeleteRole', param);

// 删除角色
export const configWdAthuRole = param => request('/WDGP_Authority/WDGP_AUTH_ConfigRoleAuth', param);

// 查询菜单资源列表
export const getWdAuthMenuResources = param => request('/WDGP_Authority/WDGP_AUTH_LoadMenuResources', param);

// 添加菜单资源
export const addWdAuthMenu = param => request('/WDGP_Authority/WDGP_AUTH_AddMenu', param);

// 修改菜单资源
export const editWdAuthMenu = param => request('/WDGP_Authority/WDGP_AUTH_EditMenu', param);

// 删除菜单
export const deleteWdAuthMenu = param => request('/WDGP_Authority/WDGP_AUTH_DeleteMenu', param);