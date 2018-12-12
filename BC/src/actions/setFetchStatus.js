import createAction from 'ACTION/createAction';

function setFetchStatus(stateName, fetchName, status) {
    return {
        payload: {
            stateName: stateName,
            fetchName: fetchName,
            status: status
        }
    };
};

if (!__PROD__) {
    setFetchStatus.actionType = __filename;
};

export default createAction(setFetchStatus);