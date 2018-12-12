import createAction from 'ACTION/createAction';

function resetQueryParams(state_name) {
    return {
        payload: {
            stateName: state_name
        }
    };
};

if (!__PROD__) {
    resetQueryParams.actionType = __filename;
};

export default createAction(resetQueryParams);