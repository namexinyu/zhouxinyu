import merge from 'REDUCER/merge';

import StaffManageAction from "ACTION/Business/StaffManage/index";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const STATE_NAME = 'state_servicer_staff_list';

const {
  getServiceStaffList
} = StaffManageAction;

function InitialState() {
  return {
    getServiceStaffListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    staffList: [],
    RecordCount: 0,
    pageQueryParams: {
      RecruitName: {
        value: {
          value: '',
          text: ''
        }
      },
      LaborName: {
        value: {
          value: '',
          text: ''
        }
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
    [getServiceStaffList]: merge((payload, state) => {
      return {
        getServiceStaffListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getServiceStaffList.success]: merge((payload, state) => {
      return {
        getServiceStaffListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        staffList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getServiceStaffList.error]: merge((payload, state) => {
      return {
        getServiceStaffListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
