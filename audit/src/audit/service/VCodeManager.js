import request from 'AUDIT_UTILS/httpRequest';

// 获取验证码
export const getVCode = param => request('/VCodeManager/GetVCode', param);