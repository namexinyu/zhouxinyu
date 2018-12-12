import merge from 'REDUCER/merge';

import CooperationAction from "ACTION/Business/Cooperation/index";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_business_cooperation';

const {
  getCooperationList
} = CooperationAction;

function InitialState() {
  return {
    getCooperationListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    cooperationList: [],
    RecordCount: 0,
    pageQueryParams: {
      StartDate: {
        value: null
      },
      EndDate: {
        value: null
      },
      Name: {
        value: ''
      },
      Mobile: {
        value: ''
      },
      RecordIndex: 0,
      RecordSize: 40
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
    [getCooperationList]: merge((payload, state) => {
      return {
        getCooperationListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getCooperationList.success]: merge((payload, state) => {
      return {
        getCooperationListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        cooperationList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getCooperationList.error]: merge((payload, state) => {
      return {
        getCooperationListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
