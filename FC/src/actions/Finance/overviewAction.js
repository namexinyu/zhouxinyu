import createAction from 'ACTION/createAction';

let setParams = (state_name, query) => ({
    payload: {stateName: state_name, query}
});

if (!__PROD__) setParams.actionType = __filename;

export default createAction(setParams);