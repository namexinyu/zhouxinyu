import merge from '../../merge';

import DepartgroupManageAction from 'ACTION/Assistant/DepartgroupManageAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getGroupList
} = DepartgroupManageAction;

const STATE_NAME = 'state_ac_group_manage';

function InitialState() {
  return {
    getGroupListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    GroupList: [],
    RecordCount: 0,
    pageQueryParams: {
      GroupName: {
        value: ''
      },
      Department: {
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
    [getGroupList]: merge((payload, state) => {
      return {
        getGroupListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getGroupList.success]: merge((payload, state) => {
      return {
        getGroupListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        GroupList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getGroupList.error]: merge((payload, state) => {
      return {
        getGroupListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
