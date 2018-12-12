import merge from 'REDUCER/merge';
import DepartGroupAction from 'ACTION/Common/DepartGroupAction';

const STATE_NAME = 'state_mams_departgroup_list';

const {
  GetBrokerDepartList
} = DepartGroupAction;

function InitialState() {
  return {
    departGroupList: []
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [GetBrokerDepartList]: (payload, state) => {
      return {
        departGroupList: []
      };
    },
    [GetBrokerDepartList.success]: merge((payload, state) => {
      return {
        departGroupList: (payload.Data || {}).RecordList || []
      };
    }),
    [GetBrokerDepartList.error]: (payload, state) => {
      return {
        departGroupList: []
      };
    }
  }
};