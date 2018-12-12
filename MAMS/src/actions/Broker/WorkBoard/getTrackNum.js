import createAction from 'ACTION/createAction';

function getTrackNum() {
    return {
        payload: ''
    };
};

if (!__PROD__) {
    getTrackNum.actionType = __filename;
};

export default createAction(getTrackNum);