import createAction from 'ACTION/createAction';
import getAllRecruitListData from 'SERVICE/Broker/AllRecruitList';

function getAllRecruitList(params) {
    return {
        promise: getAllRecruitListData.getAllRecruitList(params)
    };
};

if (!__PROD__) {
    getAllRecruitListData.actionType = __filename;
};

export default createAction(getAllRecruitList);