import request from 'ADMIN_UTILS/httpRequest';

// 所有三方数据，企业 劳务 中介
export const getAllCompanyInfo = param => request('/ZXX_BaseData/ZXX_GetAllCompanyInfo', param);
// 获取企业数据列表
export const companyQueryInfoLisit = param => request('/ZXX_BaseData/ZXX_CompanyQueryInfoLisit', param);

// 同步企业数据
export const syncCompanyInfo = param => request('/ZXX_BaseData/ZXX_SyncCompanyInfo', param);
// 同步企业数据
export const editCompanyInfo = param => request('/ZXX_BaseData/ZXX_EditCompanyInfo', param);

// 获取中介 劳务
export const getAgentLaborList = param => request('/ZXX_BaseData/ZXX_AgentQueryInfoList', param);

// 编辑中介 劳务
export const editAgentLabor = param => request('/ZXX_BaseData/ZXX_EditAgentInfo', param);

// 同步中介 劳务
export const syncAgentLabor = param => request('/ZXX_BaseData/ZXX_SyncAgentInfo', param);


//  修改付款账号
export const updateBankPayAcct = param => request('/ZXX_BaseData/ZXX_UpdatePayAccnt', param);
//  启用/停用付款账号
export const ableBankPayAcct = param => request('/ZXX_BaseData/ZXX_AblePayAccnt', param);
//  新增付款账号
export const addBankPayAcct = param => request('/ZXX_BaseData/ZXX_AddPayAccnt', param);
//  查询付款账号
export const getBankPayAcct = param => request('/ZXX_BaseData/ZXX_QueryPayAccnt', param);
//  获取所有付款账号
export const getAllBankPayAcct = param => request('/ZXX_BaseData/ZXX_GetAllPayAccnt', param);

//  新增会员打款虚拟子账户
export const addMemberPayAcct = param => request('/ZXX_BaseData/ZXX_AddUserPayAccntRouter', param);
//  更新会员打款虚拟子账户
export const updateMemberPayAcct = param => request('/ZXX_BaseData/ZXX_UpdateUserPayAccntRouter', param);
//  查询会员打款虚拟子账户
export const getMemberPayAcct = param => request('/ZXX_BaseData/ZXX_QueryUserPayAccntRouter', param);


//  新增中介打款虚拟子账号
export const addAgentPayAcct = param => request('/ZXX_BaseData/ZXX_AddAgentPayAccntRouter', param);
//  更新中介打款虚拟子账号
export const updateAgentPayAcct = param => request('/ZXX_BaseData/ZXX_UpdateAgentPayAccntRouter', param);
//  查询中介打款虚拟子账户
export const getAgentPayAcct = param => request('/ZXX_BaseData/ZXX_QueryAgentPayAccntRouter', param);
