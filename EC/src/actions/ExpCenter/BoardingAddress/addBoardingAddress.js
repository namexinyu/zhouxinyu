import createAction from 'ACTION/createAction';
import PickAddressService from 'SERVICE/ExpCenter/BoardingAddressService';

function addBoardingAddress(param) {
    return {
        promise: PickAddressService.editBoardingAddress(param)
    };
}

export default createAction(addBoardingAddress);