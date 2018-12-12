import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getPersonPostInfo from 'ACTION/Broker/MemberDetail/getPersonPostInfo';

const STATE_NAME = 'state_broker_member_person_post_info';

function InitialState () {
  return {
    personPostModal: false,
    messgeModal: false,
    signPersonPostModal: false,
    signMessgeModal: false,
    is_ok: '',
    userFeature: [],
    userPreTopList: [],
    userTopList: [],
    call_type: 2,
    getPersonPostInfoFetch: {
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
    [getPersonPostInfo]: merge((payload, state) => {
      return {
        getPersonPostInfoFetch: {
          status: 'pending'
        }
      };
    }),
    [getPersonPostInfo.success]: merge((payload, state) => {
      return {
        getPersonPostInfoFetch: {
          status: 'success',
          response: payload
        },
        is_ok: payload.Data.is_ok,
        userFeature: payload.Data.user_7feature,
        userPreTopList: payload.Data.user_pre_top_list,
        userTopList: payload.Data.user_top_list
      };
    }),
    [getPersonPostInfo.error]: merge((payload, state) => {
      return {
        getPersonPostInfoFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
export default Reducer;