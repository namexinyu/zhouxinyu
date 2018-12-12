import request from 'AUDIT_UTILS/httpRequest';

// 银行名称
export const getBankList = param => request('/ZXX_SystemCfg/BankList', param);