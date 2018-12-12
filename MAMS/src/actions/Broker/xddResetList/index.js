import createAction from 'ACTION/createAction';

function resetUserInforList(state_name) {
    return {
        payload: {
            stateName: state_name
        }
    };
}
if (!__PROD__) {
    resetUserInforList.actionType = __filename;
};
export default createAction(resetUserInforList);