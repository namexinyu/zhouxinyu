import moment from 'moment';

import merge from '../../merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReportAction from 'ACTION/Assistant/ReportAction';

const {
  getDailyEmployedList
} = ReportAction;

const STATE_NAME = 'state_ac_daily_employed';

function InitialState() {
  return {
    getDailyEmployedListFetch: {
      status: 'pending',
      response: ''
    },
    employedList: [],
    RecordCount: 0,
    pageQueryParams: {
      Date: {
        value: moment()
      },
      DepartmentGroup: {
        value: []
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
    [getDailyEmployedList]: merge((payload, state) => {
      return {
        getDailyEmployedListFetch: {
          status: 'pending'
        }
      };
    }),
    [getDailyEmployedList.success]: merge((payload, state) => {
      return {
        getDailyEmployedListFetch: {
          status: 'success',
          response: payload
        },
        employedList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getDailyEmployedList.error]: merge((payload, state) => {
      return {
        getDailyEmployedListFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
