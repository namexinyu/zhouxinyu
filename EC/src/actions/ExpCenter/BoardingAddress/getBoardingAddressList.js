import createAction from 'ACTION/createAction';
import BoardingAddressService from 'SERVICE/ExpCenter/BoardingAddressService';

function getBaordingAddressList(param) {
    return {
        promise: BoardingAddressService.getBoardingAddressList(param)
    };
}

export default createAction(getBaordingAddressList);