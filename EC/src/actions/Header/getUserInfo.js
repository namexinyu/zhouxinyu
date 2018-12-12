import createAction from 'ACTION/createAction';
import getUserInfoData from 'SERVICE/Document/headerInfo';

function getUserInfo(params) {
    return {
        promise: getUserInfoData.getUser(params)
    };
};

if (!__PROD__) {
    getUserInfo.actionType = __filename;
};

export default createAction(getUserInfo);