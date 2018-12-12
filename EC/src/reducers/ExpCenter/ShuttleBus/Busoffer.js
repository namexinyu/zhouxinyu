import merge from '../../merge';

import BusOfferAction from 'ACTION/ExpCenter/ShuttleBus/BusOfferAction';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
    getBusOfferRouteList
} = BusOfferAction;

const STATE_NAME = 'state_ec_busoffer';

function InitialState() {
  return {
    getBusOfferRouteListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    busRouteList: [],
    RecordCount: 0,
    pageQueryParams: {
      OriginHub: {
        value: '0'
      },
      DestHub: {
        value: '0'
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
    [getBusOfferRouteList]: merge((payload, state) => {
      return {
        getBusOfferRouteListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getBusOfferRouteList.success]: merge((payload, state) => {
      return {
        getBusOfferRouteListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        busRouteList: (payload.Data || {}).RecordObject || [],
        RecordCount: (payload.Data || {}).RecordCount || 0
      };
    }),
    [getBusOfferRouteList.error]: merge((payload, state) => {
      return {
        getBusOfferRouteListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
