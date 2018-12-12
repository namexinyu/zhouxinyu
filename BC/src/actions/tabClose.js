import createAction from 'ACTION/createAction';


function tabClose(stateName, extra) {
    return {
        payload: {stateName, extra}
    };
}

if (!__PROD__) {
    tabClose.actionType = __filename;
}

export default createAction(tabClose);