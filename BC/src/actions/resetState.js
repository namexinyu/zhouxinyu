import createAction from 'ACTION/createAction';

function resetState(state_name, field_name) {
    return {
        payload: {
            stateName: state_name,
            fieldName: field_name
        }
    };
}

if (!__PROD__) {
    resetState.actionType = __filename;
}

export default createAction(resetState);