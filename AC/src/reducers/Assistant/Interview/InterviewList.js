import moment from 'moment';

import merge from '../../merge';

import DailyAction from 'ACTION/Assistant/DailyAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getInterviewList,
  getInterviewCountdown
} = DailyAction;

const STATE_NAME = 'state_ac_interviewList';

function InitialState() {
  return {
    getInterviewListFetch: {
      status: 'pending',
      response: ''
    },
    getInterviewCountdownFetch: {
      status: 'pending',
      response: ''
    },
    SubsidyData: {},
    isFetching: false,
    interviewList: [],
    recordTotalCount: 0,
    pageQueryParams: {
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
      },
      RealName: {
        value: ''
      },
      Mobile: {
        value: ''
      },
      CheckinRecruitID: {
        value: {
          value: '',
          text: ''
        }
      },
      JFFInterviewStatus: {
        value: '-1'
      },
      BrokerInterviewStatus: {
        value: '0'
      },
      InterviewStatus: {
        value: '0'
      },
      BrokerAccount: {
        value: ''
      },
      PayType: {
        value: '-1'
      },
      DepartmentGroup: {
        value: []
      },
      orderInfo: {
        key: 'CheckinTime',
        order: 2 // 降序
      },
      PageInfo: {
        Count: 40,
        Offset: 0
      }
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
    [getInterviewList]: merge((payload, state) => {
      return {
        getInterviewListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getInterviewList.success]: merge((payload, state) => {
      return {
        getInterviewListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        interviewList: (payload.Data || {}).RecordList || [],
        recordTotalCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getInterviewList.error]: merge((payload, state) => {
      return {
        getInterviewListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        interviewList: [],
        recordTotalCount: 0
      };
    }),
    [getInterviewCountdown]: merge((payload, state) => {
      return {
        getInterviewCountdownFetch: {
          status: 'pending'
        }
      };
    }),
    [getInterviewCountdown.success]: merge((payload, state) => {
      return {
        getInterviewCountdownFetch: {
          status: 'success',
          response: payload
        },
        SubsidyData: payload.Data || {}
      };
    }),
    [getInterviewCountdown.error]: merge((payload, state) => {
      return {
        getInterviewCountdownFetch: {
          status: 'error',
          response: payload
        },
        SubsidyData: {}
      };
    })
  }
};
