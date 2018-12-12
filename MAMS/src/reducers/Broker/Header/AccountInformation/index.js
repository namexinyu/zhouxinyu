import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import { accountInformationGet, accountInformationSetStatus } from 'ACTION/Broker/Header/AccountInformation';

const STATE_NAME = 'state_broker_header_accountInfo';

function InitialState () {
  return {
    WorkingStatus: 0, // 工作状态：1、工作中 2、休息中
    TeamName: '', // 所在团队名称
    Likes: 0, // 被点赞次数
    ModalExamVisible: false,
    ModalFactoryVisible: false,
    ModalExamTestVisible: false,
    bPopup: true,
    accountInformationGetFetch: {
      status: 'close',
      response: ''
    },
    accountInformationSetStatusFetch: {
      status: 'close',
      response: ''
    }
  };
}

const Reducer = {
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
    [accountInformationGet]: merge((payload, state) => {
      return {
        accountInformationGetFetch: {
          status: 'pending'
        }
      };
    }),
    [accountInformationGet.success]: merge((payload, state) => {
      return {
        accountInformationGetFetch: {
          status: 'success',
          response: payload
        },
        ...payload.Data
      };
    }),
    [accountInformationGet.error]: merge((payload, state) => {
      return {
        accountInformationGetFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [accountInformationSetStatus]: merge((payload, state) => {
      return {
        accountInformationSetStatusFetch: {
          status: 'pending'
        }
      };
    }),
    [accountInformationSetStatus.success]: merge((payload, state) => {
      return {
        accountInformationSetStatusFetch: {
          status: 'success',
          response: payload
        }
      };

    }),
    [accountInformationSetStatus.error]: merge((payload, state) => {
      return {
        accountInformationSetStatusFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
export default Reducer;