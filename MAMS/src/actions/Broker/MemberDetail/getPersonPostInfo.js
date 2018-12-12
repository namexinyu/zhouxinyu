import createAction from 'ACTION/createAction';
import GetPersonPostInfo from 'SERVICE/Broker/MemberDetailService';

function getPersonPostInfo (params) {
  return {
    promise: GetPersonPostInfo.getPersonPostInfo(params)
  };
}

export default createAction(getPersonPostInfo);