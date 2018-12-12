import createAction from 'ACTION/createAction';
import PickAddressService from 'SERVICE/ExpCenter/BoardingAddressService';

function editBroadingAddress(param) {
    return {
        promise: PickAddressService.editBoardingAddress(param)
    };
}

export default createAction(editBroadingAddress);