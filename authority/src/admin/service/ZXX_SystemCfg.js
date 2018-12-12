import request from 'ADMIN_UTILS/httpRequest';

// 银行名称
export const getBankList = param => request('/ZXX_SystemCfg/BankList', param);