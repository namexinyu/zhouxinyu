import createAction from 'ACTION/createAction';

function resetOrderParams(state_name, opts) {
    return {
        payload: {
            stateName: state_name,
            opts: opts
        }
    };
};

if (!__PROD__) {
    resetOrderParams.actionType = __filename;
};

export default createAction(resetOrderParams);