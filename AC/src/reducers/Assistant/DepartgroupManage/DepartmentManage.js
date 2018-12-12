import merge from '../../merge';
import moment from 'moment';

import DepartgroupManageAction from 'ACTION/Assistant/DepartgroupManageAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getDepartmentList
} = DepartgroupManageAction;

const STATE_NAME = 'state_ac_depart_manage';

function InitialState() {
  return {
    getDepartmentListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    DepartmentList: [],
    RecordCount: 0,
    pageQueryParams: {
      DepartName: {
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
    [getDepartmentList]: merge((payload, state) => {
      return {
        getDepartmentListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getDepartmentList.success]: merge((payload, state) => {
      return {
        getDepartmentListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        DepartmentList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getDepartmentList.error]: merge((payload, state) => {
      return {
        getDepartmentListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
