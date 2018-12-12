import createAction from 'ACTION/createAction';
import LoginService from 'SERVICE/LoginService';

function doLogin(params) {
    return {
        promise: LoginService.brokerLogin(params)
    };
}

export default createAction(doLogin);