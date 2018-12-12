import moment from 'moment';

import merge from 'REDUCER/merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getDayEvent from 'ACTION/Common/Management/eventstype';

const STATE_NAME = 'state_mams_eventstype';

function InitialState() {
  return {
    getDayEventFetch: {
      status: 'pending',
      response: ''
    },
    dayEventList: [],
    dayEventTotal: {},
    RecordCount: 0,
    pageQueryParams: {
        EventType: {
            value: '0'
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
    [getDayEvent]: merge((payload, state) => {
      return {
        getDayEventFetch: {
          status: 'pending'
        }
      };
    }),
    [getDayEvent.success]: merge((payload, state) => {
      return {
        getDayEventFetch: {
          status: 'success',
          response: payload
        },
        dayEventList: (payload.Data || {}).RecordList || [],
        dayEventTotal: {
          EventTypeName: '合计',
          EventTotalCount: ((payload.Data || {}).RecordList || []).reduce((initValue, item) => {
            return initValue + item.EventCount;
          }, 0),
          EventTotalPercent: ((payload.Data || {}).RecordList || []).filter(item => item.EventPercent !== '').reduce((initValue, cur) => {
            return initValue + (+cur.EventPercent);
          }, 0)
        },
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getDayEvent.error]: merge((payload, state) => {
      return {
        getDayEventFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
