import moment from 'moment';

import merge from 'REDUCER/merge';

import eventquery from "ACTION/Broker/EventEntry/eventquery";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_broker_eventlist';

function InitialState() {
  return {
    eventqueryFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    eventList: [],
    RecordCount: 0,
    pageQueryParams: {
      Name: {
        value: ''
      },
      Mobile: {
        value: ''
      },
      RecruitName: {
          value: {
              value: '',
              text: ''
          }
      },
      BrokerName: {
        value: ""
      },
      EventNumber: {
        value: ''
      },
      DealStatus: {
          value: '0'
      },
      Department: {
        value: '0'
      },
      DiplomatName: {
          value: ''
      },
      InterviewDate: {
        value: ""
      },
      InterviewDateEnd: {
        value: ""
      },
      CreatedTime: {
        value: []
      },
      orderInfo: {
        key: 'CreateTime',
        order: 0 // 倒序
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
    [eventquery]: merge((payload, state) => {
      return {
        eventqueryFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [eventquery.success]: merge((payload, state) => {
      return {
        eventqueryFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        eventList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [eventquery.error]: merge((payload, state) => {
      return {
        eventqueryFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
