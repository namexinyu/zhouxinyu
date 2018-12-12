import createAction from 'ACTION/createAction';
import CommonService from 'SERVICE/Audit/Common/index';

function getEnterpriseSimpleList(params) {
    return {
        promise: CommonService.getEnterpriseSimpleList(params)
    };
}


if (!__PROD__) {
    getEnterpriseSimpleList.actionType = 'getEnterpriseSimpleList';
}


let action = {
    getEnterpriseSimpleList: createAction(getEnterpriseSimpleList)
};

export default action;