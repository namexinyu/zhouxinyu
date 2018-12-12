import createAction from 'ACTION/createAction';
import EstimateSign from 'SERVICE/Broker/EstimateSign';

function getFactoryCheckinList(params) {
    return {
        promise: EstimateSign.getFactoryCheckinList(params)
    };
};

if (!__PROD__) {
    getFactoryCheckinList.actionType = __filename;
};

export default createAction(getFactoryCheckinList);