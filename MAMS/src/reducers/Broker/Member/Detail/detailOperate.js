import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setMemberAbnormal from "ACTION/Broker/MemberDetail/setMemberAbnormal";
import setMemberBanPost from "ACTION/Broker/MemberDetail/setMemberBanPost";

const STATE_NAME = 'state_broker_detail_member_operate';

function InitialState () {
  return {
    abnormalReason: {},
    banPostReason: {},
    setMemberAbnormalFetch: {
      status: 'close',
      response: ''
    },
    setMemberBanPostFetch: {
      status: 'close',
      response: ''
    }
  };
}

const Reducer = {
  initialState: new InitialState(),
  reducers: {
    [resetState]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
        return temp;
      }
      return {};
    }),
    [setParams]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        return payload.params;
      }
      return {};
    }),
    [setFetchStatus]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
        state[payload.fetchName].status = payload.status;
        return state;
      }
      return {};
    }),
    [setMemberAbnormal]: merge((payload, state) => {
      return {
        setMemberAbnormalFetch: {
          status: 'pending'
        }
      };
    }),
    [setMemberAbnormal.success]: merge((payload, state) => {
      return {
        setMemberAbnormalFetch: {
          status: 'success',
          response: payload
        },
        abnormalMobile: '',
        abnormalName: '',
        abnormalReason: ''
      };
    }),
    [setMemberAbnormal.error]: merge((payload, state) => {
      return {
        setMemberAbnormalFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [setMemberBanPost]: merge((payload, state) => {
      return {
        setMemberBanPostFetch: {
          status: 'pending'
        }
      };
    }),
    [setMemberBanPost.success]: merge((payload, state) => {
      return {
        setMemberBanPostFetch: {
          status: 'success',
          response: payload
        },
        banPostMobile: '',
        banPostName: '',
        banPostReason: ''
      };
    }),
    [setMemberBanPost.error]: merge((payload, state) => {
      return {
        setMemberBanPostFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
export default Reducer;