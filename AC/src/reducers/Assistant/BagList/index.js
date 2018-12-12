import moment from 'moment';

import merge from '../../merge';

import bagListAction from 'ACTION/Assistant/BagListAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getBagList,
  getRecruitBasicCount
} = bagListAction;

const STATE_NAME = 'state_ac_bag_list';

function InitialState() {
  return {
    getBagListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    textDecorationType: '',
    bagList: [],
    recordTotalCount: 0,
    pageQueryParams: {
      MatchUserName: {
        value: ''
      },
      UserMobile: {
        value: ''
      },
      RecruitTmpID: {
        value: {
          value: '',
          text: ''
        }
      },
      CaseStatus: {
        value: '-1'
      },
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
      },
      DepartmentGroup: {
        value: []
      },
      BrokerAccount: {
        value: ''
      },
      PageInfo: {
        Count: 40,
        Offset: 0
      }
    },
    getRecruitBasicCountFetch: {
      status: 'pending',
      response: ''
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
    [getBagList]: merge((payload, state) => {
      return {
        getBagListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getBagList.success]: merge((payload, state) => {
      return {
        getBagListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        bagList: (payload.Data || {}).RecordList || [],
        recordTotalCount: ((payload.Data || {}).PageInfo || {}).TotalCount
      };
    }),
    [getBagList.error]: merge((payload, state) => {
      return {
        getBagListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        bagList: [],
        recordTotalCount: 0
      };
    }),
    [getRecruitBasicCount]: merge((payload, state) => {
      return {
        getRecruitBasicCountFetch: {
          status: 'pending'
        }
      };
    }),
    [getRecruitBasicCount.success]: merge((payload, state) => {
      return {
        getRecruitBasicCountFetch: {
          status: 'success',
          response: payload
        },
        DayDealCnt: (payload.Data || {}).DayDealCnt || 0,
        TodayEnrolCnt: (payload.Data || {}).TodayEnrolCnt || 0,
        TommrowEnrolCnt: (payload.Data || {}).TommrowEnrolCnt || 0
      };
    }),
    [getRecruitBasicCount.error]: merge((payload, state) => {
      return {
        getRecruitBasicCountFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
