import createAction from 'ACTION/createAction';
import getLaborComByBossData from 'SERVICE/Finance/AccountManage/LaborComByBoss';

function getLaborComByBossList(params) {
    return {
        promise: getLaborComByBossData.getLaborComByBoss(params)
    };
};

if (!__PROD__) {
    getLaborComByBossList.actionType = __filename;
};

export default createAction(getLaborComByBossList);