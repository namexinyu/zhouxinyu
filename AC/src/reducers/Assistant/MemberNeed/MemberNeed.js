import moment from 'moment';

import merge from '../../merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberNeedList from 'ACTION/Common/Assistance/MemberNeed';

const STATE_NAME = 'state_ac_memberneed';

function InitialState() {
  return {
    getMemberNeedListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    memberNeedList: [],
    RecordCount: 0,
    pageQueryParams: {
      MatchUserName: {
        value: ''
      },
      UserMobile: {
        value: ''
      },
      BrokerHandleStatus: {
        value: '-1'
      },
      CreatedDate: {
        value: [moment().startOf('month'), moment()]
      },
      DepartmentGroup: {
        value: []
      },
      BrokerAccount: {
        value: ''
      },
      RecordIndex: 0,
      RecordSize: 40
    }
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [resetState]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        return new InitialState();
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
    [getMemberNeedList]: merge((payload, state) => {
      return {
        getMemberNeedListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getMemberNeedList.success]: merge((payload, state) => {
      return {
        getMemberNeedListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        memberNeedList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getMemberNeedList.error]: merge((payload, state) => {
      return {
        MemberNeedFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
