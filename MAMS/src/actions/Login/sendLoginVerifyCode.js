import createAction from 'ACTION/createAction';
import LoginService from 'SERVICE/LoginService';

function sendLoginVerifyCode(params) {
    return {
        promise: LoginService.getVerifyCode(params)
    };
}

export default createAction(sendLoginVerifyCode);