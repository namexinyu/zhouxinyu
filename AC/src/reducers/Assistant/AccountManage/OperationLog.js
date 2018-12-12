import merge from '../../merge';
import moment from 'moment';

import AccountManageAction from 'ACTION/Assistant/AccountManageAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getOperationLogs
} = AccountManageAction;

const STATE_NAME = 'state_ac_operation_log';

function InitialState() {
  return {
    getOperationLogsFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    OperationLogList: [],
    RecordCount: 0,
    pageQueryParams: {
      LoginName: {
        value: ''
      },
      OperationItem: {
        value: ''
      },
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
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
    [getOperationLogs]: merge((payload, state) => {
      return {
        getOperationLogsFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getOperationLogs.success]: merge((payload, state) => {
      return {
        getOperationLogsFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        OperationLogList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getOperationLogs.error]: merge((payload, state) => {
      return {
        getOperationLogsFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
