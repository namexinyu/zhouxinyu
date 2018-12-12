import createAction from 'ACTION/createAction';
import getEstimateSignList from 'SERVICE/Broker/EstimateSign';

function getEstimateSignData(params) {
    return {
        promise: getEstimateSignList.getEstimateSign(params)
    };
};

if (!__PROD__) {
    getEstimateSignData.actionType = __filename;
};

export default createAction(getEstimateSignData);