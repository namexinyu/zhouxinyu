import request from 'ADMIN_UTILS/httpRequest';

export const webLogin = param => request('/WDGP_Authority/WDGP_AUTH_Login', param);