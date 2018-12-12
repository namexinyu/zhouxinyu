import createAction from 'ACTION/createAction';
import getPromotionDetailData from 'SERVICE/ExpCenter/PromotionDetail';

function getPromotionDetailList(params) {
    return {
        promise: getPromotionDetailData.getPromotionDetail(params)
    };
};

if (!__PROD__) {
    getPromotionDetailList.actionType = __filename;
};

export default createAction(getPromotionDetailList);