import moment from 'moment';
import merge from '../../merge';
import TestResult from 'ACTION/Assistant/TestResult';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  GetBrokerDepartList,
  getExamList
} = TestResult;

const STATE_NAME = 'state_ac_GetUnFamiliarList';

function InitialState () {
  return {
    state_name: STATE_NAME,
    GetUnFamiliarListFetch: {
      status: 'pending',
      response: ''
    },

    isFetching: false,
    DepartList: [],
    GetUnFamiliarList: [],
    ExamedNumber: 0,
    UnFamiliarNumber: 0,
    recordTotalCount: 0,
    RecordCount: 0,
    pageQueryParams: {
      Search: '',
      DepartID: '',
      QueryType: '1',
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
    [getExamList]: merge((payload, state) => {
      return {
        GetUnFamiliarListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getExamList.success]: merge((payload, state) => {
      return {
        GetUnFamiliarListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        GetUnFamiliarList: (payload.Data || {}).RecordList || [],
        ExamedNumber: payload.Data.ExamedNumber,
        UnFamiliarNumber: payload.Data.UnFamiliarNumber,
        RecordCount: payload.Data.UnFamiliarNumber || ''
      };
    }),
    [getExamList.error]: merge((payload, state) => {
      return {
        GetUnFamiliarListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        GetUnFamiliarList: [],
        ExamedNumber: 0,
        UnFamiliarNumber: 0,
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
      return {
        GetBrokerDepartListFetch: {
          status: 'success',
          response: payload
        },
        DepartList: payload.Data.RecordList
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
