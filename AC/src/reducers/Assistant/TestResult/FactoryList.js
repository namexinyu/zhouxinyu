import moment from 'moment';
import merge from '../../merge';
import TestResult from 'ACTION/Assistant/TestResult';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getFactoryTestList,
  GetBrokerDepartList
} = TestResult;

const STATE_NAME = 'state_ac_FactoryTestResult';

function InitialState() {
  return {
    factoryTestListtFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    factoryTestList: [],
    DepartList: [],
    recordTotalCount: 0,
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
    [getFactoryTestList]: merge((payload, state) => {
      return {
        factoryTestListtFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getFactoryTestList.success]: merge((payload, state) => {
      return {
        factoryTestListtFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        factoryTestList: (payload.Data || {}).RecordList || [],
        RecordCount: payload.Data.RecordCount || ''
      };
    }),
    [getFactoryTestList.error]: merge((payload, state) => {
      return {
        factoryTestListtFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        factoryTestList: [],
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
