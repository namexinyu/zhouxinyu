import moment from 'moment';

import getMonthDays from 'UTIL/base/getMonthDays';
import merge from '../../merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ReportAction from 'ACTION/Assistant/ReportAction';

const {
  getBorkerScheduleList
} = ReportAction;

const STATE_NAME = 'state_ac_broker_schedule';

function InitialState() {
  return {
    getBorkerScheduleListFetch: {
      status: 'pending',
      response: ''
    },
    isFetching: false,
    scheduleList: [],
    totalInfoList: [],
    totalInfo: {},
    RecordCount: 0,
    monthDays: getMonthDays(),
    pageQueryParams: {
      Date: {
        value: moment()
      },
      DepartmentGroup: {
        value: []
      },
      BrokerAccount: {
        value: ''
      },
      RecordIndex: 0,
      RecordSize: 20
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
    [getBorkerScheduleList]: merge((payload, state) => {
      return {
        getBorkerScheduleListFetch: {
          status: 'pending'
        },
        isFetching: true
      };
    }),
    [getBorkerScheduleList.success]: merge((payload, state) => {
      console.log('fetch success', state);
      const {
        monthDays
      } = state;
      return {
        getBorkerScheduleListFetch: {
          status: 'success',
          response: payload
        },
        isFetching: false,
        totalInfoList: (payload.Data || {}).EachDayNumList || [],
        totalInfo: {
          BrokerNickName: '统计（总休息天数）',
          SleepDays: ((payload.Data || {}).EachDayNumList || []).reduce((initialValue, item) => {
            return initialValue + item.TheNumber;
          }, 0),
          DayStats: monthDays.reduce((wrap, timeItem) => {
            const findedItem = ((payload.Data || {}).EachDayNumList || []).filter(cur => cur.TheDay === +timeItem.date);
            wrap[timeItem.date] = findedItem.length ? findedItem[0].TheNumber : 0;
            return wrap;
          }, {})
        },
        scheduleList: ((payload.Data || {}).EmployeeList || []).map(item => {
          return {
            ...item,
            WillInStatusMap: monthDays.reduce((wrap, timeItem) => {
              const findedItem = (item.WillInStatusList || []).filter(cur => cur.TheDay === +timeItem.date);
              wrap[timeItem.date] = {
                WillInStatus: findedItem.length ? findedItem[0].WillInStatus : -1,
                visible: false
              };
              return wrap;
            }, {})
          };
        }),
        RecordCount: (payload.Data || {}).TotalNumber || 0
      };
    }),
    [getBorkerScheduleList.error]: merge((payload, state) => {
      return {
        getBorkerScheduleListFetch: {
          status: 'error',
          response: payload
        },
        isFetching: false
      };
    })
  }
};
