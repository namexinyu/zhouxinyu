import moment from 'moment';

import merge from 'REDUCER/merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getDayService from 'ACTION/Common/Management/eventserve';

const STATE_NAME = 'state_mams_eventserve';

function InitialState() {
  return {
    getDayServiceFetch: {
      status: 'pending',
      response: ''
    },
    dayServiceList: [],
    RecordCount: 0,
    pageQueryParams: {
        UserName: {
            value: ''
        },
        ExpectedDate: {
          value: []
            // value: [moment().startOf('month'), moment()]
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
    [getDayService]: merge((payload, state) => {
      return {
        getDayServiceFetch: {
          status: 'pending'
        }
      };
    }),
    [getDayService.success]: merge((payload, state) => {
      return {
        getDayServiceFetch: {
          status: 'success',
          response: payload
        },
        dayServiceList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getDayService.error]: merge((payload, state) => {
      return {
        getDayServiceFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
