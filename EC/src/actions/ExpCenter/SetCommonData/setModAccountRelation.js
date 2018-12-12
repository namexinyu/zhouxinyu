import createAction from 'ACTION/createAction';
import getModAccountRelationData from 'SERVICE/ExpCenter/ModAccountRelation';

function getModAccountRelationList(params) {
    return {
        promise: getModAccountRelationData.getModAccountRelation(params)
    };
};

if (!__PROD__) {
    getModAccountRelationList.actionType = __filename;
};

export default createAction(getModAccountRelationList);