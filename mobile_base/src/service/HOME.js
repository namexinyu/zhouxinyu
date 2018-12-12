import request from 'UTILS/httpRequest';

export const testPost = param => request('/HOME/TestPost', param);