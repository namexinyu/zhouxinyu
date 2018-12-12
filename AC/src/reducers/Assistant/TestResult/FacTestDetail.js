
import merge from '../../merge';
import TestResult from 'ACTION/Assistant/TestResult';

const {
  getFactoryDetail
} = TestResult;

const STATE_NAME = 'state_ac_FactoryDetail';

function InitialState() {
  return {
    getListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    factoryTestDetail: [],
    recordTotalCount: 0
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [getFactoryDetail]: merge((payload, state) => {
      return {
        getListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getFactoryDetail.success]: merge((payload, state) => {
      return {
        getListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        factoryTestDetail: (payload.Data || {}).RecordList || []
      };
    }),
    [getFactoryDetail.error]: merge((payload, state) => {
      return {
        getListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        factoryTestDetail: [],
        recordTotalCount: 0
      };
    })
  }
};
