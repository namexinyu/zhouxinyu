
import merge from '../../merge';
import moment from 'moment';
import TestResult from 'ACTION/Assistant/TestResult';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getMemberTestList,
  GetBrokerDepartList
} = TestResult;

const STATE_NAME = 'state_ac_MemberTestResult';

function InitialState() {
  return {
    state_name: STATE_NAME,
    memberTestListtFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    memberTestList: [],
    DepartList: [],
    RecordCount: 0,
    pageQueryParams: {
      BrokerName: '',
      QueryDate: moment(new Date()),
      DepartID: '',
      GroupID: ''
    },
    pageParams: {
      RecordIndex: 0,
      RecordSize: 40
    },
    groupID: {}
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
    [getMemberTestList]: merge((payload, state) => {
      return {
        getMemberTestListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getMemberTestList.success]: merge((payload, state) => {
      return {
        getMemberTestListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        memberTestList: (payload.Data || {}).RecordList || [],
        RecordCount: payload.Data.RecordCount || ''
      };
    }),
    [getMemberTestList.error]: merge((payload, state) => {
      return {
        getMemberTestListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        memberTestList: [],
        RecordCount: 0
      };
    }),
    [GetBrokerDepartList]: merge((payload, state) => {
      return {
        GetBrokerDepartListFetch: {
          status: 'pending'
        }
      };
    }),
    [GetBrokerDepartList.success]: merge((payload, state) => {
      let list = payload.Data ? payload.Data.RecordList || [] : [];
      return {
        GetBrokerDepartListFetch: {
          status: 'success',
          response: payload
        },
        DepartList: list
      };
    }),
    [GetBrokerDepartList.error]: merge((payload, state) => {
      return {
        GetBrokerDepartListFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
