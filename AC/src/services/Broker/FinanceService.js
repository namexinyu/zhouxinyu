import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let FinanceService = {
    GetFinanceSubsidyList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_UserSubsidy/BK_US_QuerySubsidyApplied',
            params: params
        }, baseToDo);
    },
    GetFinanceRecommendationList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_InviteFee/BK_IF_QueryInviteFee',
            params: params
        }, baseToDo);
    }
};

export default FinanceService;