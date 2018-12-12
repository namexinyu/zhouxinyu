import createAction from 'ACTION/createAction';
import getRecruitBasic from 'SERVICE/Broker/RecruitBasic';

function getRecruitBasicData(params) {
    return {
        promise: getRecruitBasic.RecruitBasic(params)
    };
};

if (!__PROD__) {
    getRecruitBasicData.actionType = __filename;
};

export default createAction(getRecruitBasicData);