import merge from '../../merge';
import moment from 'moment';

import BelongingSplitAction from 'ACTION/Assistant/BelongingSplitAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getSplitLogList,
  getCertMember
} = BelongingSplitAction;

const STATE_NAME = 'state_ac_belonging_split';

function InitialState() {
  return {
    getSplitLogListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    SplitLogList: [],
    RecordCount: 0,
    pageQueryParams: {
      UserName: {
        value: ''
      },
      Mobile: {
        value: ''
      },
      NewBroker: {
        value: ''
      },
      OldBroker: {
        value: ''
      },
      OperatorName: {
        value: ''
      },
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
      },
      RecordIndex: 0,
      RecordSize: 40
    },
    CertMemberInfo: {
      CertUserNums: 0,
      UnCertUserNums: 0
    },
    BatchSplitParams: {
      BeSplitBrokerAccount: '',
      BeSplitBrokerNickname: '',
      InterviewStartDate: null,
      InterviewEndDate: null,
      RegisterStartDate: null,
      RegisterEndDate: null,
      CertMemberCount: '',
      UnCertMemberCount: '',
      SplitBrokerAccountBody: [{
        account: '',
        nickName: '',
        certMemberCount: '0',
        unCertMemberCount: '0'
      }]
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
    [getSplitLogList]: merge((payload, state) => {
      return {
        getSplitLogListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getSplitLogList.success]: merge((payload, state) => {
      return {
        getSplitLogListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        SplitLogList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getSplitLogList.error]: merge((payload, state) => {
      return {
        getSplitLogListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    }),
    [getCertMember]: merge((payload, state) => {
      return {
        getCertMemberFetch: {
          status: 'pending'
        }
      };
    }),
    [getCertMember.success]: merge((payload, state) => {
      return {
        getCertMemberFetch: {
          status: 'success',
          response: payload
        },
        CertMemberInfo: {
          CertUserNums: (payload.Data || {}).CertUserNums || 0,
          UnCertUserNums: (payload.Data || {}).UnCertUserNums || 0
        }
      };
    }),
    [getCertMember.error]: merge((payload, state) => {
      return {
        getCertMemberFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
