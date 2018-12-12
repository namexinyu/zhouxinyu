import moment from 'moment';

import merge from 'REDUCER/merge';

import FeedbackAction from 'ACTION/Audit/FeedbackAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getFeedbackList
} = FeedbackAction;

const STATE_NAME = 'state_audit_feedback_list';

function InitialState() {
  return {
    getFeedbackListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    feedbackList: [],
    RecordCount: 0,
    pageQueryParams: {
      CreatedTime: {
        value: []
      },
      UserName: {
        value: ''
      },
      BrokerAccountName: {
        value: ''
      },
      DepartmentGroup: {
        value: []
      },
      FeedbackType: {
        value: '0'
      },
      orderInfo: {
        'CreateTime': {
          key: 'CreateTime',
          order: 1 // 倒序
        }
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
    [getFeedbackList]: merge((payload, state) => {
      return {
        getFeedbackListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getFeedbackList.success]: merge((payload, state) => {
      return {
        getFeedbackListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        feedbackList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getFeedbackList.error]: merge((payload, state) => {
      return {
        getFeedbackListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
