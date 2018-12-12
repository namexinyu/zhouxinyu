import createAction from 'ACTION/createAction';

function resetState(state_name) {
    return {
        payload: {
            stateName: state_name
        }
    };
};

if (!__PROD__) {
    resetState.actionType = __filename;
};

export default createAction(resetState);