import createAction from 'ACTION/createAction';

function resetQueryParams(state_name, opts) {
    return {
        payload: {
            stateName: state_name,
            opts: opts
        }
    };
};

if (!__PROD__) {
    resetQueryParams.actionType = __filename;
};

export default createAction(resetQueryParams);