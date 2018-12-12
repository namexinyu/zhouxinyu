import moment from 'moment';

import merge from '../../merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import TagsAction from 'ACTION/Assistant/TagsAction';

const {
  getTagList,
  getAllTagList
} = TagsAction;

const STATE_NAME = 'state_ac_tag_list';

function InitialState() {
  return {
    getTagListFetch: {
      status: 'pending',
      response: ''
    },
    tagList: [],
    allTagList: [],
    RecordCount: 0,
    pageQueryParams: {
      TagName: {
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
    [getTagList]: merge((payload, state) => {
      return {
        getTagListFetch: {
          status: 'pending'
        }
      };
    }),
    [getTagList.success]: merge((payload, state) => {
      return {
        getTagListFetch: {
          status: 'success',
          response: payload
        },
        tagList: (payload.Data || {}).RecordList || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getTagList.error]: merge((payload, state) => {
      return {
        getTagListFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [getAllTagList]: merge((payload, state) => {
      return {
        getAllTagListFetch: {
          status: 'pending'
        }
      };
    }),
    [getAllTagList.success]: merge((payload, state) => {
      return {
        getAllTagListFetch: {
          status: 'success',
          response: payload
        },
        allTagList: (payload.Data || {}).RecordList || []
      };
    }),
    [getAllTagList.error]: merge((payload, state) => {
      return {
        getAllTagListFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
