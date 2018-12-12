import moment from 'moment';

import merge from 'REDUCER/merge';

// import BaikeActions from "ACTION/Business/Baike/index";
import Store from 'ACTION/Business/Store/index';

const {
    GetHubList
} = Store;

const STATE_NAME = 'Distribution';

function InitialState() {
  return {
    getCategoriesListFetch: {
      status: 'pending',
      response: ''
    },
   StoreList: []
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [GetHubList]: merge((payload, state) => {
      return {
        getCategoriesListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [GetHubList.success]: merge((payload, state) => {
        
        let list = [];
        payload.Data.HubAreaList.map((item) => {
            item.HubList.map((ite) => {
                list.push(ite);
            });
        });
      return {
        getCategoriesListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        StoreList: list || []
      };
    }),
    [GetHubList.error]: merge((payload, state) => {
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
