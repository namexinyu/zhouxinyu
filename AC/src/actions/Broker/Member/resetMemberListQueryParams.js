import createAction from 'ACTION/createAction';

function resetMemberListQueryParams() {
    return {
        payload: {}
    };
}

export default createAction(resetMemberListQueryParams);