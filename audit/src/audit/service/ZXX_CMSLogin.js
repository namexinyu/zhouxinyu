import request from 'AUDIT_UTILS/httpRequest';

export const webLogin = param => request('/ZXX_CMSLogin/ZXX_LOGIN_CMSLogin', param);