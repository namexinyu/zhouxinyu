import moment from 'moment';

import merge from '../../merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import TagsAction from 'ACTION/Assistant/TagsAction';

const {
  getTagMatchList,
  getMatchTags
} = TagsAction;

const STATE_NAME = 'state_ac_tag_match';

function InitialState() {
  return {
    getTagMatchListFetch: {
      status: 'pending',
      response: ''
    },
    // getMatchTagsFetch: {
    //   status: 'pending',
    //   response: ''
    // },
    isFetching: false,
    tagMatchList: [],
    // matchTags: [],
    RecordCount: 0,
    pageQueryParams: {
      RecruitTmpID: {
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
    [getTagMatchList]: merge((payload, state) => {
      return {
        getTagMatchListFetch: {
          status: 'pending'
        }
      };
    }),
    [getTagMatchList.success]: merge((payload, state) => {
      const tagMatchList = ((payload.Data || {}).RecordList || []).map(item => {
        return {
          ...item,
          TagList: item.TagList || []
        };
      });
      return {
        getTagMatchListFetch: {
          status: 'success',
          response: payload
        },
        tagMatchList: tagMatchList,
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getTagMatchList.error]: merge((payload, state) => {
      return {
        getTagMatchListFetch: {
          status: 'error',
          response: payload
        }
      };
    })
    // [getMatchTags]: merge((payload, state) => {
    //   return {
    //     getMatchTagsFetch: {
    //       status: 'pending'
    //     }
    //   };
    // }),
    // [getMatchTags.success]: merge((payload, state) => {
    //   return {
    //     getMatchTagsFetch: {
    //       status: 'success',
    //       response: payload
    //     },
    //     matchTags: ((payload.Data || {}).TagCommonList || []).map(item => {
    //       return {
    //         ...item,
    //         checkedValue: '',
    //         checked: false
    //       };
    //     })
    //   };
    // }),
    // [getMatchTags.error]: merge((payload, state) => {
    //   return {
    //     getMatchTagsFetch: {
    //       status: 'error',
    //       response: payload
    //     }
    //   };
    // })
  }
};
