import request from 'AUDIT_UTILS/httpRequest';

export const getSercetKey = param => request('/Aliyun/WD_ALI_GetAliSTS', param);