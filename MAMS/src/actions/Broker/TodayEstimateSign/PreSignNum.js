import createAction from 'ACTION/createAction';
import getPreSignNumList from 'SERVICE/Broker/PreSignNum';

function getPreSignNumData(params) {
    return {
        promise: getPreSignNumList.getPreSignNum(params)
    };
};

if (!__PROD__) {
    getPreSignNumData.actionType = __filename;
};

export default createAction(getPreSignNumData);