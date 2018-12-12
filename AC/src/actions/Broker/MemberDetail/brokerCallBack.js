import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function brokerCallBack(params) {
    return {
        promise: MemberDetailService.brokerCallBack(params)
    };
}

export default createAction(brokerCallBack);