import moment from 'moment';

import merge from 'REDUCER/merge';

import getEventList from "ACTION/Common/Management/eventlist";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_broker_eventlist';

function InitialState() {
  return {
    getEventListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    eventList: [],
    eventCountInfo: {},
    
    RecordCount: 0,
    pageQueryParams: {
      Name: {
        value: ''
      },
      Mobile: {
        value: ''
      },
      RelatedToMe: {
        value: []
      },
      RecruitName: {
          value: {
              value: '',
              text: ''
          }
      },
      EventNumber: {
        value: ''
      },
      Department: {
        value: "0"
      },
      EventType: {
          value: '0'
      },
      BrokerName: {
          value: ''
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
      DealStatus: 0,
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
    [getEventList]: merge((payload, state) => {
      return {
        getEventListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getEventList.success]: merge((payload, state) => {
      return {
        getEventListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        eventList: (payload.Data || {}).RecordList || [],
        eventCountInfo: (payload.Data || {}).CountList || {},
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getEventList.error]: merge((payload, state) => {
      return {
        getEventListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
