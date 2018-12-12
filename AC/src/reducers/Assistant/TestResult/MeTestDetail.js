
import merge from '../../merge';
import TestResult from 'ACTION/Assistant/TestResult';
const {
  getMemberDetail
} = TestResult;

function InitialState() {
  return {
    getMemberDetailFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    memberTestDetail: [],
    recordTotalCount: 0
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [getMemberDetail]: merge((payload, state) => {
      return {
        getDetailFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getMemberDetail.success]: merge((payload, state) => {
      return {
        getDetailFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        memberTestDetail: (payload.Data || {}).RecordList || []
      };
    }),
    [getMemberDetail.error]: merge((payload, state) => {
      return {
        getDetailFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false,
        memberTestDetail: [],
        recordTotalCount: 0
      };
    })
  }
};
