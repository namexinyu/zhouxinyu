import createAction from 'ACTION/createAction';
import LaborService from 'SERVICE/Business/Labor';
import RecruitmentService from 'SERVICE/Business/Recruitment';
import CommonService from 'SERVICE/Business/Common/index';

function getRecruitSimpleList(params) {
    return {
        promise: RecruitmentService.getRecruitSimpleList(params)
    };
}

function getLaborBossSimpleList(params) {
    return {
        promise: LaborService.getLaborBossSimpleList(params)
    };
}

function getLaborSimpleList(params) {
    return {
        promise: LaborService.getLaborSimpleList(params)
    };
}

if (!__PROD__) {
    getRecruitSimpleList.actionType = 'getRecruitSimpleList';
    getLaborBossSimpleList.actionType = 'getLaborBossSimpleList';
    getLaborSimpleList.actionType = 'getLaborSimpleList';
}

let action = Object.keys(CommonService).reduce((result, data) => {
    let action = (param) => ({
        promise: CommonService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default {
    getRecruitSimpleList: createAction(getRecruitSimpleList),
    getLaborBossSimpleList: createAction(getLaborBossSimpleList),
    getLaborSimpleList: createAction(getLaborSimpleList),
    ...action
};