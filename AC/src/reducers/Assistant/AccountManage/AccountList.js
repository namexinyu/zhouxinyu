import merge from '../../merge';

import AccountManageAction from 'ACTION/Assistant/AccountManageAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getAccountList,
  getAccoutLevel
} = AccountManageAction;

const STATE_NAME = 'state_ac_account_manage';

function InitialState() {
  return {
    getAccountListFetch: {
      status: 'pending',
      response: ''
    },
    getAccoutLevelFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    AccountList: [],
    RankLevelList: [],
    RecordCount: 0,
    pageQueryParams: {
      BrokerAccount: {
        value: ''
      },
      LoginName: {
        value: ''
      },
      RealName: {
        value: ''
      },
      NickName: {
        value: ''
      },
      DepartmentGroup: {
        value: []
      },
      AccountStatus: {
        value: '0'
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
    [getAccountList]: merge((payload, state) => {
      return {
        getAccountListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getAccountList.success]: merge((payload, state) => {
      return {
        getAccountListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        AccountList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getAccountList.error]: merge((payload, state) => {
      return {
        getAccountListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    }),
    [getAccoutLevel]: merge((payload, state) => {
      return {
        getAccoutLevelFetch: {
          status: 'pending'
        }
      };
    }),
    [getAccoutLevel.success]: merge((payload, state) => {
      return {
        getAccoutLevelFetch: {
          status: 'success',
          response: payload
        },
        RankLevelList: (payload.Data || {}).BrokerRank || []
      };
    }),
    [getAccoutLevel.error]: merge((payload, state) => {
      return {
        getAccoutLevelFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
