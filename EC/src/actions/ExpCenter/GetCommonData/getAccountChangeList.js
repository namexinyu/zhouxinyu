import createAction from 'ACTION/createAction';
import getAccountChangeList from 'SERVICE/ExpCenter/AccountChangeList';

function getAccountChangeListList(params) {
    return {
        promise: getAccountChangeList.getAccountChangeList(params)
    };
};

if (!__PROD__) {
    getAccountChangeListList.actionType = __filename;
};

export default createAction(getAccountChangeListList);