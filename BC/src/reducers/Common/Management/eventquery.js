import moment from 'moment';

import merge from 'REDUCER/merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getQueryEvents from 'ACTION/Common/Management/eventquery';

const STATE_NAME = 'state_mams_eventquery';

function InitialState() {
  return {
    getQueryEventsFetch: {
      status: 'pending',
      response: ''
    },
    queryEventsList: [],
    RecordCount: 0,
    pageQueryParams: {
        UserName: {
            value: ''
        },
        RecruitTmpID: {
            value: {
              value: '',
              text: ''
            }
        },
        InterviewDate: {
            value: undefined
        },
        ReleaseDate: {
            value: []
        },
        EventPublisher: {
            value: ''
        },
        EventProcessor: {
            value: ''
        },
        EventID: {
            value: ''
        },
        EventType: {
            value: ''
        },
        EventNature: {
          value: ''
        },
        UserMobile: {
          value: ''
        },
        SatisfactionType: {
            value: ''
        },
        DealStatus: {
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
    [getQueryEvents]: merge((payload, state) => {
      return {
        getQueryEventsFetch: {
          status: 'pending'
        }
      };
    }),
    [getQueryEvents.success]: merge((payload, state) => {
      const queryEventsList = ((payload.Data || {}).RecordList || []).map((item, i) => {
          return {
              ...item,
              key: i + 1
          };
      });
      return {
        getQueryEventsFetch: {
          status: 'success',
          response: payload
        },
        queryEventsList,
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getQueryEvents.error]: merge((payload, state) => {
      return {
        getQueryEventsFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
