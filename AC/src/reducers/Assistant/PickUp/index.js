import moment from 'moment';

import merge from '../../merge';

import DailyAction from 'ACTION/Assistant/DailyAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getPickUpList
} = DailyAction;

const STATE_NAME = 'state_ac_pickUpList';

function InitialState() {
  return {
    getPickUpListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    pickUpList: [],
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
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
      },
      VisitStatus: {
        value: '-1'
      },
      IsSign: {
        value: '-1'
      },
      BrokerAccount: {
        value: ''
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
    [getPickUpList]: merge((payload, state) => {
      return {
        getPickUpListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getPickUpList.success]: merge((payload, state) => {
      return {
        getPickUpListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        pickUpList: (payload.Data || {}).RecordList || [],
        recordTotalCount: ((payload.Data || {}).PageInfo || {}).TotalCount
      };
    }),
    [getPickUpList.error]: merge((payload, state) => {
      return {
        getPickUpListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        pickUpList: [],
        recordTotalCount: 0
      };
    })
  }
};
