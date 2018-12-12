import moment from 'moment';

import merge from 'REDUCER/merge';

import ResettlementScheme from "ACTION/Business/ResettlementScheme/index";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
  GetAllotList
} = ResettlementScheme;

const STATE_NAME = 'BusinessAffairs';

function InitialState() {
  return {
    getCategoriesListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    queryParams: {
      RecruitTmpID: {
        value: ""
      }, 
      LaborID: {
        value: ""
      }, 
      RecruitDate: {
        value: moment()
      },
      AllotType: {
        value: ""
      }
    },
    SubsidyList: [],
    actieTab: '',
    RecordIndex: 0,
    RecordSize: 10,
    RecordList: [],
    docList: [],
    RecordCount: 0,
    // categoryRecordCount: 0,
    SearchKey: ''
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
    [GetAllotList]: merge((payload, state) => {
      return {
        getCategoriesListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [GetAllotList.success]: merge((payload, state) => {
      return {
        getCategoriesListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        RecordList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [GetAllotList.error]: merge((payload, state) => {
      return {
        getCategoriesListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
    
  }
};
