import moment from 'moment';

import merge from 'REDUCER/merge';

// import BaikeActions from "ACTION/Business/Baike/index";
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

// const {
//   getCategoriesList
// } = BaikeActions;

const STATE_NAME = 'state_business_bake';

function InitialState() {
  return {
    getCategoriesListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    BaikeUpdatePageParams: {
      CategoryInput: {
        value: ''
      },
      TitleInput: {
        value: ''
      },
      EditorUpdateContent: '',
      needFetch: true
    },
    BaikeAddPageParams: {
      CategoryInput: {
        value: ''
      },
      TitleInput: {
        value: ''
      },
      EditorAddingContent: ''
    },
    actieTab: '',
    RecordIndex: 0,
    RecordSize: 20,
    categoryList: [],
    docList: [],
    docRecordCount: 0,
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
    })
    // [getCategoriesList]: merge((payload, state) => {
    //   return {
    //     getCategoriesListFetch: {
    //       status: 'pending'
    //     },
    //     isFetching: true
    //   };
    // }),
    // [getCategoriesList.success]: merge((payload, state) => {
    //   return {
    //     getCategoriesListFetch: {
    //       status: 'success',
    //       response: payload
    //     },
    //     isFetching: false,
    //     categoryList: (payload.Data || {}).RecordList || [],
    //     categoryRecordCount: (payload.Data || {}).RecordCount || 0
    //   };
    // }),
    // [getCategoriesList.error]: merge((payload, state) => {
    //   return {
    //     getCategoriesListFetch: {
    //       status: 'error',
    //       response: payload
    //     },
    //     isFetching: false
    //   };
    // })
  }
};
