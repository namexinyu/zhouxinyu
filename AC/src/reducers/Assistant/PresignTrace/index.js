import moment from 'moment';

import merge from '../../merge';

import presignTraceAction from 'ACTION/Assistant/PresignTraceAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  getPresignTraceList
} = presignTraceAction;

const STATE_NAME = 'state_ac_presign_trace';

function InitialState() {
  return {
    getPresignTraceListFetch: {
      status: 'pending',
      response: ''
    },
    presignTraceList: [],
    TotalInfo: {},
    pageQueryParams: {
      Department: {
        value: '0'
      },
      ExpectedDate: {
        value: [moment().startOf('month'), moment()]
      },
      PageInfo: {
        Count: 9999,
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
    [getPresignTraceList]: merge((payload, state) => {
      return {
        getPresignTraceListFetch: {
          status: 'pending'
        }
      };
    }),
    [getPresignTraceList.success]: merge((payload, state) => {
      return {
        getPresignTraceListFetch: {
          status: 'success',
          response: payload
        },
        presignTraceList: ((payload.Data || {}).Data || {}).DepartList || [],
        TotalInfo: {
          ...(((payload.Data || {}).Data || {}).PreOrderData || {}),
          BrokerCount: ((payload.Data || {}).Data || {}).BrokerCount || 0
        }
      };
    }),
    [getPresignTraceList.error]: merge((payload, state) => {
      return {
        getPresignTraceListFetch: {
          status: 'error',
          response: payload
        },
        presignTraceList: [],
        TotalInfo: {}
      };
    })
  }
};
