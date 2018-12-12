import createAction from 'ACTION/createAction';
import updateUserRecruitBasic from 'SERVICE/Broker/UpdateUserRecruitBasic';

function UpdateUserRecruitBasic(params) {
    return {
        promise: updateUserRecruitBasic.UpdateUserRecruit(params)
    };
};

if (!__PROD__) {
    UpdateUserRecruitBasic.actionType = __filename;
};

export default createAction(UpdateUserRecruitBasic);