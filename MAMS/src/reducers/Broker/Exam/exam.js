import moment from 'moment';
import merge from '../../merge';
import GetUnFamiliar from 'ACTION/Broker/Exam/exam';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getExamList
} = GetUnFamiliar;

const STATE_NAME = 'state_ac_GetUnFamiliarList';

function InitialState () {
  return {
    GetUnFamiliarListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    GetUnFamiliarList: [],
    ExamedNumber: 0,
    UnFamiliarNumber: 0,
    recordTotalCount: 0,
    RecordCount: 0,
    QueryType: '1',
    pageParams: {
      RecordIndex: 0,
      RecordSize: 20
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
    })
  }
};
