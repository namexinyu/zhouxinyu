import createAction from 'ACTION/createAction';

function setParams(state_name, params) {
    return {
        payload: {
            stateName: state_name,
            params: params
        }
    };
};

if (!__PROD__) {
    setParams.actionType = __filename;
};

export default createAction(setParams);