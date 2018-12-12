import createAction from 'ACTION/createAction';
import UserService from 'SERVICE/ExpCenter/UserService';

function getUserMatchList(param) {
    return {
        promise: UserService.getUserMatchList(param)
    };
}

export default createAction(getUserMatchList);